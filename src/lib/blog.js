import { createAdminSupabase } from './supabase-admin';

export async function getPublishedPosts({ limit = 50, category = null, subcategory = null, sortBy = 'date' } = {}) {
  const supabase = createAdminSupabase();
  let query = supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, category, subcategory, is_premium, cover_image, published_at, reading_time_minutes');

  query = query.eq('published', true);

  if (category) {
    query = query.eq('category', category);
  }
  if (subcategory) {
    query = query.eq('subcategory', subcategory);
  }

  if (sortBy === 'alpha') {
    query = query.order('title', { ascending: true });
  } else {
    query = query.order('published_at', { ascending: false });
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data } = await query;
  return data || [];
}

export async function getFeaturedPosts() {
  const supabase = createAdminSupabase();
  const categories = ['protocolos', 'ciencia', 'iniciantes'];
  const results = [];

  for (const cat of categories) {
    const { data } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, category, is_premium, cover_image, published_at, reading_time_minutes')
      .eq('published', true)
      .eq('category', cat)
      .eq('is_premium', false)
      .order('published_at', { ascending: false })
      .limit(2);
    if (data) results.push(...data);
  }

  return results;
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

export async function getPostForUser(slug, userPlan) {
  const post = await getPostBySlug(slug);
  if (!post) return null;

  if (post.is_premium && userPlan !== 'premium') {
    // Strip HTML tags, truncate to ~200 words, wrap back
    const text = post.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text.split(' ').slice(0, 200).join(' ');
    return {
      ...post,
      content: `<p>${words}...</p>`,
      isLocked: true,
    };
  }

  return { ...post, isLocked: false };
}

export async function getRelatedPosts(currentSlug, category, limit = 3) {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, category, is_premium, reading_time_minutes')
    .eq('published', true)
    .eq('category', category)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit);
  return data || [];
}
