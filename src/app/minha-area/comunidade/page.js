'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { PRODUCTS } from '@/lib/products';

export default function ComunidadePage() {
  const supabase = createClient();
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccess() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from('user_products')
        .select('product_id')
        .eq('user_id', user.id)
        .eq('active', true);

      setUserProducts((data || []).map(up => up.product_id));
      setLoading(false);
    }
    loadAccess();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
      </div>
    );
  }

  const hasCurso = userProducts.some(id => {
    const p = PRODUCTS.find(pr => pr.id === id);
    return p && p.category === 'cursos';
  });

  const telegramGratis = PRODUCTS.find(p => p.id === 'grupo-telegram');

  return (
    <div className="dashboard">
      <h1>Comunidade</h1>
      <p className="subtitle">Conecte-se com outros praticantes de Terapias Bio-oxidativas</p>

      <div style={{ display: 'grid', gap: '24px', marginTop: '32px' }}>

        {/* 1. Grupo Telegram Gratis */}
        <a
          href={telegramGratis?.externalUrl || 'https://t.me/+YFVp36x1zKhmM2Ix'}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
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
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0088cc, #00aced)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              flexShrink: 0,
            }}>
              📱
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '1.15rem' }}>Grupo Telegram - Corpo Limpo</h3>
                <span className="badge badge-free">Gratis</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Comunidade aberta no Telegram. Troque experiencias, tire duvidas e fique por dentro das novidades.
              </p>
            </div>
            <div style={{ color: 'var(--primary)', fontSize: '1.3rem', flexShrink: 0 }}>↗</div>
          </div>
        </a>

        {/* 2. Grupo WhatsApp Pago - Exclusivo alunos */}
        <div style={{
          background: 'var(--bg-card)',
          border: hasCurso ? '1px solid var(--success)' : '1px solid var(--border)',
          borderRadius: '16px',
          padding: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          position: 'relative',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            flexShrink: 0,
          }}>
            💬
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Grupo WhatsApp Exclusivo</h3>
              <span className="badge badge-premium">Alunos</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
              Grupo exclusivo no WhatsApp para alunos dos cursos. Suporte direto, protocolos em tempo real e troca entre praticantes.
            </p>
            {hasCurso ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--success)',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}>
                ✓ Voce tem acesso — link em breve
              </span>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  🔒 Disponivel para alunos dos cursos
                </span>
                <Link href="/planos" className="btn btn-primary btn-sm">Ver Cursos</Link>
              </div>
            )}
          </div>
        </div>

        {/* 3. Bot Tira-Duvidas CDS */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6b9e4a, #2e8b57)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            flexShrink: 0,
          }}>
            🤖
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Bot Tira-Duvidas CDS</h3>
              <span className="badge" style={{
                background: 'rgba(26, 107, 170, 0.12)',
                color: 'var(--primary)',
              }}>Em breve</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
              Bot inteligente no WhatsApp que responde suas duvidas sobre CDS, protocolos e dosagens 24h por dia.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--primary-dark)',
              }}>
                R$ 39,00
                <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>/mes</span>
              </span>
              <span style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                fontStyle: 'italic',
              }}>
                Disponivel em breve — assinatura mensal
              </span>
            </div>
          </div>
        </div>

        {/* Forum */}
        <a
          href="https://www.forumcds.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
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
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #675614, #9a8220)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              flexShrink: 0,
            }}>
              💬
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '1.15rem' }}>Forum CDS</h3>
                <span className="badge badge-free">Gratis</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Forum online sobre CDS e Saude Integrativa. Artigos, discussoes e conteudo da comunidade.
              </p>
            </div>
            <div style={{ color: 'var(--primary)', fontSize: '1.3rem', flexShrink: 0 }}>↗</div>
          </div>
        </a>

      </div>
    </div>
  );
}
