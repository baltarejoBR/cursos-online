'use client';

import { useEffect, useState } from 'react';
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_GRANTED,
  CONSENT_OPEN_EVENT,
  CONSENT_REVOKED,
  readConsentBrowser,
  writeConsentBrowser,
} from '@/lib/consent';

export default function ConsentBanner() {
  const [consent, setConsent] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [manuallyOpened, setManuallyOpened] = useState(false);

  useEffect(() => {
    setConsent(readConsentBrowser());
    setHydrated(true);

    const onChange = (e) => setConsent(e?.detail?.value ?? readConsentBrowser());
    const onOpen = () => setManuallyOpened(true);
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
      window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
    };
  }, []);

  const decide = (value) => {
    writeConsentBrowser(value);
    setConsent(value);
    setShowDetails(false);
    setManuallyOpened(false);
  };

  if (!hydrated) return null;

  const needsChoice = !consent || manuallyOpened;

  if (!needsChoice) {
    // Botao discreto sempre disponivel para reabrir preferencias
    return (
      <button
        type="button"
        onClick={() => setManuallyOpened(true)}
        aria-label="Abrir preferencias de cookies"
        style={{
          position: 'fixed',
          left: 12,
          bottom: 12,
          padding: '6px 12px',
          background: 'rgba(26, 26, 26, 0.6)',
          color: '#f5ecd4',
          border: '1px solid rgba(201, 168, 76, 0.4)',
          borderRadius: 20,
          fontSize: 12,
          fontFamily: "'Work Sans', sans-serif",
          cursor: 'pointer',
          zIndex: 1000,
          backdropFilter: 'blur(6px)',
        }}
      >
        Preferencias de cookies
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies e privacidade"
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        left: 16,
        maxWidth: 460,
        marginLeft: 'auto',
        background: 'var(--bg-card, #ffffff)',
        color: 'var(--text, #1a1a1a)',
        border: '1px solid var(--border, #d8dace)',
        borderRadius: 12,
        boxShadow: '0 14px 40px rgba(26, 28, 24, 0.18)',
        padding: 20,
        zIndex: 10000,
        fontFamily: "'Work Sans', sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 8,
          fontFamily: "'Playfair Display', Georgia, serif",
          color: 'var(--gold-dark, #8a6d1b)',
        }}
      >
        Privacidade e cookies
      </h2>
      <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-muted, #5a5a52)', marginBottom: 12 }}>
        Usamos cookies e pixels (Meta) para medir o que funciona e melhorar o site.
        Voce pode aceitar, recusar ou ver mais detalhes — sua escolha fica salva por 1 ano
        e pode ser alterada a qualquer momento no rodape.
      </p>

      {showDetails && (
        <div
          style={{
            fontSize: 12.5,
            lineHeight: 1.55,
            background: 'var(--bg-input, #f5f2eb)',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            color: 'var(--text, #1a1a1a)',
          }}
        >
          <p style={{ marginBottom: 6 }}>
            <strong>O que coletamos se voce aceitar:</strong> eventos anonimos de visita, cadastro e compra
            enviados ao Meta (Pixel + Conversions API) para atribuir campanhas de anuncios.
          </p>
          <p style={{ marginBottom: 6 }}>
            <strong>Base legal:</strong> consentimento (LGPD art. 7º, I). Ao recusar, navegacao normal
            continua funcionando; so nao enviamos dados ao Meta.
          </p>
          <p>
            <strong>Seus direitos:</strong> acessar, corrigir ou apagar seus dados. Escreva para
            contato@metodocorpolimpo.com.br.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => decide(CONSENT_GRANTED)}
          style={{
            flex: '1 1 120px',
            padding: '10px 16px',
            background: 'var(--gold, #c9a84c)',
            color: '#1a1a1a',
            border: 'none',
            borderRadius: 8,
            fontSize: 13.5,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={() => decide(CONSENT_REVOKED)}
          style={{
            flex: '1 1 120px',
            padding: '10px 16px',
            background: 'transparent',
            color: 'var(--text, #1a1a1a)',
            border: '1px solid var(--border, #d8dace)',
            borderRadius: 8,
            fontSize: 13.5,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Recusar
        </button>
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          style={{
            flex: '1 1 100%',
            padding: '6px',
            background: 'transparent',
            color: 'var(--text-muted, #5a5a52)',
            border: 'none',
            fontSize: 12.5,
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          {showDetails ? 'Menos detalhes' : 'Personalizar / ver detalhes'}
        </button>
      </div>
    </div>
  );
}
