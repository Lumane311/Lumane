import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLAN_PRICES = {
  weekly:  { amount: 299,  interval: 'week',  intervalCount: 1, label: 'LuMane Premium Semanal' },
  monthly: { amount: 999,  interval: 'month', intervalCount: 1, label: 'LuMane Premium Mensual' },
  annual:  { amount: 5999, interval: 'year',  intervalCount: 1, label: 'LuMane Premium Anual' },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan = 'monthly' } = req.body;
    const planConfig = PLAN_PRICES[plan] || PLAN_PRICES.monthly;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.headers.origin || 'https://lumane.online';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planConfig.label,
              description: 'Cuidado capilar personalizado con IA · Analizador 1A–4C · Rutinas · Tienda',
            },
            unit_amount: planConfig.amount,
            recurring: {
              interval: planConfig.interval,
              interval_count: planConfig.intervalCount,
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7,
      },
      success_url: `${baseUrl}/?success=true&plan=${plan}`,
      cancel_url:  `${baseUrl}/?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message });
  }
}
