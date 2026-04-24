import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { getSignedPlaybackUrl } from '@/lib/mux';

// POST - Gera token de playback assinado (apenas usuarios com acesso)
export async function POST(request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const { playbackId, lessonId, courseId, blogPostId } = await request.json();

  if (!playbackId) {
    return NextResponse.json({ error: 'playbackId obrigatorio' }, { status: 400 });
  }

  // Blog post da universidade: posts gratuitos nao exigem login
  if (blogPostId) {
    const { data: post } = await supabase
      .from('blog_posts')
      .select('is_premium, video_url, requires_auth')
      .eq('id', blogPostId)
      .single();

    if (!post || post.video_url !== playbackId) {
      return NextResponse.json({ error: 'Post nao encontrado' }, { status: 404 });
    }

    // Posts premium exigem usuario logado e plano premium
    if (post.is_premium) {
      if (!user) {
        return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();

      if (profile?.plan !== 'premium') {
        return NextResponse.json({ error: 'Sem acesso' }, { status: 403 });
      }
    } else if (post.requires_auth && !user) {
      // Post gratuito mas com gate de cadastro: basta estar logado
      return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
    }
    // Post gratuito sem requires_auth: libera o token para qualquer pessoa
  } else {
    // Para cursos: exige login
    if (!user) {
      return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
    }

    const isAdmin = user.email === 'baltarejo@gmail.com';

    if (!isAdmin) {
      // Logica original para cursos
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();

      const isPremium = profile?.plan === 'premium';

      if (!isPremium) {
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
  }

  try {
    const token = await getSignedPlaybackUrl(playbackId);
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Erro ao gerar token Mux:', error);
    return NextResponse.json({ error: 'Erro ao gerar token' }, { status: 500 });
  }
}
