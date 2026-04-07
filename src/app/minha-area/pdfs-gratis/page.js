'use client';

import { PRODUCTS } from '@/lib/products';

export default function PDFsGratisPage() {
  const freePdfs = PRODUCTS.filter(p => p.category === 'gratuitos');

  return (
    <div className="dashboard">
      <h1>PDFs Gratis</h1>
      <p className="subtitle">Material gratuito para voce comecar seus estudos</p>

      <div style={{
        display: 'grid',
        gap: '20px',
        marginTop: '32px',
      }}>
        {freePdfs.map(pdf => (
          <a
            key={pdf.id}
            href={pdf.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--gold)';
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
                borderRadius: '12px',
                background: pdf.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                flexShrink: 0,
              }}>
                📄
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{pdf.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{pdf.description}</p>
              </div>
              <div style={{
                color: 'var(--gold)',
                fontSize: '1.2rem',
                flexShrink: 0,
              }}>
                ↗
              </div>
            </div>
          </a>
        ))}

        {freePdfs.length === 0 && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
          }}>
            <p style={{ color: 'var(--text-muted)' }}>Novos materiais gratuitos em breve!</p>
          </div>
        )}
      </div>
    </div>
  );
}
