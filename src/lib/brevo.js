const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.metodocorpolimpo.com.br';

// Brevo list IDs (created via API)
export const BREVO_LIST_IDS = {
  SITE_CADASTRO: 20,
  SITE_LEADS: 15,
  HOTMART: 16,
  FORUM_CDS: 17,
  MANYCHAT: 18,
  NEWSLETTER: 19,
};

async function sendEmail({ to, toName, subject, html }) {
  if (!BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not set, skipping email');
    return null;
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'Método Corpo Limpo', email: 'contato@metodocorpolimpo.com.br' },
        to: [{ email: to, name: toName || '' }],
        subject,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Brevo error:', err);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('Brevo send failed:', err.message);
    return null;
  }
}

function emailLayout(content) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f0f6fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="color:#1a6baa;font-size:1.5rem;margin:0;">Método Corpo Limpo</h1>
        </div>
        <div style="background:white;border-radius:16px;padding:40px;border:1px solid #c5d8e8;">
          ${content}
        </div>
        <div style="text-align:center;margin-top:24px;color:#4a6a8a;font-size:0.85rem;">
          <p>&copy; 2026 Método Corpo Limpo. Todos os direitos reservados.</p>
          <p><a href="${SITE_URL}" style="color:#1a6baa;">metodocorpolimpo.com.br</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendWelcomeEmail(email, name) {
  return sendEmail({
    to: email,
    toName: name,
    subject: 'Bem-vindo ao Método Corpo Limpo!',
    html: emailLayout(`
      <h2 style="color:#0d2137;margin:0 0 16px;">Bem-vindo, ${name || 'Aluno'}!</h2>
      <p style="color:#4a6a8a;line-height:1.7;margin:0 0 16px;">
        Sua conta no <strong>Método Corpo Limpo</strong> foi criada com sucesso.
        Agora você pode explorar nossos cursos, livros e conteúdos sobre Terapias Bio-oxidativas.
      </p>
      <p style="color:#4a6a8a;line-height:1.7;margin:0 0 24px;">
        Acesse sua área de aluno para começar:
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${SITE_URL}/minha-area" style="background:#1a6baa;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:600;display:inline-block;">
          Acessar Minha Área
        </a>
      </div>
      <p style="color:#4a6a8a;line-height:1.7;margin:16px 0 0;font-size:0.9rem;">
        Participe também do nosso grupo no Telegram:
        <a href="https://t.me/+YFVp36x1zKhmM2Ix" style="color:#1a6baa;">Entrar no grupo</a>
      </p>
    `),
  });
}

export async function sendPurchaseConfirmationEmail(email, name, productTitle, priceDisplay) {
  return sendEmail({
    to: email,
    toName: name,
    subject: `Pagamento confirmado - ${productTitle}`,
    html: emailLayout(`
      <h2 style="color:#0d2137;margin:0 0 16px;">Pagamento Confirmado!</h2>
      <div style="background:rgba(46,139,87,0.1);border:1px solid #2e8b57;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px;">
        <p style="color:#2e8b57;font-weight:700;margin:0;font-size:1.1rem;">✓ Compra realizada com sucesso</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:8px 0;color:#4a6a8a;border-bottom:1px solid #dde9f2;">Produto:</td>
          <td style="padding:8px 0;color:#0d2137;font-weight:600;border-bottom:1px solid #dde9f2;text-align:right;">${productTitle}</td>
        </tr>
        ${priceDisplay ? `
        <tr>
          <td style="padding:8px 0;color:#4a6a8a;">Valor:</td>
          <td style="padding:8px 0;color:#2e8b57;font-weight:700;text-align:right;">${priceDisplay}</td>
        </tr>
        ` : ''}
      </table>
      <p style="color:#4a6a8a;line-height:1.7;margin:0 0 24px;">
        Olá ${name || 'Aluno'}, seu acesso ao produto já está liberado na plataforma.
      </p>
      <div style="text-align:center;">
        <a href="${SITE_URL}/minha-area" style="background:#1a6baa;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:600;display:inline-block;">
          Acessar Meu Conteúdo
        </a>
      </div>
    `),
  });
}

export async function sendLeadCouponEmail(email, name, couponCode) {
  return sendEmail({
    to: email,
    toName: name,
    subject: 'Seu cupom de desconto Dioxi!',
    html: emailLayout(`
      <h2 style="color:#0d2137;margin:0 0 16px;">Seu cupom chegou!</h2>
      <p style="color:#4a6a8a;line-height:1.7;margin:0 0 24px;">
        Olá ${name || 'amigo(a)'}, você ganhou um cupom de 5% de desconto
        para sua compra na loja Dioxi!
      </p>
      <div style="background:linear-gradient(135deg,#2e8b57,#1a6baa);color:white;padding:24px;border-radius:12px;text-align:center;margin:0 0 24px;">
        <p style="font-size:2rem;font-weight:800;margin:0;letter-spacing:0.1em;">${couponCode}</p>
        <p style="margin:8px 0 0;opacity:0.85;font-size:0.9rem;">5% de desconto em todos os produtos</p>
      </div>
      <div style="text-align:center;">
        <a href="${SITE_URL}/loja" style="background:#1a6baa;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:600;display:inline-block;">
          Ir para a Loja
        </a>
      </div>
      <p style="color:#4a6a8a;line-height:1.7;margin:24px 0 0;font-size:0.9rem;">
        Aproveite e conheca nossos produtos: SDC (Dioxi), DMSO, kits completos e muito mais.
      </p>
    `),
  });
}

export async function sendAccessGrantedEmail(email, name, productTitle) {
  return sendEmail({
    to: email,
    toName: name,
    subject: `Acesso liberado - ${productTitle}`,
    html: emailLayout(`
      <h2 style="color:#0d2137;margin:0 0 16px;">Seu acesso foi liberado!</h2>
      <div style="background:rgba(46,139,87,0.1);border:1px solid #2e8b57;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px;">
        <p style="color:#2e8b57;font-weight:700;margin:0;font-size:1.1rem;">✓ ${productTitle}</p>
      </div>
      <p style="color:#4a6a8a;line-height:1.7;margin:0 0 24px;">
        Olá ${name || 'Aluno'}, seu acesso ao <strong>${productTitle}</strong> está ativo.
        Acesse a plataforma para aproveitar todo o conteúdo.
      </p>
      <div style="text-align:center;">
        <a href="${SITE_URL}/minha-area" style="background:#1a6baa;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:600;display:inline-block;">
          Acessar Agora
        </a>
      </div>
    `),
  });
}

// ============================================
// Contact Management (Brevo API v3)
// ============================================

export async function createOrUpdateBrevoContact({ email, attributes = {}, listIds = [] }) {
  if (!BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not set, skipping contact creation');
    return null;
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        attributes,
        listIds,
        updateEnabled: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Brevo contact error:', err);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('Brevo contact creation failed:', err.message);
    return null;
  }
}

export async function addContactToList(email, listId) {
  if (!BREVO_API_KEY) return null;

  try {
    const res = await fetch(`https://api.brevo.com/v3/contacts/lists/${listId}/contacts/add`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({ emails: [email.toLowerCase().trim()] }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Brevo add to list error:', err);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('Brevo add to list failed:', err.message);
    return null;
  }
}

export async function removeContactFromList(email, listId) {
  if (!BREVO_API_KEY) return null;

  try {
    const res = await fetch(`https://api.brevo.com/v3/contacts/lists/${listId}/contacts/remove`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({ emails: [email.toLowerCase().trim()] }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Brevo remove from list error:', err);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('Brevo remove from list failed:', err.message);
    return null;
  }
}
