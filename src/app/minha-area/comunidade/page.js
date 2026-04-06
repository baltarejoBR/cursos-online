'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { PRODUCTS } from '@/lib/products';

export default function ComunidadePage() {
  const supabase = createClient();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const comunidade = PRODUCTS.filter(p => p.category === 'comunidade');

  useEffect(() => {
    async function checkAccess() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: userProducts } = await supabase
        .from('user_products')
        .select('product_id')
        .eq('user_id', user.id)
        .eq('active', true);

      const hasCommunity = (userProducts || []).some(up => {
        const product = PRODUCTS.find(p => p.id === up.product_id);
        return product && product.category === 'comunidade';
      });

      setHasAccess(hasCommunity);
      setLoading(false);
    }
    checkAccess();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="dashboard">
        <h1>Comunidade</h1>
        <p className="subtitle">Conecte-se com outros praticantes</p>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '48px 32px',
          textAlign: 'center',
          marginTop: '32px',
        }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🔒</span>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Acesso Exclusivo</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            A comunidade exclusiva esta disponivel para alunos dos cursos e assinantes.
            Adquira um curso para desbloquear o acesso.
          </p>
          <Link href="/planos" className="btn btn-primary">Ver Cursos e Planos</Link>
        </div>

        {/* Mostrar o que existe na comunidade */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-muted)' }}>O que voce tera acesso:</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {comunidade.map(item => (
              <div key={item.id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '20px',
                opacity: 0.7,
              }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Comunidade</h1>
      <p className="subtitle">Conecte-se com outros praticantes de Terapias Bio-oxidativas</p>

      <div style={{
        display: 'grid',
        gap: '20px',
        marginTop: '32px',
      }}>
        {comunidade.map(item => (
          <a
            key={item.id}
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px var(--shadow-hover)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: item.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                flexShrink: 0,
              }}>
                {item.id === 'grupo-telegram' ? '📱' : '💬'}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '12px' }}>{item.description}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {item.features.map((f, i) => (
                    <li key={i} style={{
                      background: 'var(--bg)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                    }}>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{
                color: 'var(--primary)',
                fontSize: '1.5rem',
                flexShrink: 0,
              }}>
                ↗
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
