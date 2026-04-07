import { createAdminSupabase } from './supabase-admin';

export async function getFeaturedStoreProducts() {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from('store_products')
    .select('*')
    .eq('is_featured', true)
    .order('display_order');
  return data || [];
}

export async function getAllStoreProducts() {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from('store_products')
    .select('*')
    .order('display_order');
  return data || [];
}
