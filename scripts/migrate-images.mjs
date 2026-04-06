#!/usr/bin/env node
/**
 * Script para migrar imagens locais para Supabase Storage
 * Executa uma vez e pode ser deletado depois
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Ler .env.local manualmente
const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = 'site-images';
const PUBLIC_DIR = path.join(process.cwd(), 'public');

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

// Estrutura de pastas no Storage
const FOLDER_MAP = {
  // Logos
  'logo-metodo-corpo-limpo.png': 'logos/logo-metodo-corpo-limpo.png',
  'logo-corpo-limpo-linktree.png': 'logos/logo-corpo-limpo-linktree.png',
  'logo-clo2br.png': 'logos/logo-clo2br.png',
  'logo-cds-baltarejo.png': 'logos/logo-cds-baltarejo.png',
  'logo-forum-cds.png': 'logos/logo-forum-cds.png',
  // Capas de produtos
  'capa-curso-detox.png': 'produtos/capa-curso-detox.png',
  'capa-curso.png': 'produtos/capa-curso.png',
  'capa-livro-protocolos.png': 'produtos/capa-livro-protocolos.png',
  'capa-livro.png': 'produtos/capa-livro.png',
  'guia-protocolo-k.png': 'produtos/guia-protocolo-k.png',
  // Fotos do Gabriel
  'hero-gabriel.jpeg': 'gabriel/hero-gabriel.jpeg',
  'gabriel-casual.jpeg': 'gabriel/gabriel-casual.jpeg',
  'gabriel-cds-estudio.jpeg': 'gabriel/gabriel-cds-estudio.jpeg',
  'gabriel-cds-rustico.jpeg': 'gabriel/gabriel-cds-rustico.jpeg',
  'gabriel-close.jpeg': 'gabriel/gabriel-close.jpeg',
  'gabriel-com-cds.jpeg': 'gabriel/gabriel-com-cds.jpeg',
  'gabriel-profissional.jpeg': 'gabriel/gabriel-profissional.jpeg',
  'gabriel-real-cds.png': 'gabriel/gabriel-real-cds.png',
  'gabriel-real-sentado.png': 'gabriel/gabriel-real-sentado.png',
  'gabriel-terno.jpeg': 'gabriel/gabriel-terno.jpeg',
  'avatar-baltarejo.jpeg': 'gabriel/avatar-baltarejo.jpeg',
  'mentoria-baltarejo.jpeg': 'gabriel/mentoria-baltarejo.jpeg',
  // Outros
  'brinde-parque.jpeg': 'outros/brinde-parque.jpeg',
  'garrafa-cds.jpg': 'outros/garrafa-cds.jpg',
};

async function uploadFile(localPath, storagePath) {
  const ext = path.extname(localPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const fileBuffer = fs.readFileSync(localPath);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error(`  ERRO: ${storagePath} - ${error.message}`);
    return false;
  }
  console.log(`  OK: ${storagePath}`);
  return true;
}

async function migrateImages() {
  console.log('=== Migrando imagens do site ===\n');

  let ok = 0, fail = 0;

  // 1. Migrar imagens da pasta public/images/
  console.log('📁 Pasta: images/');
  for (const [filename, storagePath] of Object.entries(FOLDER_MAP)) {
    const localPath = path.join(PUBLIC_DIR, 'images', filename);
    if (fs.existsSync(localPath)) {
      const success = await uploadFile(localPath, storagePath);
      success ? ok++ : fail++;
    } else {
      console.log(`  SKIP: ${filename} (não encontrado)`);
    }
  }

  // 2. Migrar depoimentos
  console.log('\n📁 Pasta: depoimentos/');
  const depDir = path.join(PUBLIC_DIR, 'depoimentos');
  if (fs.existsSync(depDir)) {
    const categories = fs.readdirSync(depDir).filter(f =>
      fs.statSync(path.join(depDir, f)).isDirectory()
    );

    for (const cat of categories) {
      const catDir = path.join(depDir, cat);
      const files = fs.readdirSync(catDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
      console.log(`  Categoria: ${cat} (${files.length} arquivos)`);

      for (const file of files) {
        const localPath = path.join(catDir, file);
        const storagePath = `depoimentos/${cat}/${file}`;
        const success = await uploadFile(localPath, storagePath);
        success ? ok++ : fail++;
      }
    }
  }

  console.log(`\n=== Resultado: ${ok} ok, ${fail} erros ===`);
}

migrateImages().catch(console.error);
