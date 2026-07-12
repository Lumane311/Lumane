// pages/api/save-lead.js
// Guarda cada email capturado en el quiz como lead en Upstash KV.
// Estos leads son ORO: son tu lista para emails de venta con Resend.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source } = req.body || {};
  const clean = String(email || '').trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  try {
    const value = JSON.stringify({
      email: clean,
      source: source || 'quiz',
      date: new Date().toISOString(),
    });

    const r = await fetch(
      `${process.env.KV_REST_API_URL}/set/${encodeURIComponent('lead:' + clean)}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
        body: value,
      }
    );

    if (!r.ok) throw new Error('KV error');

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('save-lead error:', e);
    return res.status(500).json({ error: 'Error guardando lead' });
  }
}
