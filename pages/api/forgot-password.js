export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requerido' });

  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://lumane.online';

  try {
    // Verificar que el usuario existe
    const userRes = await fetch(`${KV_URL}/get/user:${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    const userData = await userRes.json();
    if (!userData.result) {
      return res.status(404).json({ error: 'No encontramos una cuenta con ese correo.' });
    }

    // Crear token de recuperación (expira en 1 hora)
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await fetch(`${KV_URL}/set/reset:${token}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, expires: Date.now() + 3600000 }),
    });

    // Enviar email con Resend
    const resetLink = `${BASE_URL}/reset-password?token=${token}`;
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'LuMane <noreply@lumane.online>',
        to: [email],
        subject: '✦ Recupera tu contraseña de LuMane',
        html: `
          <div style="font-family:'Helvetica',sans-serif;max-width:480px;margin:0 auto;background:#FDFAF5;padding:40px 32px;border-radius:16px;">
            <div style="text-align:center;margin-bottom:24px;">
              <h1 style="font-size:2rem;color:#C8A46B;margin:0;letter-spacing:0.1em;">✦ LuMane</h1>
              <p style="color:#6E6E6E;font-size:0.85rem;margin-top:4px;">Cuidado capilar con Inteligencia Artificial</p>
            </div>
            <h2 style="color:#1A1A1A;font-size:1.2rem;margin-bottom:12px;">Recupera tu contraseña</h2>
            <p style="color:#6E6E6E;line-height:1.6;margin-bottom:24px;">
              Hola, recibimos una solicitud para restablecer la contraseña de tu cuenta LuMane. 
              Toca el botón de abajo para crear una nueva contraseña.
            </p>
            <div style="text-align:center;margin-bottom:24px;">
              <a href="${resetLink}" style="background:#1A1A1A;color:#C8A46B;padding:14px 32px;border-radius:32px;text-decoration:none;font-weight:700;font-size:1rem;display:inline-block;border:1.5px solid #C8A46B;">
                Restablecer mi contraseña →
              </a>
            </div>
            <p style="color:#6E6E6E;font-size:0.78rem;line-height:1.5;">
              Este enlace expira en <strong>1 hora</strong>. Si no solicitaste esto, ignora este email — tu cuenta está segura.
            </p>
            <hr style="border:none;border-top:1px solid #DDD4C8;margin:24px 0;">
            <p style="color:#DDD4C8;font-size:0.7rem;text-align:center;">LuMane © 2026 · lumane.online</p>
          </div>
        `,
      }),
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('forgot-password error:', err);
    res.status(500).json({ error: 'Error al enviar el email. Intenta de nuevo.' });
  }
}
