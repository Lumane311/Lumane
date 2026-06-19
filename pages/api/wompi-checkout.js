export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan } = req.body;

  const PLANS_COP = {
    weekly:  { amount: 1299900,  name: 'LuMane Semanal'  },
    monthly: { amount: 3999900,  name: 'LuMane Mensual'  },
    annual:  { amount: 24999900, name: 'LuMane Anual'    },
  };

  const selectedPlan = PLANS_COP[plan] || PLANS_COP.monthly;
  const reference = `LUMANE-${plan.toUpperCase()}-${Date.now()}`;

  if (!process.env.WOMPI_PRIVATE_KEY) {
    return res.status(500).json({ error: 'WOMPI_PRIVATE_KEY no está configurada en Vercel' });
  }

  const payload = {
    name: selectedPlan.name,
    description: `Suscripción LuMane Premium — ${plan} · 7 días gratis`,
    single_use: true,
    collect_shipping: false,
    amount_in_cents: selectedPlan.amount,
    currency: 'COP',
    redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://lumane.online'}/?success=true`,
    reference: reference,
  };

  try {
    const response = await fetch('https://production.wompi.co/v1/payment_links', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.data && data.data.id) {
      const paymentUrl = `https://checkout.wompi.co/l/${data.data.id}`;
      return res.status(200).json({ url: paymentUrl });
    } else {
      console.error('Wompi error:', data);
      return res.status(500).json({ error: 'Wompi rechazó la solicitud', details: data });
    }
  } catch (error) {
    console.error('Wompi fetch error:', error);
    return res.status(500).json({ error: 'Error de conexión con Wompi: ' + error.message });
  }
}
