import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase-server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const admin = searchParams.get('admin') === 'true';

  const supabase = admin ? createAdminSupabase() : createAdminSupabase();

  let query = supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, category, cover_image, published, published_at, reading_time_minutes, view_count')
    .order('created_at', { ascending: false });

  if (!admin) {
    query = query.eq('published', true);
  }
  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== 'baltarejo@gmail.com') {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, excerpt, category, tags, cover_image, study_references, published } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Titulo, conteudo e categoria sao obrigatorios' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const reading_time_minutes = Math.max(1, Math.ceil(wordCount / 200));

    const admin = createAdminSupabase();
    const { data, error } = await admin.from('blog_posts').insert({
      slug,
      title,
      content,
      excerpt,
      category,
      tags: tags || [],
      cover_image,
      study_references: study_references || [],
      reading_time_minutes,
      published: published || false,
      published_at: published ? new Date().toISOString() : null,
    }).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
