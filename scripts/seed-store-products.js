// Seed store_products table with clo2br product data
// Run: node scripts/seed-store-products.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const products = [
  { category: 'Combo', name: 'COMBO SUPER', items_description: '2 SDC VD + ORMUS 1000 mL + DMSO 70% 250 mL + Bolsa + 2 sondas', price_cents: 78700, price_display: 'R$ 787,00', installments: '3x R$ 262,33', discount_percent: 7, commission_percent: 20, external_url: 'https://www.clo2br.com.br/combo-super-2-cds-vd-ormus-1000ml-dmso-70-250ml-bolsa2-sondas', is_featured: false, display_order: 1 },
  { category: 'Combo', name: 'COMBO VITALIDADE', items_description: 'SDC 1000 mL VD + ORMUS 1000 mL + DMSO 70% 100 mL', price_cents: 48700, price_display: 'R$ 487,00', installments: '3x R$ 162,33', discount_percent: 7, commission_percent: 20, external_url: 'https://www.clo2br.com.br/combo-vitalidade-cds-1000ml-ormus-1000ml-dmso-100ml', is_featured: false, display_order: 2 },
  { category: 'Combo', name: 'COMBO LIMPEZA NASAL (vidro)', items_description: 'SDC 1000 mL emb. vidro + DMSO 70% 100 mL + frasco nasal', price_cents: 31300, price_display: 'R$ 313,00', installments: '3x R$ 104,33', discount_percent: 5, commission_percent: 20, external_url: 'https://www.clo2br.com.br/combo-limpeza-nasal-cds-1000ml-emb-vidro-dmso-70-100ml-frasco-nasal', is_featured: true, display_order: 3 },
  { category: 'Combo', name: 'COMBO LIMPEZA NASAL (PET)', items_description: 'SDC 1000 mL emb. PET + DMSO 70% 100 mL + frasco nasal', price_cents: 27000, price_display: 'R$ 270,00', installments: '3x R$ 90,00', discount_percent: 5, commission_percent: 20, external_url: 'https://www.clo2br.com.br/combo-limpeza-nasal-cds-1000ml-emb-pet-dmso-70-100ml-frasco-nasal', is_featured: false, display_order: 4 },
  { category: 'Combo', name: 'KIT ENEMA', items_description: 'SDC 1000 mL PET + Extrato desparasitacao + Bolsa + 2 sondas', price_cents: 29700, price_display: 'R$ 297,00', installments: '3x R$ 99,00', discount_percent: 5, commission_percent: 20, external_url: 'https://www.clo2br.com.br/kit-enema-sdccds-1000ml-pet-extr-desparasitacao-bolsa-2-sondas', is_featured: false, display_order: 5 },
  { category: 'Combo', name: 'Kit Saneante 100 mL + 100 mL plastico', items_description: '100 mL + 100 mL de solucao', price_cents: 10900, price_display: 'R$ 109,00', installments: '3x R$ 36,33', discount_percent: 22, commission_percent: 20, external_url: 'https://www.clo2br.com.br/01-x-kit-iniciante-purificador-de-agua-100ml-100ml-vol-200ml', is_featured: false, display_order: 6 },
  { category: 'Combo', name: 'Kit Saneante 60 mL + 60 mL', items_description: '60 mL + 60 mL de solucao', price_cents: 7100, price_display: 'R$ 71,00', installments: '3x R$ 23,66', discount_percent: 22, commission_percent: 20, external_url: 'https://www.clo2br.com.br/kit-purificador-iniciante-de-agua-60ml-60ml-vol-120ml', is_featured: false, display_order: 7 },
  { category: 'Combo', name: 'Kit Saneante 100 mL + 100 mL vidro', items_description: '100 mL + 100 mL de solucao em vidro', price_cents: 15950, price_display: 'R$ 159,50', installments: '3x R$ 53,16', discount_percent: 8, commission_percent: 20, external_url: 'https://www.clo2br.com.br/kit-purificador-iniciante-de-agua-100ml-100ml-vol-200ml-vidro', is_featured: false, display_order: 8 },
  { category: 'Combo', name: 'Kit Saneante 100 mL vidro + DMSO 99% 100 mL', items_description: '100 mL + 100 mL + DMSO 99% 100 mL', price_cents: 29600, price_display: 'R$ 296,00', installments: '3x R$ 98,66', discount_percent: 10, commission_percent: 20, external_url: 'https://www.clo2br.com.br/kit-purificador-de-agua-dmso-99-100ml-100ml-100ml-vol-300ml-vidro', is_featured: false, display_order: 9 },
  { category: 'Combo', name: 'Solucao eletrolitica 3000 ppm 500 mL', items_description: '500 mL de solucao eletrolitica', price_cents: 13900, price_display: 'R$ 139,00', installments: '3x R$ 46,33', discount_percent: 18, commission_percent: 20, external_url: 'https://www.clo2br.com.br/sdc-cds-500ml-eletrolitico', is_featured: false, display_order: 10 },
  { category: 'Combo', name: 'Solucao eletrolitica 3000 ppm 1000 mL vidro', items_description: '1000 mL de solucao eletrolitica em vidro', price_cents: 26200, price_display: 'R$ 262,00', installments: '3x R$ 87,33', discount_percent: 7, commission_percent: 20, external_url: 'https://www.clo2br.com.br/sdc-cds-1000ml-eletrolitico', is_featured: false, display_order: 11 },
  { category: 'Combo', name: 'Solucao eletrolitica 3000 ppm c/ acessorios 500 mL', items_description: '500 mL + acessorios', price_cents: 24400, price_display: 'R$ 244,00', installments: '3x R$ 81,33', discount_percent: 8, commission_percent: 20, external_url: 'https://www.clo2br.com.br/sdc-cds-eletrolitico-c-acessorios-500ml', is_featured: false, display_order: 12 },
  { category: 'Product', name: 'SDC 3000 ppm 1000 mL PET', items_description: '1000 mL emb. PET', price_cents: 11300, price_display: 'R$ 113,00', installments: '3x R$ 37,66', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/sdc-cds-por-reacao-quimica-1000ml', is_featured: true, display_order: 13 },
  { category: 'Product', name: 'SDC 3000 ppm 1000 mL vidro', items_description: '1000 mL emb. vidro', price_cents: 15900, price_display: 'R$ 159,00', installments: '3x R$ 53,00', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/cds-3000-ppm-solucao-de-dioxido-de-cloro-1000-ml-emb-vidro', is_featured: false, display_order: 14 },
  { category: 'Product', name: 'ORMUS 1000 mL', items_description: '1000 mL', price_cents: 24900, price_display: 'R$ 249,00', installments: '3x R$ 83,00', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/ormus-1000-ml', is_featured: false, display_order: 15 },
  { category: 'Product', name: 'ORMUS 500 mL', items_description: '500 mL', price_cents: 14700, price_display: 'R$ 147,00', installments: '3x R$ 49,00', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/ormus-500-ml', is_featured: false, display_order: 16 },
  { category: 'Product', name: 'DMSO 70% 100 mL', items_description: '100 mL', price_cents: 11500, price_display: 'R$ 115,00', installments: '3x R$ 38,33', discount_percent: 12, commission_percent: 20, external_url: 'https://www.clo2br.com.br/dmso-70-100-ml', is_featured: false, display_order: 17 },
  { category: 'Product', name: 'DMSO 70% 250 mL', items_description: '250 mL', price_cents: 23000, price_display: 'R$ 230,00', installments: '3x R$ 76,66', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/dmso-a-70-250-ml', is_featured: false, display_order: 18 },
  { category: 'Product', name: 'DMSO 70% 500 mL', items_description: '500 mL', price_cents: 42700, price_display: 'R$ 427,00', installments: '3x R$ 142,33', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/dmso-70-500ml', is_featured: false, display_order: 19 },
  { category: 'Product', name: 'DMSO 99,9% 100 mL', items_description: '100 mL', price_cents: 16950, price_display: 'R$ 169,50', installments: '3x R$ 56,50', discount_percent: 14, commission_percent: 20, external_url: 'https://www.clo2br.com.br/dmso-999-100-ml', is_featured: false, display_order: 20 },
  { category: 'Product', name: 'Prata Coloidal 25 ppm 500 mL', items_description: '500 mL', price_cents: 11900, price_display: 'R$ 119,00', installments: '3x R$ 39,66', discount_percent: 9, commission_percent: 20, external_url: 'https://www.clo2br.com.br/prata-coloidal-25-ppm-500-ml', is_featured: false, display_order: 21 },
  { category: 'Product', name: 'Lugol 5% 50 mL', items_description: '50 mL', price_cents: 6900, price_display: 'R$ 69,00', installments: '3x R$ 23,00', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/lugol-5-50-ml', is_featured: false, display_order: 22 },
  { category: 'Product', name: 'Azul de Metileno 5% 50 mL', items_description: '50 mL', price_cents: 13900, price_display: 'R$ 139,00', installments: '3x R$ 46,33', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/azul-de-metileno-solucao-a-5-50-ml', is_featured: false, display_order: 23 },
  { category: 'Product', name: 'Clorito de Sodio 80% po 1 kg', items_description: '1 kg', price_cents: 21900, price_display: 'R$ 219,00', installments: '3x R$ 73,00', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/clorito-de-sodio-80-em-po-1-kg', is_featured: false, display_order: 24 },
  { category: 'Product', name: 'Clorito de Sodio 22,4% 100 mL plastico', items_description: '100 mL plastico', price_cents: 7800, price_display: 'R$ 78,00', installments: '3x R$ 26,00', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/x-clorito-de-sodio-224-28-100-ml', is_featured: false, display_order: 25 },
  { category: 'Product', name: 'Extrato de Desparasitacao 50 mL', items_description: '50 mL', price_cents: 14900, price_display: 'R$ 149,00', installments: '3x R$ 49,66', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/extrato-de-desparasitacao-50-ml-protocolo-dra-hulda-clark-bohannerges', is_featured: false, display_order: 26 },
  { category: 'Product', name: 'Kit para limpeza da prostata', items_description: 'cha + oleo', price_cents: 16900, price_display: 'R$ 169,00', installments: '3x R$ 56,33', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/kit-para-limpeza-da-prostata-cha-oleo', is_featured: false, display_order: 27 },
  { category: 'Product', name: 'Extrato de Mirra e Ervas 50 mL', items_description: '50 mL', price_cents: 8850, price_display: 'R$ 88,50', installments: '3x R$ 29,50', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/extrato-de-mirra-panaceia-dente-de-leao-agulha-do-pinheiro-e-anis-estrelado-50-ml', is_featured: false, display_order: 28 },
  { category: 'Product', name: 'Oleo de Ricino 500 mL', items_description: '500 mL', price_cents: 15970, price_display: 'R$ 159,70', installments: '3x R$ 53,23', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/oleo-de-ricino-prensado-a-frio-procedencia-alemanha-500-ml', is_featured: false, display_order: 29 },
  { category: 'Product', name: 'Fitas de teste 0-500 ppm 50 unid', items_description: '50 unidades', price_cents: 55000, price_display: 'R$ 550,00', installments: '3x R$ 183,33', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/fitas-de-teste-de-dioxido-de-cloro-0-500-ppm-frasco-50-unidades', is_featured: false, display_order: 30 },
  { category: 'Product', name: 'Kit Coletor Menstrual feminino P/M', items_description: 'Kit coletor menstrual P/M', price_cents: 6000, price_display: 'R$ 60,00', installments: '3x R$ 20,00', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/kit-coletorcopo-menstrual-feminino-tamanho-p-e-m', is_featured: false, display_order: 31 },
  { category: 'Product', name: 'Enema PET 60 mL com sonda n14', items_description: '60 mL', price_cents: 12000, price_display: 'R$ 120,00', installments: '3x R$ 40,00', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/enema-pet-seringa-60-ml-com-sonda-retal-n-14', is_featured: false, display_order: 32 },
  { category: 'Product', name: 'Ducha Higienica Unissex 230 mL', items_description: '230 mL', price_cents: 12000, price_display: 'R$ 120,00', installments: '3x R$ 40,00', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/ducha-higienica-unissex-com-sonda-retal-230-ml-protocolo-retal-ou-vaginal', is_featured: false, display_order: 33 },
  { category: 'Product', name: 'Acido Cloridrico 4% 250 mL', items_description: '250 mL', price_cents: 12500, price_display: 'R$ 125,00', installments: '3x R$ 41,66', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/acido-cloridrico-4-250-ml', is_featured: false, display_order: 34 },
  { category: 'Product', name: 'Frasco Higienizador Nasal 300 mL', items_description: '300 mL', price_cents: 5630, price_display: 'R$ 56,30', installments: '2x R$ 28,15', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/frasco-higienizador-nasal-300-ml', is_featured: false, display_order: 35 },
  { category: 'Product', name: 'Bolsa coletora de urina 2000 mL + sonda', items_description: '2000 mL + sonda', price_cents: 4000, price_display: 'R$ 40,00', installments: '2x R$ 20,00', discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/bolsa-coletora-de-urina-2000ml-sonda-retal-n-14', is_featured: false, display_order: 36 },
  { category: 'Product', name: 'Sonda retal plastica n14', items_description: 'n 14', price_cents: 1000, price_display: 'R$ 10,00', installments: null, discount_percent: null, commission_percent: 20, external_url: 'https://www.clo2br.com.br/sonda-retal-plastica-n-14', is_featured: false, display_order: 37 },
];

async function seed() {
  console.log('Seeding store_products...');

  // Clear existing
  await supabase.from('store_products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Insert all
  const { data, error } = await supabase.from('store_products').insert(products);

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  console.log(`Inserted ${products.length} products successfully!`);
  console.log('Featured products: SDC 3000 ppm 1000 mL PET, COMBO LIMPEZA NASAL (vidro)');
}

seed();
