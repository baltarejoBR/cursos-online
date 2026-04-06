// Catálogo de produtos do Método Corpo Limpo

export const CATEGORIES = {
  cursos: { name: 'Cursos', icon: '🎓', description: 'Aprenda tudo sobre CDS e saúde natural' },
  livros: { name: 'Livros', icon: '📚', description: 'Material completo para estudo' },
  servicos: { name: 'Serviços', icon: '💼', description: 'Atendimento personalizado' },
  loja: { name: 'Loja', icon: '🛒', description: 'Produtos para sua saúde' },
};

export const PRODUCTS = [
  // === CURSOS ===
  {
    id: 'curso-cds-completo',
    slug: 'curso-cds-completo',
    category: 'cursos',
    title: 'Curso CDS Completo',
    subtitle: 'O curso mais completo sobre CDS',
    description: 'Aprenda tudo sobre o Dióxido de Cloro desde o básico até aplicações avançadas. Inclui módulos para humanos e animais, protocolos, preparação e muito mais.',
    price: 29700, // R$ 297,00
    priceDisplay: 'R$ 297,00',
    type: 'one_time', // one_time, subscription, external
    badge: 'Mais Vendido',
    badgeColor: '#c9942e',
    features: [
      'Acesso vitalício ao conteúdo',
      'Módulos para humanos e animais',
      'Protocolos detalhados',
      'Certificado de conclusão',
      'Grupo exclusivo de alunos',
      'Atualizações gratuitas',
    ],
    gradient: 'linear-gradient(135deg, #5a8a3c 0%, #7ab356 100%)',
  },
  {
    id: 'curso-cds-humanos',
    slug: 'curso-cds-humanos',
    category: 'cursos',
    title: 'Curso CDS Humanos',
    subtitle: 'CDS focado em saúde humana',
    description: 'Curso focado em protocolos e aplicações do CDS para saúde humana. Ideal para quem quer começar com foco em cuidados pessoais e familiares.',
    price: 19700, // R$ 197,00
    priceDisplay: 'R$ 197,00',
    type: 'one_time',
    features: [
      'Acesso vitalício ao conteúdo',
      'Protocolos para humanos',
      'Guia de preparação passo a passo',
      'Suporte por email',
      'Atualizações gratuitas',
    ],
    gradient: 'linear-gradient(135deg, #6b9e4a 0%, #8bb96e 100%)',
  },
  {
    id: 'curso-cds-animais',
    slug: 'curso-cds-animais',
    category: 'cursos',
    title: 'Curso CDS para Animais',
    subtitle: 'Cuide da saúde dos seus pets',
    description: 'Aprenda como utilizar o CDS de forma segura em animais domésticos e de fazenda. Protocolos específicos por espécie e tamanho.',
    price: 19700, // R$ 197,00
    priceDisplay: 'R$ 197,00',
    type: 'one_time',
    features: [
      'Acesso vitalício ao conteúdo',
      'Protocolos por espécie animal',
      'Dosagens por peso e tamanho',
      'Casos reais e depoimentos',
      'Suporte por email',
    ],
    gradient: 'linear-gradient(135deg, #7ab356 0%, #4a7332 100%)',
  },
  {
    id: 'curso-teamor-telegram',
    slug: 'curso-teamor-telegram',
    category: 'cursos',
    title: 'Curso TEAMOR no Telegram',
    subtitle: 'Grupo exclusivo no Telegram',
    description: 'Participe do grupo exclusivo TEAMOR no Telegram com conteúdo ao vivo, tira-dúvidas em tempo real e comunidade ativa de praticantes.',
    price: 9700, // R$ 97,00
    priceDisplay: 'R$ 97,00',
    priceNote: '/mês',
    type: 'subscription',
    interval: 'month',
    features: [
      'Acesso ao grupo TEAMOR no Telegram',
      'Conteúdo ao vivo toda semana',
      'Tira-dúvidas em tempo real',
      'Comunidade ativa de praticantes',
      'Material exclusivo para membros',
    ],
    gradient: 'linear-gradient(135deg, #c9942e 0%, #d4a94e 100%)',
  },

  // === LIVROS ===
  {
    id: 'livro-completo',
    slug: 'livro-completo',
    category: 'livros',
    title: 'Livro Completo CDS',
    subtitle: 'O guia definitivo sobre CDS',
    description: 'Livro digital completo com tudo sobre CDS: história, ciência, preparação, protocolos para humanos e animais, e muito mais.',
    price: 9700, // R$ 97,00
    priceDisplay: 'R$ 97,00',
    type: 'one_time',
    features: [
      'E-book em PDF de alta qualidade',
      'Conteúdo completo e atualizado',
      'Protocolos para humanos e animais',
      'Tabelas de dosagem práticas',
      'Atualizações gratuitas',
    ],
    gradient: 'linear-gradient(135deg, #b8860b 0%, #c9942e 100%)',
  },
  {
    id: 'livro-animais',
    slug: 'livro-animais',
    category: 'livros',
    title: 'Livro CDS para Animais',
    subtitle: 'Guia especializado para pets',
    description: 'Livro digital focado em aplicações do CDS para animais. Protocolos por espécie, dosagens detalhadas e casos reais.',
    price: 6700, // R$ 67,00
    priceDisplay: 'R$ 67,00',
    type: 'one_time',
    contentSlug: 'guia-animais-clo2', // conteudo HTML disponivel
    downloadId: 'livro-animais', // PDF disponivel para download
    features: [
      'Versao HTML interativa online',
      'PDF para download',
      'Protocolos por espécie animal',
      'Tabelas de dosagem por peso',
      'Casos reais documentados',
      'Atualizações gratuitas',
    ],
    gradient: 'linear-gradient(135deg, #8b7355 0%, #a68b5b 100%)',
  },

  // === SERVIÇOS ===
  {
    id: 'consultoria',
    slug: 'consultoria',
    category: 'servicos',
    title: 'Consultoria Individual',
    subtitle: 'Atendimento personalizado',
    description: 'Consultoria individual por videochamada para tirar todas as suas dúvidas sobre CDS. Atendimento personalizado com protocolo sob medida. Após o pagamento via Pix, você agenda o melhor horário pelo Calendly.',
    price: 49700, // R$ 497,00
    priceDisplay: 'R$ 497,00',
    priceNote: '/sessão',
    type: 'one_time',
    badge: 'Personalizado',
    badgeColor: '#8b7355',
    features: [
      'Sessão de 1h por videochamada',
      'Protocolo personalizado',
      'Acompanhamento por 7 dias',
      'Material de apoio exclusivo',
      'Gravação da sessão',
    ],
    gradient: 'linear-gradient(135deg, #a68b5b 0%, #8b7355 100%)',
  },

  // === LOJA ===
  {
    id: 'loja-produtos',
    slug: 'loja-produtos',
    category: 'loja',
    title: 'Loja de Produtos',
    subtitle: 'Produtos para sua saúde',
    description: 'Visite nossa loja online com diversos produtos selecionados para sua saúde e bem-estar. Entrega para todo o Brasil.',
    type: 'external',
    externalUrl: 'http://www.clo2br.com.br',
    features: [
      'Produtos selecionados',
      'Entrega para todo o Brasil',
      'Compra segura',
      'Suporte ao cliente',
    ],
    gradient: 'linear-gradient(135deg, #5a8a3c 0%, #c9942e 100%)',
  },
];

export function getProductsByCategory(category) {
  return PRODUCTS.filter(p => p.category === category);
}

export function getProductBySlug(slug) {
  return PRODUCTS.find(p => p.slug === slug);
}
