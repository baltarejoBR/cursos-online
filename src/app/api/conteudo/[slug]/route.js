import { createServerSupabase } from '@/lib/supabase-server';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Mapear slugs de conteudo HTML para product_ids
const CONTENT_PRODUCT_MAP = {
  'guia-animais-clo2': 'livro-animais',
};

const ADMIN_EMAILS = ['baltarejo@gmail.com'];

export async function GET(request, { params }) {
  const { slug } = params;
  const supabase = createServerSupabase();

  // 1. Verificar se o usuario esta logado
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    return NextResponse.json(
      { error: 'Voce precisa estar logado para acessar este conteudo.' },
      { status: 401 }
    );
  }

  // 2. Verificar acesso: admin sempre tem acesso
  const isAdmin = ADMIN_EMAILS.includes(user.email);

  if (!isAdmin) {
    // Verificar se tem acesso via user_products
    const productId = CONTENT_PRODUCT_MAP[slug];
    if (productId) {
      const supabaseAdmin = createAdminSupabase();
      const { data: access } = await supabaseAdmin
        .from('user_products')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('active', true)
        .single();

      if (!access) {
        // Fallback: verificar plano premium
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();

        if (!profile || profile.plan !== 'premium') {
          return NextResponse.json(
            { error: 'Voce nao tem acesso a este conteudo.' },
            { status: 403 }
          );
        }
      }
    }
  }

  // 3. Ler o arquivo HTML
  const filePath = path.join(process.cwd(), 'src', 'content', `${slug}.html`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: 'Arquivo de conteudo nao encontrado.' },
      { status: 404 }
    );
  }

  const htmlContent = fs.readFileSync(filePath, 'utf-8');

  return new NextResponse(htmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
