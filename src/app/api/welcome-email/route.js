import { NextResponse } from 'next/server';
import { sendWelcomeEmail, createOrUpdateBrevoContact, BREVO_LIST_IDS } from '@/lib/brevo';

export async function POST(request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email obrigatorio' }, { status: 400 });
    }

    await sendWelcomeEmail(email, name);

    // Create/update contact in Brevo with segmentation
    createOrUpdateBrevoContact({
      email,
      attributes: {
        FIRSTNAME: name?.split(' ')[0] || '',
        LASTNAME: name?.split(' ').slice(1).join(' ') || '',
        FONTE: 'site',
        DATA_CADASTRO: new Date().toISOString().split('T')[0],
        COMPROU: 'false',
        PLANO: 'free',
      },
      listIds: [BREVO_LIST_IDS.SITE_CADASTRO, BREVO_LIST_IDS.NEWSLETTER],
    }).catch(err => console.error('Brevo contact error:', err.message));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Welcome email error:', error.message);
    return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 });
  }
}
