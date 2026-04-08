import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { createServerSupabase } from '@/lib/supabase-server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json({ error: 'postId e obrigatorio' }, { status: 400 });
  }

  const admin = createAdminSupabase();

  const { data, error } = await admin
    .from('blog_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req) {
  try {
    const supabase = createServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { postId, content, isQuestion, parentId } = body;

    if (!postId || !content) {
      return NextResponse.json({ error: 'postId e content sao obrigatorios' }, { status: 400 });
    }

    const userName = user.user_metadata?.full_name || user.email;

    const admin = createAdminSupabase();

    const insertData = {
      post_id: postId,
      user_id: user.id,
      user_name: userName,
      user_email: user.email,
      content,
      is_question: isQuestion || false,
      parent_id: parentId || null,
    };

    const { data, error } = await admin
      .from('blog_comments')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
