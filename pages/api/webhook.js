import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  // ✅ Pago completado — suscripción activada
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('✅ Pago completado:', {
      customer: session.customer,
      email: session.customer_details?.email,
      subscription: session.subscription,
      plan: session.metadata?.plan,
    });
    // Aquí podrías guardar en base de datos si tuvieras una
    // Por ahora el acceso se maneja via localStorage en el cliente
  }

  // ✅ Trial terminó y se cobró exitosamente
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object;
    console.log('✅ Factura pagada:', invoice.customer_email);
  }

  // ❌ Pago falló
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object;
    console.log('❌ Pago fallido:', invoice.customer_email);
  }

  // ❌ Suscripción cancelada
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    console.log('❌ Suscripción cancelada:', subscription.customer);
  }

  res.status(200).json({ received: true });
}
