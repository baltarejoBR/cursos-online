'use client';

import { useEffect, useMemo, useState } from 'react';
import { DEPOIMENTOS } from '@/lib/depoimentos';
import { trackMetaEvent } from '@/components/MetaPixel';

// Ref: CDS/database/knowledge-base/04-funil-vendas/utm-strategy.md
const LP_DEFAULTS = {
  utm_source: 'lp_40off',
  utm_medium: 'form',
  utm_campaign: 'curso-40off',
};

// Pagina Hotmart do curso (price display 297 — Hotmart aplica cupom 40% OFF no checkout)
const HOTMART_BASE_URL = 'https://pay.hotmart.com/X100011388O?checkoutMode=10';

const BENEFITS = [
  'Protocolo completo passo a passo — do iniciante ao avançado',
  'Dosagens por condição (mais de 150 protocolos do A a Z)',
  'Acesso ao livro Transforme Sua Saúde + ebook Detox Biooxidativo',
  'Comunidade exclusiva de alunos no WhatsApp + Telegram',
  'Consultoria em grupo mensal (tira-dúvidas ao vivo)',
];

const FAQ = [
  {
    q: 'É seguro? Tem estudo científico?',
    a: 'Sim. O curso cobre toda a base científica, depoimentos reais e o protocolo de segurança que eu sigo há 5 anos.',
  },
  {
    q: 'Quanto tempo demora pra sentir resultado?',
    a: 'Depende da condição e do protocolo. A maioria dos alunos relata melhora nas primeiras 2–4 semanas seguindo certo.',
  },
  {
    q: 'Serve pra qualquer idade?',
    a: 'O curso cobre adultos. Protocolos pediátricos e para animais são tratados separadamente.',
  },
  {
    q: 'E se eu não gostar?',
    a: 'Garantia Hotmart de 7 dias. Se não for pra você, peça o reembolso direto pela plataforma.',
  },
];

function buildHotmartUrl(utms) {
  const url = new URL(HOTMART_BASE_URL);
  Object.entries(utms).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
  });
  // Hotmart aceita `src` como canal de origem pra atribuicao
  if (utms.utm_source) url.searchParams.set('src', utms.utm_source);
  return url.toString();
}

function readCookie(name) {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[2]) : null;
}

export default function FortyOffClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [utms, setUtms] = useState(LP_DEFAULTS);

  // Parse UTMs da query string
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const parsed = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(k => {
      const v = sp.get(k);
      if (v) parsed[k] = v;
    });
    setUtms(prev => ({ ...prev, ...parsed }));
  }, []);

  const hotmartHref = useMemo(() => buildHotmartUrl(utms), [utms]);

  const depoimentosAmostra = useMemo(
    () => (DEPOIMENTOS.geral || []).slice(0, 6),
    []
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (state === 'loading') return;
    setState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          phone,
          source: 'lp_40off',
          utm_source: utms.utm_source,
          utm_medium: utms.utm_medium,
          utm_campaign: utms.utm_campaign,
          utm_content: utms.utm_content,
          utm_term: utms.utm_term,
          fbp: readCookie('_fbp'),
          fbc: readCookie('_fbc'),
          tags: ['lp_40off', 'form'],
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setState('error');
        setErrorMsg(data.error || 'Erro ao enviar. Tente novamente.');
        return;
      }

      if (!data.already_existed && data.leadId) {
        trackMetaEvent('Lead', {
          content_name: 'lp_40off',
          content_category: 'landing-page',
          eventID: data.leadId,
        });
      }

      setState('success');
      // Redireciona pro Hotmart apos 800ms (mostra mensagem de confirmacao)
      setTimeout(() => {
        window.location.href = hotmartHref;
      }, 900);
    } catch (err) {
      setState('error');
      setErrorMsg('Erro de conexão. Tente novamente.');
    }
  }

  return (
    <div style={{ background: '#0b1a2a', color: '#f4efe1', minHeight: '100vh' }}>
      {/* HERO */}
      <section style={{ padding: '56px 20px 32px', maxWidth: 980, margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #c9a84c, #e6c873)',
            color: '#1a1a1a',
            padding: '8px 20px',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: '0.85rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          Oferta por tempo limitado — 40% OFF
        </div>
        <h1 style={{ fontSize: '2.4rem', lineHeight: 1.15, margin: '0 0 16px', fontWeight: 800 }}>
          Do iniciante ao avançado: o Método Corpo Limpo completo
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#cbd5df', maxWidth: 720, margin: '0 auto 28px', lineHeight: 1.55 }}>
          O mesmo protocolo que eu uso e ensino para mais de 2.000 alunos — dosagens,
          segurança, mais de 150 aplicações por condição, comunidade e consultoria em grupo.
        </p>

        {/* Video slot (placeholder ate Gabriel definir URL final) */}
        <div
          style={{
            aspectRatio: '16/9',
            width: '100%',
            maxWidth: 720,
            margin: '0 auto 28px',
            background: 'linear-gradient(135deg, #1d2f44, #0e1a2a)',
            borderRadius: 14,
            border: '2px solid rgba(201, 168, 76, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#cbd5df',
            fontSize: '0.95rem',
          }}
        >
          <span>▶ Assistir o vídeo</span>
        </div>
      </section>

      {/* OFERTA + FORM */}
      <section
        style={{
          padding: '0 20px 48px',
          maxWidth: 980,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 28,
        }}
      >
        {/* Bullets */}
        <div
          style={{
            background: '#102238',
            border: '1px solid rgba(201, 168, 76, 0.25)',
            borderRadius: 16,
            padding: '28px',
          }}
        >
          <h2 style={{ fontSize: '1.35rem', margin: '0 0 16px', color: '#e6c873' }}>O que você leva:</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {BENEFITS.map((b, i) => (
              <li
                key={i}
                style={{
                  padding: '10px 0',
                  borderBottom: i < BENEFITS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  fontSize: '1.02rem',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: '#c9a84c', fontSize: '1.2rem', flexShrink: 0 }}>✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#102238',
            border: '1px solid rgba(201, 168, 76, 0.35)',
            borderRadius: 16,
            padding: '28px',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', margin: '0 0 8px' }}>Receba a oferta pelo WhatsApp</h2>
          <p style={{ color: '#9fb3c8', fontSize: '0.9rem', margin: '0 0 18px' }}>
            Preencha abaixo — você será levado direto pra página de compra com o desconto.
          </p>

          {state === 'error' && (
            <div
              style={{
                background: 'rgba(185,60,60,0.15)',
                color: '#ffb3b3',
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 12,
                fontSize: '0.9rem',
              }}
            >
              {errorMsg}
            </div>
          )}
          {state === 'success' && (
            <div
              style={{
                background: 'rgba(60,185,90,0.15)',
                color: '#9ef0a3',
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 12,
                fontSize: '0.9rem',
              }}
            >
              Dados recebidos! Redirecionando pra oferta…
            </div>
          )}

          <div style={{ display: 'grid', gap: 10 }}>
            <input
              type="text"
              required
              placeholder="Seu nome"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
              autoComplete="name"
            />
            <input
              type="email"
              required
              placeholder="Seu melhor email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              autoComplete="email"
            />
            <input
              type="tel"
              required
              placeholder="WhatsApp com DDD (ex: 11 99999-9999)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={inputStyle}
              autoComplete="tel"
              inputMode="tel"
            />
          </div>

          <button
            type="submit"
            disabled={state === 'loading' || state === 'success'}
            style={{
              width: '100%',
              marginTop: 16,
              padding: '16px',
              background:
                state === 'loading' || state === 'success'
                  ? 'rgba(201,168,76,0.5)'
                  : 'linear-gradient(135deg, #c9a84c, #e6c873)',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: 999,
              fontSize: '1.05rem',
              fontWeight: 800,
              cursor: state === 'loading' ? 'wait' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {state === 'loading' ? 'Enviando…' : 'Quero a oferta 40% OFF'}
          </button>

          <p style={{ fontSize: '0.8rem', color: '#7c95ae', marginTop: 12, textAlign: 'center' }}>
            Sem spam. Usamos seus dados só pra enviar informação do curso.
          </p>

          {/* CTA alternativo direto pro Hotmart (buyer que ja decidiu) */}
          <a
            href={hotmartHref}
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: 18,
              color: '#e6c873',
              fontSize: '0.9rem',
              textDecoration: 'underline',
            }}
          >
            Já sabe que quer? Ir direto pro checkout →
          </a>
        </form>
      </section>

      {/* DEPOIMENTOS */}
      <section style={{ padding: '32px 20px 48px', maxWidth: 1080, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.4rem', textAlign: 'center', margin: '0 0 24px' }}>
          Quem já fez, recomenda
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 14,
          }}
        >
          {depoimentosAmostra.map((src, i) => (
            <div
              key={src}
              style={{
                aspectRatio: '1',
                background: '#0f1f32',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Depoimento ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 18, color: '#9fb3c8', fontSize: '0.9rem' }}>
          + de 199 depoimentos reais em{' '}
          <a href="/depoimentos" style={{ color: '#e6c873' }}>
            /depoimentos
          </a>
        </p>
      </section>

      {/* FAQ */}
      <section style={{ padding: '16px 20px 56px', maxWidth: 820, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.4rem', textAlign: 'center', margin: '0 0 24px' }}>Perguntas comuns</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {FAQ.map((item, i) => (
            <details
              key={i}
              style={{
                background: '#102238',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '14px 18px',
              }}
            >
              <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#e6c873' }}>{item.q}</summary>
              <p style={{ marginTop: 8, color: '#cbd5df', lineHeight: 1.55 }}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '32px 20px 80px', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: '#cbd5df', marginBottom: 18 }}>
          A oferta de 40% OFF não fica no ar pra sempre. Garante agora com cupom aplicado no checkout.
        </p>
        <a
          href={hotmartHref}
          style={{
            display: 'inline-block',
            padding: '16px 36px',
            background: 'linear-gradient(135deg, #c9a84c, #e6c873)',
            color: '#1a1a1a',
            borderRadius: 999,
            fontSize: '1.05rem',
            fontWeight: 800,
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Garantir com 40% OFF
        </a>
      </section>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '13px 14px',
  background: '#0b1a2a',
  border: '1px solid rgba(201, 168, 76, 0.35)',
  borderRadius: 10,
  color: '#f4efe1',
  fontSize: '1rem',
  outline: 'none',
};
