// pages/api/stripe-webhook.js
// Recibe eventos de Stripe, verifica la firma y guarda el estado
// de la suscripción en Upstash KV bajo la clave sub:{email}.
// Requiere STRIPE_WEBHOOK_SECRET en Vercel (ya la tienes ✅).

import crypto from 'crypto';

export const config = {
  api: { bodyParser: false }, // Stripe necesita el body crudo para verificar la firma
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function verifyStripeSignature(rawBody, sigHeader, secret) {
  if (!sigHeader || !secret) return false;
  try {
    const parts = {};
    sigHeader.split(',').forEach((p) => {
      const [k, v] = p.split('=');
      parts[k] = v;
    });
    if (!parts.t || !parts.v1) return false;
    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${parts.t}.${rawBody}`)
      .digest('hex');
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
  } catch (e) {
    return false;
  }
}

async function kvSet(key, value) {
  const r = await fetch(`${process.env.KV_REST_API_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
    body: value,
  });
  if (!r.ok) throw new Error('KV set failed: ' + (await r.text()));
}

async function kvGet(key) {
  const r = await fetch(`${process.env.KV_REST_API_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
  });
  if (!r.ok) return null;
  const d = await r.json();
  return d && d.result ? d.result : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = await readRawBody(req);
  const signature = req.headers['stripe-signature'];

  if (!verifyStripeSignature(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)) {
    return res.status(400).json({ error: 'Firma inválida' });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (e) {
    return res.status(400).json({ error: 'JSON inválido' });
  }

  try {
    // ── Pago completado: activar Premium ──────────────────────────
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email = (
        (session.customer_details && session.customer_details.email) ||
        session.customer_email ||
        ''
      ).toLowerCase();

      if (email) {
        await kvSet(
          'sub:' + email,
          JSON.stringify({
            status: 'active',
            gateway: 'stripe',
            customerId: session.customer || null,
            subscriptionId: session.subscription || null,
            plan: (session.metadata && session.metadata.plan) || null,
            amount: session.amount_total || null,
            currency: session.currency || null,
            date: new Date().toISOString(),
          })
        );
        // Mapa customerId → email (para poder cancelar después)
        if (session.customer) {
          await kvSet('cust:' + session.customer, email);
        }
      }
    }

    // ── Suscripción cancelada: desactivar Premium ──────────────────
    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      const email = await kvGet('cust:' + sub.customer);
      if (email) {
        await kvSet(
          'sub:' + email,
          JSON.stringify({
            status: 'canceled',
            gateway: 'stripe',
            customerId: sub.customer,
            date: new Date().toISOString(),
          })
        );
      }
    }

    // ── Pago recurrente fallido: desactivar Premium ────────────────
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      const email = (invoice.customer_email || '').toLowerCase();
      if (email) {
        await kvSet(
          'sub:' + email,
          JSON.stringify({
            status: 'payment_failed',
            gateway: 'stripe',
            customerId: invoice.customer || null,
            date: new Date().toISOString(),
          })
        );
      }
    }

    return res.status(200).json({ received: true });
  } catch (e) {
    console.error('Stripe webhook error:', e);
    return res.status(500).json({ error: 'Error interno' });
  }
}
