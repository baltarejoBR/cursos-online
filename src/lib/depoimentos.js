export const CATEGORIAS_DEPOIMENTOS = {
  todos: { name: 'Todos', icon: '📋' },
  geral: { name: 'Geral', icon: '💬' },
  cancer: { name: 'Câncer', icon: '🎗️' },
  pele: { name: 'Pele', icon: '🩹' },
  circulacao: { name: 'Circulação', icon: '❤' },
  recuperacao: { name: 'Recuperação', icon: '💪' },
  animais: { name: 'Animais', icon: '🐾' },
};

const COUNTS = {
  geral: 131,
  cancer: 6,
  pele: 23,
  circulacao: 9,
  recuperacao: 7,
  animais: 23,
};

import { getImageUrl } from './storage';

function generatePaths(category, prefix, count) {
  return Array.from({ length: count }, (_, i) =>
    getImageUrl(`depoimentos/${category}/${prefix}-${String(i + 1).padStart(3, '0')}.jpg`)
  );
}

export const DEPOIMENTOS = {
  geral: generatePaths('geral', 'depoimento', COUNTS.geral),
  cancer: generatePaths('cancer', 'cancer', COUNTS.cancer),
  pele: generatePaths('pele', 'pele', COUNTS.pele),
  circulacao: generatePaths('circulacao', 'circulacao', COUNTS.circulacao),
  recuperacao: generatePaths('recuperacao', 'recuperacao', COUNTS.recuperacao),
  animais: generatePaths('animais', 'animais', COUNTS.animais),
};

export function getAllDepoimentos() {
  return Object.values(DEPOIMENTOS).flat();
}

export function getDepoimentosByCategory(category) {
  if (category === 'todos') return getAllDepoimentos();
  return DEPOIMENTOS[category] || [];
}

// Depoimentos em texto (alunos do curso)
export const DEPOIMENTOS_TEXTO = [
  {
    nome: 'Fabiula Maulepes',
    texto: 'Olá bom dia a todos! Excelente aula ontem e os conteúdos disponíveis no Google Drive são ótimos! Gratidão!',
    fonte: 'Telegram',
  },
  {
    nome: 'Paulo Henrique Soares Junior',
    texto: 'Bom dia a todos!!! Excelente aula ontem',
    fonte: 'Telegram',
  },
  {
    nome: 'Aluna do curso',
    texto: 'Adorei a aula! Vou precisar rever a aula. E obrigado por compartilharem o conhecimento!',
    fonte: 'Telegram',
  },
  {
    nome: 'Aluna do curso',
    texto: 'Amei a aula! Gratidão, Gabriel. Até quarta que vem.',
    fonte: 'Telegram',
  },
];
