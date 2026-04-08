import { NextResponse } from 'next/server';
import { sendWelcomeEmail, createOrUpdateBrevoContact, BREVO_LIST_IDS } from '@/lib/brevo';
import { createAdminSupabase } from '@/lib/supabase-admin';

export async function POST(request) {
  try {
    const { email, name, whatsapp, howKnew, interests, userId } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email obrigatorio' }, { status: 400 });
    }

    await sendWelcomeEmail(email, name);

    // Map howKnew to Brevo FONTE
    const fonteMap = {
      instagram: 'instagram',
      youtube: 'youtube',
      amigos: 'site',
      google: 'site',
      forum: 'forum',
      outro: 'site',
    };

    // Create/update contact in Brevo
    createOrUpdateBrevoContact({
      email,
      attributes: {
        FIRSTNAME: name?.split(' ')[0] || '',
        LASTNAME: name?.split(' ').slice(1).join(' ') || '',
        FONTE: fonteMap[howKnew] || 'site',
        DATA_CADASTRO: new Date().toISOString().split('T')[0],
        COMPROU: 'false',
        PLANO: 'free',
      },
      listIds: [BREVO_LIST_IDS.SITE_CADASTRO, BREVO_LIST_IDS.NEWSLETTER],
    }).catch(err => console.error('Brevo contact error:', err.message));

    // Create/update contact in CRM (Supabase contacts table)
    const supabase = createAdminSupabase();
    const contactData = {
      full_name: name || null,
      email: email.toLowerCase().trim(),
      whatsapp_number: whatsapp || null,
      access_level: 'lead',
      lifecycle_stage: 'lead',
      first_source: howKnew || 'website',
      tags: ['site-cadastro'],
      custom_fields: {},
    };
    if (userId) contactData.user_id = userId;
    if (interests && interests.length > 0) contactData.custom_fields.interests = interests;
    if (howKnew) contactData.custom_fields.how_knew = howKnew;

    supabase.from('contacts').upsert(contactData, {
      onConflict: 'email',
    }).then(({ error }) => {
      if (error) console.error('CRM contact error:', error.message);
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Welcome email error:', error.message);
    return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 });
  }
}
