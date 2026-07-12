// pages/api/wompi-webhook.js
// Recibe eventos de Wompi (Colombia), verifica el checksum y guarda
// el estado de la suscripción en Upstash KV bajo la clave sub:{email}.
// Requiere WOMPI_EVENTS_SECRET en Vercel (lo encuentras en tu panel
// de Wompi → Desarrolladores → "Secreto de Eventos").

import crypto from 'crypto';

async function kvSet(key, value) {
  const r = await fetch(`${process.env.KV_REST_API_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
    body: value,
  });
  if (!r.ok) throw new Error('KV set failed: ' + (await r.text()));
}

// Obtiene un valor anidado como "transaction.id" desde event.data
function getNested(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const event = req.body;
  const secret = process.env.WOMPI_EVENTS_SECRET;

  // ── Verificar checksum de Wompi (si el secreto está configurado) ──
  if (secret && event && event.signature && event.signature.checksum) {
    try {
      const props = event.signature.properties || [];
      let concat = '';
      for (const p of props) {
        concat += String(getNested(event.data, p));
      }
      concat += String(event.timestamp) + secret;
      const checksum = crypto.createHash('sha256').update(concat).digest('hex').toUpperCase();
      if (checksum !== String(event.signature.checksum).toUpperCase()) {
        return res.status(401).json({ error: 'Firma inválida' });
      }
    } catch (e) {
      return res.status(401).json({ error: 'Error verificando firma' });
    }
  }

  try {
    const tx = event && event.data && event.data.transaction;

    if (tx && tx.status === 'APPROVED') {
      const email = (tx.customer_email || '').toLowerCase();
      if (email) {
        await kvSet(
          'sub:' + email,
          JSON.stringify({
            status: 'active',
            gateway: 'wompi',
            reference: tx.reference || null,
            transactionId: tx.id || null,
            amountInCents: tx.amount_in_cents || null,
            currency: tx.currency || 'COP',
            paymentMethod: tx.payment_method_type || null,
            date: new Date().toISOString(),
          })
        );
      }
    }

    // Siempre responder 200 para que Wompi no reintente en bucle
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error('Wompi webhook error:', e);
    return res.status(500).json({ error: 'Error interno' });
  }
}
