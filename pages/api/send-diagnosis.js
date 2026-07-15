// pages/api/send-diagnosis.js
// Envía por correo el diagnóstico de LuMane usando Resend.
// Requiere RESEND_API_KEY en Vercel (ya configurada).

export const config = {
  api: { bodyParser: { sizeLimit: '2mb' } },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, result } = req.body || {};
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ sent: false, error: 'no-key' });
  }
  if (!email || !result) {
    return res.status(400).json({ error: 'email y result son requeridos' });
  }

  const hairType = (result.hairType || '').toUpperCase();
  const title = result.title || 'Tu diagnóstico LuMane';
  const summary = result.summary || '';
  const condition = result.condition || '';
  const scalp = result.scalp || '';

  const score = result.score || {};
  const metrics = [
    ['💧', 'Hidratación', score.hidratacion],
    ['💪', 'Fuerza', score.fuerza],
    ['✨', 'Brillo', score.brillo],
    ['🔬', 'Cuero', score.salud_cuero],
  ].filter((m) => typeof m[2] === 'number');

  const metricsHtml = metrics
    .map(
      ([emoji, label, val]) => `
    <td align="center" style="padding:10px 6px;">
      <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#2A1F0E,#1A1A1A);border:2px solid #C9A84C;display:inline-block;line-height:56px;font-family:Georgia,serif;font-size:20px;font-weight:bold;color:#E8C77E;">${val}</div>
      <div style="font-size:11px;color:#3A2810;margin-top:6px;">${emoji} ${label}</div>
    </td>`
    )
    .join('');

  const html = `
  <div style="background:#F7F2EA;padding:32px 12px;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:520px;margin:0 auto;background:#FDFAF5;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.08);">

      <div style="padding:26px 26px 6px;">
        <p style="font-size:14px;color:#1A1A1A;line-height:1.75;margin:0 0 10px;">Hola 👋 Soy <strong>Fernanda Hernández</strong>, fundadora de LuMane.</p>
        <p style="font-size:14px;color:#3A2810;line-height:1.75;margin:0 0 10px;">Acabo de recibir el análisis con inteligencia artificial que hicimos de tu cabello, y quise reenviártelo yo misma junto con algo que la IA descubrió y que <strong>puede cambiar por completo tu rutina</strong>.</p>
        <p style="font-size:14px;color:#3A2810;line-height:1.75;margin:0;">Baja y mira tu diagnóstico completo 👇</p>
      </div>

      <div style="background:linear-gradient(160deg,#241A0E 0%,#1A1A1A 60%,#141210 100%);padding:34px 24px;text-align:center;">
        <div style="font-size:11px;letter-spacing:3px;color:#C9A84C;text-transform:uppercase;margin-bottom:14px;">✦ Diagnóstico LuMane ✦</div>
        <div style="font-size:26px;margin-bottom:4px;">👑</div>
        <div style="font-size:52px;font-weight:bold;color:#E8C77E;line-height:1;font-style:italic;">${hairType || '—'}</div>
        <div style="width:60px;height:1px;background:#C9A84C;margin:16px auto;opacity:.5;"></div>
        <div style="font-size:20px;color:#FDFAF5;font-weight:bold;margin-bottom:10px;">${title}</div>
        <div style="font-size:14px;color:rgba(245,239,229,.75);line-height:1.7;max-width:380px;margin:0 auto;">${summary}</div>
      </div>

      ${metrics.length ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:26px 0 6px;">
        <tr>${metricsHtml}</tr>
      </table>` : ''}

      <div style="padding:0 26px 8px;text-align:center;">
        <span style="display:inline-block;background:#F7F2EA;border:1px solid rgba(201,168,76,.3);border-radius:20px;padding:6px 14px;font-size:12px;color:#3A2810;margin:4px;">Condición: <strong style="color:#A07A30;">${condition}</strong></span>
        <span style="display:inline-block;background:#F7F2EA;border:1px solid rgba(201,168,76,.3);border-radius:20px;padding:6px 14px;font-size:12px;color:#3A2810;margin:4px;">Cuero: <strong style="color:#A07A30;">${scalp}</strong></span>
      </div>

      <div style="padding:26px 26px 8px;text-align:center;">
        <div style="font-size:15px;color:#1A1A1A;font-weight:bold;margin-bottom:10px;">Tu rutina personalizada de 5 pasos ya está lista 🔒</div>
        <p style="font-size:13px;color:#666;line-height:1.7;margin:0 0 20px;">Descubre exactamente qué productos usar, cómo aplicarlos y con qué frecuencia — hecho a la medida de tu cabello.</p>
        <a href="https://lumane.online" style="display:inline-block;background:linear-gradient(135deg,#A07A30,#E8C77E);color:#1A1A1A;text-decoration:none;font-weight:bold;font-size:14px;padding:14px 32px;border-radius:30px;">Desbloquear mi rutina — 7 días gratis →</a>
        <p style="font-size:11px;color:#999;margin-top:14px;">🛡️ Garantía 30 días · Cancela cuando quieras</p>
      </div>

      <div style="padding:0 26px 22px;text-align:center;">
        <p style="font-size:12px;color:#999;line-height:1.7;margin:0;">Cualquier duda, respóndeme directo a este correo — lo leo yo misma. 💛<br/><strong style="color:#3A2810;">Fernanda Hernández</strong><br/>Fundadora, LuMane</p>
      </div>

      <div style="background:#2A1F0E;padding:20px;text-align:center;">
        <div style="font-size:15px;color:#C9A84C;letter-spacing:2px;margin-bottom:6px;">✦ LuMane</div>
        <p style="font-size:11px;color:rgba(245,237,224,.5);margin:0;">Cuidado capilar con inteligencia artificial<br/>
        <a href="https://lumane.online/privacidad" style="color:#C9A84C;text-decoration:none;">Privacidad</a> · <a href="https://lumane.online/terminos" style="color:#C9A84C;text-decoration:none;">Términos</a></p>
      </div>
    </div>
  </div>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'LuMane <diagnostico@lumane.online>',
        reply_to: 'lumane.online@outlook.com',
        to: [email],
        subject: `Fernanda, LuMane: te reenvío tu diagnóstico (${hairType || 'listo'}) ✦`,
        html,
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error('Resend error:', r.status, errText);
      return res.status(200).json({ sent: false, error: 'resend-error' });
    }

    return res.status(200).json({ sent: true });
  } catch (e) {
    console.error('send-diagnosis error:', e);
    return res.status(200).json({ sent: false, error: 'network-error' });
  }
}
