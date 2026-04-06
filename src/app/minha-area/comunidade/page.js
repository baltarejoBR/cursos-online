'use client';

import { PRODUCTS } from '@/lib/products';

export default function ComunidadePage() {
  const comunidade = PRODUCTS.filter(p => p.category === 'comunidade');

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
