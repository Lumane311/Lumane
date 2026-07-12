// pages/api/analyze.js
// Análisis capilar con IA — se ejecuta en el SERVIDOR con la API key segura.
// Requiere la variable de entorno ANTHROPIC_API_KEY en Vercel.

export const config = {
  api: { bodyParser: { sizeLimit: '4mb' } },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers = {}, photo = null } = req.body || {};
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Sin API key configurada: el frontend usará su rutina de respaldo
    return res.status(200).json({ result: null, error: 'no-key' });
  }

  const esNino = answers.quien === 'nino' || answers.quien === 'ambos';

  const prompt = `Eres experto/a en tricología y cuidado capilar. ${esNino ? 'Analiza el cabello de un NIÑO/A menor de 12 años — usa productos suaves, sin sulfatos agresivos, seguros para niños.' : 'Analiza el cabello de un adulto.'}
Datos del usuario: Para quién:${answers.quien || 'adulto'} Preocupación:${answers.problema || 'general'} Objetivo:${answers.goal || 'cuidado general'} Cuero cabelludo:${answers.scalp || 'normal'} Tratamientos:${answers.damage || 'ninguno'} Género:${answers.gender || 'neutro'}.
${photo ? 'IMPORTANTE: Analiza la FOTO del cabello para detectar el tipo exacto (1A-4C), porosidad, densidad y estado real.' : 'Sin foto — estima el tipo de cabello según las respuestas.'}
Responde SOLO JSON sin texto adicional: {"hairType":"tipo detectado 1A-4C o estimado","condition":"seco|graso|normal","scalp":"normal|caspa|graso|sensible","title":"título motivador 5 palabras","summary":"descripción personalizada 2-3 oraciones según sus respuestas","score":{"hidratacion":7,"fuerza":6,"brillo":7,"salud_cuero":7},"products":[{"order":1,"step":"Limpieza","name":"","sq":"búsqueda en inglés para Amazon","why":"","howToApply":"","freq":"","tip":"","avoid":""},{"order":2,"step":"Acondicionado","name":"","sq":"","why":"","howToApply":"","freq":"","tip":"","avoid":""},{"order":3,"step":"Tratamiento","name":"","sq":"","why":"","howToApply":"","freq":"","tip":"","avoid":""},{"order":4,"step":"Definición o Estilo","name":"","sq":"","why":"","howToApply":"","freq":"","tip":"","avoid":""},{"order":5,"step":"Sellado o Protección","name":"","sq":"","why":"","howToApply":"","freq":"","tip":"","avoid":""}],"weeklyRoutine":["Días 1-2:","Días 3-4:","Días 5-7:"],"ingredients":{"buscar":["i1","i2","i3"],"evitar":["i1","i2"]},"lifestyle":["h1","h2","h3"]}`;

  try {
    let messages;
    if (photo && typeof photo === 'string' && photo.startsWith('data:')) {
      const parts = photo.split(',');
      const mime = (parts[0].match(/:(.*?);/) || [])[1] || 'image/jpeg';
      const b64 = parts[1];
      messages = [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mime, data: b64 } },
          { type: 'text', text: prompt + ' Analiza también la imagen del cabello para mayor precisión.' },
        ],
      }];
    } else {
      messages = [{ role: 'user', content: prompt }];
    }

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages,
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error('Anthropic API error:', r.status, errText);
      return res.status(200).json({ result: null, error: 'api-error' });
    }

    const d = await r.json();
    const txt = (d.content || []).map((b) => b.text || '').join('');
    const clean = txt.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json({ result: parsed });
  } catch (e) {
    console.error('Analyze error:', e);
    return res.status(200).json({ result: null, error: 'parse-error' });
  }
}
