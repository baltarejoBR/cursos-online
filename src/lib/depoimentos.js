export const CATEGORIAS_DEPOIMENTOS = {
  todos: { name: 'Todos', icon: '📋' },
  geral: { name: 'Geral', icon: '💬' },
  cancer: { name: 'Cancer', icon: '🎗' },
  pele: { name: 'Pele', icon: '🩹' },
  circulacao: { name: 'Circulacao', icon: '❤' },
  recuperacao: { name: 'Recuperacao', icon: '💪' },
  animais: { name: 'Animais', icon: '🐾' },
};

const COUNTS = {
  geral: 131,
  cancer: 42,
  pele: 23,
  circulacao: 9,
  recuperacao: 7,
  animais: 23,
};

function generatePaths(category, prefix, count) {
  return Array.from({ length: count }, (_, i) =>
    `/depoimentos/${category}/${prefix}-${String(i + 1).padStart(3, '0')}.jpg`
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
