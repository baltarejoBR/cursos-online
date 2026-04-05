import Stripe from 'stripe';

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
}

// Preços dos planos (em centavos)
export const PLANS = {
  monthly: {
    name: 'Mensal',
    price: 4990, // R$ 49,90
    interval: 'month',
    description: 'Acesso completo por 1 mês',
    features: [
      'Acesso a todos os cursos premium',
      'Acesso ao grupo exclusivo do Instagram',
      'Suporte prioritário',
      'Novos conteúdos toda semana',
    ],
  },
  yearly: {
    name: 'Anual',
    price: 39900, // R$ 399,00 (economia de ~33%)
    interval: 'year',
    description: 'Acesso completo por 1 ano',
    features: [
      'Tudo do plano mensal',
      'Economia de R$ 199,80 no ano',
      'Acesso antecipado a novos cursos',
      'Certificados exclusivos',
    ],
    savings: 'Economize 33%',
  },
};
