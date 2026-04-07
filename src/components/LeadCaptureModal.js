'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function LeadCaptureModal() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const lastShown = localStorage.getItem('dioxi_lead_popup_shown');
        if (lastShown && Date.now() - parseInt(lastShown) < 7 * 24 * 60 * 60 * 1000) return;

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) return;

        setShow(true);
      } catch (e) {
        // silently fail
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();

      if (data.coupon_code) {
        setCoupon(data.coupon_code);
        localStorage.setItem('dioxi_lead_popup_shown', Date.now().toString());
      } else {
        setError(data.error || 'Erro ao gerar cupom');
      }
    } catch {
      setError('Erro de conexao. Tente novamente.');
    }
    setLoading(false);
  }

  function handleClose() {
    setShow(false);
    localStorage.setItem('dioxi_lead_popup_shown', Date.now().toString());
  }

  function handleCopy() {
    navigator.clipboard.writeText(coupon);
  }

  if (!show) return null;

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px 32px',
          maxWidth: '440px',
          width: '100%',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#999',
            lineHeight: 1,
          }}
          aria-label="Fechar"
        >
          &times;
        </button>

        {!coupon ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎁</div>
              <h2 style={{ fontSize: '1.5rem', color: '#0d2137', marginBottom: '8px' }}>
                Ganhe 10% de Desconto!
              </h2>
              <p style={{ color: '#4a6a8a', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Cadastre seu email e receba um cupom exclusivo para sua primeira compra na loja Dioxi.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  background: 'rgba(185,60,60,0.1)',
                  color: '#b93c3c',
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  fontSize: '0.9rem',
                }}>
                  {error}
                </div>
              )}
              <div style={{ marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Seu nome (opcional)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#f0f6fa',
                    border: '1px solid #c5d8e8',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="email"
                  placeholder="Seu melhor email *"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#f0f6fa',
                    border: '1px solid #c5d8e8',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #2e8b57, #1a6baa)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Gerando cupom...' : 'Quero meu Cupom!'}
              </button>
            </form>

            <p style={{ textAlign: 'center', color: '#999', fontSize: '0.8rem', marginTop: '12px' }}>
              Nao enviamos spam. Voce pode cancelar a qualquer momento.
            </p>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎉</div>
            <h2 style={{ fontSize: '1.5rem', color: '#0d2137', marginBottom: '8px' }}>
              Seu cupom esta pronto!
            </h2>
            <p style={{ color: '#4a6a8a', marginBottom: '20px' }}>
              Use o codigo abaixo na loja para ganhar 10% de desconto:
            </p>

            <div
              onClick={handleCopy}
              style={{
                background: 'linear-gradient(135deg, #2e8b57, #1a6baa)',
                color: 'white',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '0.1em' }}>
                {coupon}
              </div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '4px' }}>
                Clique para copiar
              </div>
            </div>

            <a
              href="/loja"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: '#1a6baa',
                color: 'white',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem',
              }}
            >
              Ir para a Loja
            </a>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
