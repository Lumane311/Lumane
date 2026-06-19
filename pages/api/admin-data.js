import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { password } = req.method === 'POST' ? req.body : req.query;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  try {
    const keys = await kv.smembers('subscribers:all');
    const subscribers = [];
    for (const k of keys) {
      const rec = await kv.get(`subscriber:${k}`);
      if (rec) subscribers.push(rec);
    }
    subscribers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalActive = subscribers.filter(s => s.status === 'active').length;
    const totalCancelled = subscribers.filter(s => s.status === 'cancelled').length;
    const totalRevenue = subscribers
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + (s.gateway === 'wompi' ? s.amount / 4000 : s.amount), 0); // normaliza COP a USD aprox

    res.status(200).json({
      subscribers,
      stats: { totalActive, totalCancelled, totalRevenue: totalRevenue.toFixed(2) },
    });
  } catch (err) {
    console.error('Admin data error:', err);
    res.status(500).json({ error: 'Error leyendo datos' });
  }
}
