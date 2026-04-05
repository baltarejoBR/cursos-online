import { createServerSupabase } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  const { slug } = params;
  const supabase = createServerSupabase();

  // 1. Verificar se o usuário está logado
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    return NextResponse.json(
      { error: 'Você precisa estar logado para acessar este conteúdo.' },
      { status: 401 }
    );
  }

  // 2. Verificar se o usuário tem plano premium
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  if (!profile || profile.plan !== 'premium') {
    return NextResponse.json(
      { error: 'Este conteúdo é exclusivo para assinantes Premium.' },
      { status: 403 }
    );
  }

  // 3. Verificar se o curso com este slug existe
  const { data: course } = await supabase
    .from('courses')
    .select('id, title, content_slug')
    .eq('content_slug', slug)
    .single();

  if (!course) {
    return NextResponse.json(
      { error: 'Conteúdo não encontrado.' },
      { status: 404 }
    );
  }

  // 4. Ler o arquivo HTML da pasta protegida
  const filePath = path.join(process.cwd(), 'src', 'content', `${slug}.html`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: 'Arquivo de conteúdo não encontrado.' },
      { status: 404 }
    );
  }

  const htmlContent = fs.readFileSync(filePath, 'utf-8');

  // 5. Retornar o HTML completo
  return new NextResponse(htmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
