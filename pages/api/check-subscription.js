// pages/api/check-subscription.js
// Verifica el estado REAL de la suscripción contra la base de datos KV.
// El frontend consulta aquí en vez de confiar en localStorage.

export default async function handler(req, res) {
  const email = String(req.query.email || '').trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(200).json({ status: 'none' });
  }

  try {
    const r = await fetch(
      `${process.env.KV_REST_API_URL}/get/${encodeURIComponent('sub:' + email)}`,
      { headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` } }
    );

    if (!r.ok) return res.status(200).json({ status: 'none' });

    const d = await r.json();
    if (d && d.result) {
      const sub = JSON.parse(d.result);
      return res.status(200).json({
        status: sub.status === 'active' ? 'active' : 'none',
        gateway: sub.gateway || null,
        plan: sub.plan || null,
      });
    }

    return res.status(200).json({ status: 'none' });
  } catch (e) {
    console.error('check-subscription error:', e);
    return res.status(200).json({ status: 'none' });
  }
}
