// Catálogo de produtos do Método Corpo Limpo
import { getImageUrl } from './storage';

export const CATEGORIES = {
  cursos: { name: 'Cursos', icon: '🎓', description: 'Aprenda tudo sobre Terapias Bio-oxidativas' },
  livros: { name: 'Livros', icon: '📚', description: 'Material completo para estudo' },
  servicos: { name: 'Serviços', icon: '💼', description: 'Atendimento personalizado' },
  comunidade: { name: 'Comunidade', icon: '👥', description: 'Grupos e fóruns de apoio' },
  loja: { name: 'Loja', icon: '🛒', description: 'Produtos para sua saúde' },
  gratuitos: { name: 'Gratuitos', icon: '🎁', description: 'Conteúdo gratuito para começar' },
};

export const PRODUCTS = [
  // === CURSOS ===
  {
    id: 'curso-cds-completo',
    slug: 'curso-cds-completo',
    category: 'cursos',
    title: 'Curso Completo + Comunidade Exclusiva',
    subtitle: 'Curso Detox Bio-oxidativo completo',
    description: 'Aprenda tudo sobre Terapias Bio-oxidativas desde o básico até aplicações avançadas. Inclui acesso à comunidade exclusiva de alunos, protocolos detalhados, preparação e muito mais.',
    image: getImageUrl('produtos/capa-curso-detox.png'),
    price: 29700, // R$ 297,00
    priceDisplay: 'R$ 297,00',
    type: 'one_time',
    hotmartUrl: 'https://pay.hotmart.com/X100011388O?checkoutMode=10',
    badge: 'Mais Vendido',
    badgeColor: '#2e8b57',
    features: [
      'Acesso vitalício ao conteúdo',
      'Comunidade exclusiva de alunos',
      'Acesso aos grupos: Enema CDS, CDS Hotmart, CDS Mama',
      'Protocolos Bio-oxidativos detalhados',
      'Certificado de conclusão',
      'Atualizações gratuitas',
    ],
    gradient: 'linear-gradient(135deg, #1a6baa 0%, #3a9ad9 100%)',
  },
  {
    id: 'curso-cds-animais',
    slug: 'curso-cds-animais',
    category: 'cursos',
    title: 'Curso CDS para Animais',
    subtitle: 'Cuide da saúde dos seus pets',
    description: 'Aprenda como utilizar o CDS de forma segura em animais domésticos e de fazenda. Protocolos específicos por espécie e tamanho.',
    image: getImageUrl('produtos/capa-curso.png'),
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
    gradient: 'linear-gradient(135deg, #3a9ad9 0%, #0d3b66 100%)',
  },
  {
    id: 'curso-teamor-telegram',
    slug: 'curso-teamor-telegram',
    category: 'cursos',
    title: 'Curso TEAmor no Telegram',
    subtitle: 'Para mães comprometidas com a saúde dos filhos',
    description: 'O TEAmor é um grupo exclusivo no Telegram para mães que estão verdadeiramente comprometidas com a saúde e o bem-estar dos seus filhos. Com aulas completas em áudio e conteúdo extremamente detalhado, você terá acesso a informações aprofundadas sobre CDS, protocolos, nutrição e terapias naturais — tudo pensado para quem quer ir além do superficial e realmente transformar a saúde da família.',
    image: '/images/logo-teamor.png',
    price: 9700, // R$ 97,00
    priceDisplay: 'R$ 97,00',
    priceNote: '/mês',
    type: 'subscription',
    interval: 'month',
    hidden: true,
    features: [
      'Aulas completas em áudio no Telegram',
      'Conteúdo rico e detalhado sobre saúde infantil',
      'Protocolos e orientações para mães',
      'Comunidade de apoio entre mães',
      'Acervo completo de aulas e materiais',
      'Informações aprofundadas sobre CDS e terapias naturais',
    ],
    gradient: 'linear-gradient(135deg, #1a7ab5 0%, #4ecdc4 100%)',
  },

  // === LIVROS ===
  {
    id: 'livro-completo',
    slug: 'livro-completo',
    category: 'livros',
    title: 'Ebook Completo + Protocolos Biooxidativos de A a Z',
    subtitle: 'Transforme sua Saúde',
    description: 'Livro digital completo com tudo sobre protocolos bio-oxidativos: história, ciência, preparação, protocolos para humanos e animais, e muito mais.',
    image: getImageUrl('produtos/capa-livro-protocolos.png'),
    price: 9700, // R$ 97,00
    priceDisplay: 'R$ 97,00',
    type: 'one_time',
    hotmartUrl: 'https://pay.hotmart.com/N101740813Q?checkoutMode=10',
    features: [
      'E-book em PDF de alta qualidade',
      'Protocolos Biooxidativos de A a Z',
      'Conteúdo completo e atualizado',
      'Tabelas de dosagem práticas',
      'Atualizações gratuitas',
    ],
    gradient: 'linear-gradient(135deg, #1e6e3e 0%, #2e8b57 100%)',
  },
  {
    id: 'livro-animais',
    slug: 'livro-animais',
    category: 'livros',
    title: 'Livro CDS para Animais',
    subtitle: 'Guia especializado para pets',
    description: 'Livro digital focado em aplicações do CDS para animais. Protocolos por espécie, dosagens detalhadas e casos reais.',
    image: getImageUrl('produtos/capa-livro.png'),
    price: 6700, // R$ 67,00
    priceDisplay: 'R$ 67,00',
    type: 'one_time',
    contentSlug: 'guia-animais-clo2',
    downloadId: 'livro-animais',
    features: [
      'Versão HTML interativa online',
      'PDF para download',
      'Protocolos por espécie animal',
      'Tabelas de dosagem por peso',
      'Casos reais documentados',
      'Atualizações gratuitas',
    ],
    gradient: 'linear-gradient(135deg, #4a6a8a 0%, #6b8fad 100%)',
  },

  // === SERVIÇOS ===
  {
    id: 'mentoria',
    slug: 'mentoria',
    category: 'servicos',
    title: 'Consultoria Individual em CDS',
    subtitle: 'Atendimento personalizado com Gabriel Baltarejo',
    description: 'Consultoria individual por Zoom (até 1h30) onde eu te explico de forma clara o que é o CDS e como ele age no corpo, analiso seu caso pessoal (histórico, sintomas, objetivos) e te ajudo a montar protocolos personalizados (dosagens, horários, formas de uso). Após a chamada, você terá acompanhamento direto comigo por WhatsApp durante 30 dias para tirar dúvidas, ajustar protocolos e ter segurança no processo.',
    image: getImageUrl('gabriel/mentoria-baltarejo.jpeg'),
    price: 62000, // R$ 620,00
    priceDisplay: 'R$ 620,00',
    type: 'whatsapp',
    whatsappUrl: 'https://wa.me/75998546139?text=Ol%C3%A1,%20gostaria%20de%20agendar%20uma%20consultoria%20em%20CDS',
    badge: 'Personalizado',
    badgeColor: '#4a6a8a',
    features: [
      'Atendimento individual por Zoom (até 1h30)',
      'Explicação clara sobre o CDS e como age no corpo',
      'Análise do seu caso pessoal (histórico, sintomas, objetivos)',
      'Protocolos personalizados (dosagens, horários, formas de uso)',
      'Acompanhamento por WhatsApp por 30 dias',
      'Suporte para tirar dúvidas e ajustar protocolos',
    ],
    gradient: 'linear-gradient(135deg, #6b8fad 0%, #4a6a8a 100%)',
  },

  // === COMUNIDADE ===
  {
    id: 'grupo-telegram',
    slug: 'grupo-telegram',
    category: 'comunidade',
    title: 'Grupo Telegram - Corpo Limpo',
    subtitle: 'Comunidade gratuita no Telegram',
    description: 'Participe do grupo Corpo Limpo no Telegram. Troque experiências, tire dúvidas e fique por dentro das novidades sobre Terapias Bio-oxidativas.',
    image: getImageUrl('logos/logo-corpo-limpo-linktree.png'),
    type: 'external',
    externalUrl: 'https://t.me/+YFVp36x1zKhmM2Ix',
    features: [
      'Comunidade ativa',
      'Troca de experiências',
      'Novidades em primeira mão',
      'Acesso gratuito',
    ],
    gradient: 'linear-gradient(135deg, #0088cc 0%, #00aced 100%)',
  },
  {
    id: 'forum-cds',
    slug: 'forum-cds',
    category: 'comunidade',
    title: 'Fórum / Comunidade',
    subtitle: 'Fórum CDS e Saúde Integrativa',
    description: 'Acesse o fórum online sobre CDS e Saúde Integrativa. Artigos, discussões e conteúdo compartilhado pela comunidade.',
    image: getImageUrl('logos/logo-forum-cds.png'),
    type: 'external',
    externalUrl: 'https://www.forumcds.com/',
    features: [
      'Artigos e discussões',
      'Comunidade de praticantes',
      'Conteúdo atualizado',
      'Acesso gratuito',
    ],
    gradient: 'linear-gradient(135deg, #675614 0%, #9a8220 100%)',
  },

  // === LOJA ===
  {
    id: 'loja-produtos',
    slug: 'loja-produtos',
    category: 'loja',
    title: 'Comprar Produtos',
    subtitle: 'Loja CLO2BR - Produtos para sua saúde',
    description: 'Visite a loja CLO2BR com produtos selecionados para Terapias Bio-oxidativas. Entrega para todo o Brasil.',
    image: getImageUrl('logos/logo-clo2br.png'),
    type: 'external',
    externalUrl: 'https://www.clo2br.com.br/cds',
    features: [
      'Produtos selecionados',
      'Entrega para todo o Brasil',
      'Compra segura',
      'Suporte ao cliente',
    ],
    gradient: 'linear-gradient(135deg, #1a6baa 0%, #2e8b57 100%)',
  },

  // === GRATUITOS ===
  {
    id: 'guia-basico-iniciantes',
    slug: 'guia-basico-iniciantes',
    category: 'gratuitos',
    title: 'Guia Básico para Iniciantes',
    subtitle: 'Download gratuito - PDF completo',
    description: 'Aprenda os fundamentos das Terapias Bio-oxidativas com este guia completo e gratuito. Ideal para quem está começando e quer entender o CDS antes de investir em um curso.',
    image: getImageUrl('produtos/guia-protocolo-k.png'),
    type: 'download',
    downloadPath: '/downloads/guia-basico-iniciantes.pdf',
    badge: 'Grátis',
    badgeColor: '#2e8b57',
    features: [
      'Download gratuito em PDF',
      'Fundamentos do CDS para iniciantes',
      'Material completo e ilustrado',
      'Comece sua jornada aqui',
    ],
    gradient: 'linear-gradient(135deg, #1a6baa 0%, #2e8b57 100%)',
  },
  {
    id: 'guia-protocolo-k',
    slug: 'guia-protocolo-k',
    category: 'gratuitos',
    title: 'Guia Grátis Protocolo K',
    subtitle: 'Download gratuito',
    description: 'Baixe gratuitamente o Guia do Protocolo K. Material introdutório para quem quer conhecer as Terapias Bio-oxidativas.',
    image: getImageUrl('produtos/guia-protocolo-k.png'),
    type: 'external',
    externalUrl: 'https://drive.google.com/file/d/1Vvbce1NJWunQQpF6ShcH4vsCsorPnqEX/view?usp=sharing',
    badge: 'Grátis',
    badgeColor: '#2e8b57',
    features: [
      'Download gratuito em PDF',
      'Introdução ao Protocolo K',
      'Material de referência rápida',
    ],
    gradient: 'linear-gradient(135deg, #2e8b57 0%, #4db87a 100%)',
  },
  {
    id: 'abaixo-assinado',
    slug: 'abaixo-assinado',
    category: 'comunidade',
    title: 'Abaixo Assinado',
    subtitle: 'Apoie a causa',
    description: 'Assine a petição em apoio às Terapias Bio-oxidativas. Sua assinatura faz a diferença.',
    image: getImageUrl('outros/brinde-parque.jpeg'),
    type: 'external',
    externalUrl: 'https://c.org/KMRyJpRp7H',
    features: [
      'Apoie a causa',
      'Assinatura online rápida',
      'Gratuito',
    ],
    gradient: 'linear-gradient(135deg, #d4a017 0%, #e8b830 100%)',
  },
];

export function getProductsByCategory(category) {
  return PRODUCTS.filter(p => p.category === category && !p.hidden);
}

export function getVisibleProducts() {
  return PRODUCTS.filter(p => !p.hidden);
}

export function getProductBySlug(slug) {
  return PRODUCTS.find(p => p.slug === slug);
}
