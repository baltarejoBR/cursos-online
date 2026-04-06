import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/brevo';

export async function POST(request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email obrigatorio' }, { status: 400 });
    }

    await sendWelcomeEmail(email, name);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Welcome email error:', error.message);
    return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 });
  }
}
