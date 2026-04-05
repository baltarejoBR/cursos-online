import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { getSignedPlaybackUrl } from '@/lib/mux';

// POST - Gera token de playback assinado (apenas usuarios com acesso)
export async function POST(request) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  }

  const { playbackId, lessonId, courseId } = await request.json();

  if (!playbackId) {
    return NextResponse.json({ error: 'playbackId obrigatorio' }, { status: 400 });
  }

  // Verificar acesso: admin, premium, ou matriculado em curso gratuito
  const isAdmin = user.email === 'baltarejo@gmail.com';

  if (!isAdmin) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    const isPremium = profile?.plan === 'premium';

    if (!isPremium) {
      // Verificar se o curso e gratuito e o usuario esta matriculado
      if (courseId) {
        const { data: course } = await supabase
          .from('courses')
          .select('is_free')
          .eq('id', courseId)
          .single();

        if (course?.is_free) {
          const { data: enrollment } = await supabase
            .from('enrollments')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', courseId)
            .single();

          if (!enrollment) {
            return NextResponse.json({ error: 'Sem acesso' }, { status: 403 });
          }
        } else {
          // Verificar se comprou o produto
          const { data: userProduct } = await supabase
            .from('user_products')
            .select('id')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

          if (!userProduct) {
            return NextResponse.json({ error: 'Sem acesso' }, { status: 403 });
          }
        }
      } else {
        return NextResponse.json({ error: 'Sem acesso' }, { status: 403 });
      }
    }
  }

  try {
    const token = getSignedPlaybackUrl(playbackId);
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Erro ao gerar token Mux:', error);
    return NextResponse.json({ error: 'Erro ao gerar token' }, { status: 500 });
  }
}
