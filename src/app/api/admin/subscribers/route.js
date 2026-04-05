import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase-admin';

const ADMIN_EMAILS = ['baltarejo@gmail.com'];

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) { return cookieStore.get(name)?.value; },
          set(name, value, options) { cookieStore.set({ name, value, ...options }); },
          remove(name, options) { cookieStore.set({ name, value: '', ...options }); },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const supabaseAdmin = createAdminSupabase();

    // Buscar todos os perfis com suas assinaturas
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: subscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: payments } = await supabaseAdmin
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    // Estatísticas
    const totalUsers = profiles?.length || 0;
    const premiumUsers = profiles?.filter(p => p.plan === 'premium').length || 0;
    const activeSubscriptions = subscriptions?.filter(s => s.status === 'active').length || 0;
    const totalRevenue = payments
      ?.filter(p => p.status === 'succeeded')
      .reduce((acc, p) => acc + p.amount, 0) || 0;

    return NextResponse.json({
      stats: {
        totalUsers,
        premiumUsers,
        activeSubscriptions,
        totalRevenue,
      },
      profiles: profiles || [],
      subscriptions: subscriptions || [],
      recentPayments: payments || [],
    });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
