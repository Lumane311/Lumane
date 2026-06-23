export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Datos incompletos' });

  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  try {
    // Verificar token
    const tokenRes = await fetch(`${KV_URL}/get/reset:${token}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.result) {
      return res.status(400).json({ error: 'El enlace no es válido o ya expiró.' });
    }

    const { email, expires } = JSON.parse(tokenData.result);
    if (Date.now() > expires) {
      return res.status(400).json({ error: 'El enlace ha expirado. Solicita uno nuevo.' });
    }

    // Actualizar contraseña en KV
    const userRes = await fetch(`${KV_URL}/get/user:${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    const userData = await userRes.json();
    const user = JSON.parse(userData.result);
    user.password = password;

    await fetch(`${KV_URL}/set/user:${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    // Eliminar token usado
    await fetch(`${KV_URL}/del/reset:${token}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('reset-password error:', err);
    res.status(500).json({ error: 'Error al restablecer. Intenta de nuevo.' });
  }
}
