// Usa Upstash Redis REST API directamente (sin paquete @vercel/kv)
const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

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

export default async function handler(req, res) {
  const { password } = req.method === 'POST' ? req.body : req.query;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  try {
    const keys = await kvSmembers('subscribers:all');
    const subscribers = [];
    for (const k of keys) {
      const rec = await kvGet(`subscriber:${k}`);
      if (rec) subscribers.push(rec);
    }
    subscribers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalActive = subscribers.filter(s => s.status === 'active').length;
    const totalCancelled = subscribers.filter(s => s.status === 'cancelled').length;
    const totalRevenue = subscribers
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + (s.gateway === 'wompi' ? s.amount / 4000 : s.amount), 0);

    res.status(200).json({
      subscribers,
      stats: { totalActive, totalCancelled, totalRevenue: totalRevenue.toFixed(2) },
    });
  } catch (err) {
    console.error('Admin data error:', err);
    res.status(500).json({ error: 'Error leyendo datos: ' + err.message });
  }
}
