import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    supabase: false,
    stripe: false,
    stripeMode: null,
    webhook: false,
  };

  // Check Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey && serviceRole &&
      supabaseUrl.includes('supabase.co') &&
      !serviceRole.includes('COLOQUE')) {
    checks.supabase = true;
  }

  // Check Stripe
  const stripePublishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripeSecret = process.env.STRIPE_SECRET_KEY;

  if (stripePublishable && stripeSecret &&
      stripePublishable.startsWith('pk_') &&
      stripeSecret.startsWith('sk_')) {
    checks.stripe = true;
    checks.stripeMode = stripePublishable.includes('_test_') ? 'Teste' : 'Produção';
  }

  // Check Webhook
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (webhookSecret && webhookSecret.startsWith('whsec_')) {
    checks.webhook = true;
  }

  return NextResponse.json(checks);
}
