// Constantes compartilhadas para a Universidade Dioxi

export const CATEGORY_LABELS = {
  iniciantes: 'Para Iniciantes',
  protocolos: 'Protocolos',
  ciencia: 'Ciência',
  estudos: 'Estudos Científicos',
  seguranca: 'Segurança',
};

export const CATEGORY_COLORS = {
  iniciantes:  { bg: 'var(--cat-iniciantes-bg)', color: 'var(--cat-iniciantes)', hex: '#2e8b57' },
  protocolos:  { bg: 'var(--cat-protocolos-bg)', color: 'var(--cat-protocolos)', hex: '#0d3b66' },
  ciencia:     { bg: 'var(--cat-ciencia-bg)',    color: 'var(--cat-ciencia)',    hex: '#7c3aed' },
  estudos:     { bg: 'var(--cat-estudos-bg)',     color: 'var(--cat-estudos)',    hex: '#1a6baa' },
  seguranca:   { bg: 'var(--cat-seguranca-bg)',   color: 'var(--cat-seguranca)', hex: '#c9a84c' },
};

// Para badges no hero (fundo escuro) - cores com mais contraste
export const CATEGORY_COLORS_HERO = {
  iniciantes:  { bg: 'rgba(46, 139, 87, 0.25)',  color: '#6ee7a0' },
  protocolos:  { bg: 'rgba(100, 180, 255, 0.2)', color: '#93c5fd' },
  ciencia:     { bg: 'rgba(167, 139, 250, 0.25)', color: '#c4b5fd' },
  estudos:     { bg: 'rgba(96, 165, 250, 0.2)',  color: '#93c5fd' },
  seguranca:   { bg: 'rgba(201, 168, 76, 0.2)',  color: '#dfc06a' },
};

export const SUB_LABELS = {
  'ensaios-clinicos': 'Ensaios Clínicos',
  'toxicidade': 'Toxicidade',
  'peer-reviews': 'Peer Reviews',
  'revisoes': 'Revisões',
  'covid-19': 'COVID-19',
  'cancer': 'Câncer',
  'sangue': 'Sangue & Oxigênio',
  'pele': 'Pele & Queimaduras',
  'infeccoes': 'Infecções',
};

export const CATEGORIES = [
  { value: null, label: 'Todos', icon: '📚' },
  { value: 'iniciantes', label: 'Para Iniciantes', icon: '🌱' },
  { value: 'protocolos', label: 'Protocolos', icon: '📋', hasDropdown: true },
  { value: 'ciencia', label: 'Ciência', icon: '🔬' },
  { value: 'estudos', label: 'Estudos Científicos', icon: '📊', hasDropdown: true },
  { value: 'seguranca', label: 'Segurança', icon: '🛡️' },
];

export const ESTUDOS_SUBCATEGORIES = {
  tipo: [
    { value: 'ensaios-clinicos', label: 'Ensaios Clínicos', icon: '🧪' },
    { value: 'toxicidade', label: 'Toxicidade', icon: '⚗️' },
    { value: 'peer-reviews', label: 'Peer Reviews', icon: '📝' },
    { value: 'revisoes', label: 'Revisões', icon: '📖' },
  ],
  tema: [
    { value: 'covid-19', label: 'COVID-19', icon: '🦠' },
    { value: 'cancer', label: 'Câncer', icon: '🎗️' },
    { value: 'sangue', label: 'Sangue & Oxigênio', icon: '🩸' },
    { value: 'pele', label: 'Pele & Queimaduras', icon: '🩹' },
    { value: 'infeccoes', label: 'Infecções', icon: '🔬' },
  ],
};

export const PROTOCOLO_ITEMS = {
  gratuitos: [
    { slug: 'protocolo-a-iniciante', label: 'Protocolo A — Iniciante' },
    { slug: 'protocolo-c-padrao', label: 'Protocolo C — Padrão' },
    { slug: 'protocolo-d-pele', label: 'Protocolo D — Pele' },
    { slug: 'protocolo-e-enemas', label: 'Protocolo E — Enemas' },
    { slug: 'protocolo-k-dmso', label: 'Protocolo K — DMSO' },
  ],
  premium: [
    { slug: 'protocolo-b-banho', label: 'B — Banho' },
    { slug: 'protocolo-f-febre', label: 'F — Febre' },
    { slug: 'protocolo-g-gas', label: 'G — Gás' },
    { slug: 'protocolo-h-ambiente', label: 'H — Ambiente' },
    { slug: 'protocolo-i-picadas', label: 'I — Picadas' },
    { slug: 'protocolo-j-boca', label: 'J — Boca' },
    { slug: 'protocolo-l-lavapes', label: 'L — Lavapés' },
    { slug: 'protocolo-m-malaria', label: 'M — Malária' },
    { slug: 'protocolo-n-criancas', label: 'N — Crianças' },
    { slug: 'protocolo-o-olhos-nariz', label: 'O — Olhos/Nariz' },
    { slug: 'protocolo-p-parasitas', label: 'P — Parasitas' },
    { slug: 'protocolo-q-queimaduras', label: 'Q — Queimaduras' },
    { slug: 'protocolo-r-retal', label: 'R — Retal' },
    { slug: 'protocolo-s-sensivel', label: 'S — Sensível' },
    { slug: 'protocolo-t-terminal', label: 'T — Terminal' },
    { slug: 'protocolo-u-urgencia', label: 'U — Urgência' },
    { slug: 'protocolo-v-vaginal', label: 'V — Vaginal' },
    { slug: 'protocolo-w-usos-diversos', label: 'W — Diversos' },
    { slug: 'protocolo-x-intimo', label: 'X — Íntimo' },
    { slug: 'protocolo-y-intravenoso', label: 'Y — Intravenoso' },
    { slug: 'protocolo-z-frequencias', label: 'Z — Frequências' },
  ],
};
