import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { createOrUpdateBrevoContact, BREVO_LIST_IDS } from '@/lib/brevo';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createServerSupabase();

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Create Brevo contact for OAuth users
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
        createOrUpdateBrevoContact({
          email: user.email,
          attributes: {
            FIRSTNAME: fullName.split(' ')[0] || '',
            LASTNAME: fullName.split(' ').slice(1).join(' ') || '',
            FONTE: 'site',
            DATA_CADASTRO: new Date().toISOString().split('T')[0],
            PLANO: 'free',
          },
          listIds: [BREVO_LIST_IDS.SITE_CADASTRO, BREVO_LIST_IDS.NEWSLETTER],
        }).catch(() => {});
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
