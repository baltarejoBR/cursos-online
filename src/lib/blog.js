import { createAdminSupabase } from './supabase-admin';

export async function getPublishedPosts(limit = 10, category = null) {
  const supabase = createAdminSupabase();
  let query = supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, category, cover_image, published_at, reading_time_minutes')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }
  if (limit) {
    query = query.limit(limit);
  }

  const { data } = await query;
  return data || [];
}

export async function getPostBySlug(slug) {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();
  return data;
}

export async function getRelatedPosts(currentSlug, category, limit = 3) {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, category, reading_time_minutes')
    .eq('published', true)
    .eq('category', category)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit);
  return data || [];
}
