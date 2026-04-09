import 'dotenv/config';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia',
});

async function main() {
  const plusProduct = await stripe.products.create({
    name: 'OrbitLearn Plus',
    description: 'Unlimited AI generation, Ollie whispers, preference learning, smart options, and more.',
    metadata: { tier: 'PLUS' },
  });

  const proProduct = await stripe.products.create({
    name: 'OrbitLearn Pro',
    description: 'Everything in Plus plus priority generation, inline completions, Canvas, analytics, and parent bridge export.',
    metadata: { tier: 'PRO' },
  });

  const plusMonthly = await stripe.prices.create({
    product: plusProduct.id,
    unit_amount: 1299,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { tier: 'PLUS', interval: 'monthly' },
  });

  const plusAnnual = await stripe.prices.create({
    product: plusProduct.id,
    unit_amount: 10390,
    currency: 'usd',
    recurring: { interval: 'year' },
    metadata: { tier: 'PLUS', interval: 'annual' },
  });

  const proMonthly = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 2499,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { tier: 'PRO', interval: 'monthly' },
  });

  const proAnnual = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 19990,
    currency: 'usd',
    recurring: { interval: 'year' },
    metadata: { tier: 'PRO', interval: 'annual' },
  });

  const foundingAnnualPlus = await stripe.prices.create({
    product: plusProduct.id,
    unit_amount: 7900,
    currency: 'usd',
    recurring: { interval: 'year' },
    metadata: { tier: 'PLUS', interval: 'annual', offer: 'founding_member' },
  });

  console.log([
    `STRIPE_PLUS_MONTHLY_PRICE_ID=${plusMonthly.id}`,
    `STRIPE_PLUS_ANNUAL_PRICE_ID=${plusAnnual.id}`,
    `STRIPE_PRO_MONTHLY_PRICE_ID=${proMonthly.id}`,
    `STRIPE_PRO_ANNUAL_PRICE_ID=${proAnnual.id}`,
    `STRIPE_FOUNDING_PLUS_ANNUAL_PRICE_ID=${foundingAnnualPlus.id}`,
  ].join('\n'));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
