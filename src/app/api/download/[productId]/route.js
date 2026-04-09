import { createServerSupabase } from '@/lib/supabase-server';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ADMIN_EMAILS = ['baltarejo@gmail.com'];

// Mapear product_id para arquivo PDF
const DOWNLOAD_MAP = {
  'livro-animais': {
    file: 'livro-cds-animais.pdf',
    name: 'Livro CDS para Animais - Metodo Corpo Limpo.pdf',
  },
  'livro-completo': {
    file: 'livro-completo-cds.pdf',
    name: 'Mude Sua Vida com o CDS - Metodo Corpo Limpo.pdf',
  },
};

export async function GET(request, { params }) {
  const { productId } = params;
  const supabase = createServerSupabase();

  // Verificar autenticacao
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Voce precisa estar logado.' }, { status: 401 });
  }

  // Admin sempre tem acesso
  const isAdmin = ADMIN_EMAILS.includes(user.email);

  if (!isAdmin) {
    // Verificar acesso via user_products
    const supabaseAdmin = createAdminSupabase();
    const { data: access } = await supabaseAdmin
      .from('user_products')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('active', true)
      .single();

    if (!access) {
      return NextResponse.json({ error: 'Voce nao tem acesso a este download.' }, { status: 403 });
    }
  }

  // Buscar arquivo
  const download = DOWNLOAD_MAP[productId];
  if (!download) {
    return NextResponse.json({ error: 'Download nao disponivel para este produto.' }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), 'public', 'downloads', download.file);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Arquivo nao encontrado.' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${download.name}"`,
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
