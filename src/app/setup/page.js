'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SetupPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSetup();
  }, []);

  async function checkSetup() {
    try {
      const response = await fetch('/api/setup/check');
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setStatus({ error: 'Erro ao verificar configuração' });
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="form-page">
        <div className="form-card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Verificando configuração...</p>
        </div>
      </div>
    );
  }

  const allReady = status?.supabase && status?.stripe && status?.webhook;

  return (
    <div className="form-page" style={{ alignItems: 'flex-start', paddingTop: '60px' }}>
      <div style={{ maxWidth: '600px', width: '100%', padding: '0 20px' }}>
        <h1 style={{ marginBottom: '8px' }}>Configuração do Sistema</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          Verifique se todas as integrações estão funcionando.
        </p>

        {allReady && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid var(--success)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '24px',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
            <p style={{ color: 'var(--success)', fontWeight: '600', fontSize: '1.1rem' }}>
              Tudo configurado! O sistema está pronto para uso.
            </p>
            <Link href="/" className="btn btn-gold" style={{ marginTop: '16px' }}>
              Ir para o Site
            </Link>
          </div>
        )}

        {/* Supabase */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Supabase</h2>
            <span style={{
              color: status?.supabase ? 'var(--success)' : '#ef4444',
              fontWeight: '600',
            }}>
              {status?.supabase ? '✅ Conectado' : '❌ Não configurado'}
            </span>
          </div>
          {status?.supabase ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
              Banco de dados e autenticação funcionando.
            </p>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
              Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local
            </p>
          )}
        </div>

        {/* Stripe */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Stripe (Pagamentos)</h2>
            <span style={{
              color: status?.stripe ? 'var(--success)' : '#ef4444',
              fontWeight: '600',
            }}>
              {status?.stripe ? '✅ Conectado' : '❌ Não configurado'}
            </span>
          </div>
          {!status?.stripe && (
            <div style={{ marginTop: '12px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
                Para configurar o Stripe:
              </p>
              <ol style={{ color: 'var(--text-muted)', fontSize: '0.9rem', paddingLeft: '20px', lineHeight: '2' }}>
                <li>Abra <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noopener">dashboard.stripe.com/test/apikeys</a></li>
                <li>Copie a <strong>Chave publicável</strong> (pk_test_...)</li>
                <li>Cole em NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no .env.local</li>
                <li>Copie a <strong>Chave secreta</strong> (sk_test_...)</li>
                <li>Cole em STRIPE_SECRET_KEY no .env.local</li>
                <li>Reinicie o servidor (npm run dev)</li>
              </ol>
            </div>
          )}
          {status?.stripe && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
              Pagamentos com cartão funcionando. Modo: {status.stripeMode}
            </p>
          )}
        </div>

        {/* Webhook */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Webhook Stripe</h2>
            <span style={{
              color: status?.webhook ? 'var(--success)' : 'var(--warning)',
              fontWeight: '600',
            }}>
              {status?.webhook ? '✅ Configurado' : '⚠️ Pendente'}
            </span>
          </div>
          {!status?.webhook && (
            <div style={{ marginTop: '12px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
                O webhook é necessário para confirmar pagamentos automaticamente.
                Configure após fazer deploy do site.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Endpoint: <code style={{ color: 'var(--primary)' }}>/api/webhooks/stripe</code>
              </p>
            </div>
          )}
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <button onClick={checkSetup} className="btn btn-outline" style={{ marginRight: '12px' }}>
            Verificar Novamente
          </button>
          <Link href="/" className="btn btn-gold">
            Ir para o Site
          </Link>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '16px',
};
