import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body;

    // Wompi envía el evento con esta estructura: { event: "transaction.updated", data: { transaction: {...} } }
    const tx = event?.data?.transaction;
    if (!tx) {
      return res.status(200).json({ received: true, ignored: true });
    }

    if (tx.status === 'APPROVED') {
      const record = {
        id: tx.id,
        gateway: 'wompi',
        email: tx.customer_email || 'sin-correo',
        name: tx.customer_data?.full_name || '',
        plan: (tx.reference || '').split('-')[1]?.toLowerCase() || 'desconocido',
        amount: tx.amount_in_cents ? tx.amount_in_cents / 100 : 0,
        currency: tx.currency || 'COP',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      await kv.set(`subscriber:wompi:${tx.id}`, record);
      await kv.sadd('subscribers:all', `wompi:${tx.id}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Wompi webhook error:', err);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}
