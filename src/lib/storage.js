// Helper para URLs de imagens do Supabase Storage
// Bucket: site-images (público)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET = 'site-images';

/**
 * Retorna a URL pública de uma imagem no Supabase Storage
 * @param {string} path - caminho do arquivo no bucket (ex: "produtos/capa-curso.png")
 */
export function getImageUrl(path) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

/**
 * Retorna a URL da imagem - aceita tanto caminho local (/images/...) quanto do Storage
 * Se começar com "/" assume que é local (public/), senão busca no Supabase Storage
 */
export function resolveImageUrl(imageRef) {
  if (!imageRef) return '/images/placeholder.png';
  if (imageRef.startsWith('/') || imageRef.startsWith('http')) return imageRef;
  return getImageUrl(imageRef);
}
