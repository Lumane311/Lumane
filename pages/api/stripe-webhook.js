import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

async function kvSet(key, value) {
  await fetch(`${KV_URL}/set/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  });
}

async function kvSadd(setKey, member) {
  await fetch(`${KV_URL}/sadd/${setKey}/${encodeURIComponent(member)}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
}

async function kvSmembers(key) {
  const res = await fetch(`${KV_URL}/smembers/${key}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  const data = await res.json();
  return data.result || [];
}

async function kvGet(key) {
  const res = await fetch(`${KV_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  const data = await res.json();
  if (!data.result) return null;
  try { return JSON.parse(data.result); } catch (e) { return data.result; }
}

export const config = {
  api: { bodyParser: false },
};

function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on('data', (chunk) => chunks.push(chunk));
    readable.on('end', () => resolve(Buffer.concat(chunks)));
    readable.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email || session.customer_email || 'sin-correo';
      const record = {
        id: session.id,
        gateway: 'stripe',
        email: customerEmail,
        name: session.customer_details?.name || '',
        plan: session.metadata?.plan || 'desconocido',
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency || 'usd',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      await kvSet(`subscriber:stripe:${session.id}`, record);
      await kvSadd('subscribers:all', `stripe:${session.id}`);
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      const keys = await kvSmembers('subscribers:all');
      for (const k of keys) {
        const rec = await kvGet(`subscriber:${k}`);
        if (rec && rec.subscriptionId === sub.id) {
          rec.status = 'cancelled';
          await kvSet(`subscriber:${k}`, rec);
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}
