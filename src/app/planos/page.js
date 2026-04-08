'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { PRODUCTS, CATEGORIES } from '@/lib/products';

const categoryOrder = ['cursos', 'livros', 'servicos', 'comunidade', 'loja', 'gratuitos'];

export default function PlanosPage() {
  return (
    <Suspense>
      <PlanosContent />
    </Suspense>
  );
}

function PlanosContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');
  const [activeFilter, setActiveFilter] = useState('todos');

  useEffect(() => {
    if (catParam && (catParam === 'todos' || CATEGORIES[catParam])) {
      setActiveFilter(catParam);
    }
  }, [catParam]);

  const filtered = activeFilter === 'todos'
    ? PRODUCTS.filter(p => !p.hidden)
    : PRODUCTS.filter(p => p.category === activeFilter && !p.hidden);

  return (
    <>
      <Header />

      <section className="hero" style={{ paddingBottom: '40px' }}>
        <div className="container">
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, color: 'white' }}>Nossos Produtos</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>
            Tudo sobre como desintoxicar seu corpo com Terapias Bio-oxidativas.
            Cursos, livros, mentoria e comunidade.
          </p>
        </div>
      </section>

      <main className="container" style={{ paddingBottom: '80px' }}>
        {/* Filtros */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => setActiveFilter('todos')}
            className="btn btn-sm"
            style={{
              background: activeFilter === 'todos' ? 'linear-gradient(135deg, #c9a84c, #e6c873)' : 'rgba(255,255,255,0.1)',
              color: activeFilter === 'todos' ? '#1a1a1a' : 'white',
              border: activeFilter === 'todos' ? 'none' : '1px solid rgba(255,255,255,0.2)',
              fontWeight: activeFilter === 'todos' ? 600 : 400,
            }}
          >
            Todos
          </button>
          {categoryOrder.map(catKey => {
            const cat = CATEGORIES[catKey];
            const isActive = activeFilter === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setActiveFilter(catKey)}
                className="btn btn-sm"
                style={{
                  background: isActive ? 'linear-gradient(135deg, #c9a84c, #e6c873)' : 'rgba(255,255,255,0.1)',
                  color: isActive ? '#1a1a1a' : 'white',
                  border: isActive ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {cat.icon} {cat.name}
              </button>
            );
          })}
        </div>

        {/* Grid de produtos */}
        <div className="courses-grid">
          {filtered.map(product => (
            <Link
              key={product.id}
              href={product.type === 'external' ? (product.externalUrl || '#') :
                    product.type === 'download' ? (product.downloadPath || '#') :
                    `/produto/${product.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              {...(product.type === 'external' ? { target: '_blank', rel: 'noopener' } : {})}
              {...(product.type === 'download' ? { download: true } : {})}
            >
              <div className="course-card">
                <div className="course-thumb" style={{ background: product.gradient, position: 'relative', overflow: 'hidden' }}>
                  {product.badge && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'linear-gradient(135deg, #c9a84c, #e6c873)',
                      color: '#1a1a1a',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      zIndex: 2,
                    }}>
                      {product.badge}
                    </span>
                  )}
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      style={{ objectFit: 'contain' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <span style={{ fontSize: '2.5rem' }}>
                      {CATEGORIES[product.category]?.icon || '📦'}
                    </span>
                  )}
                </div>
                <div className="course-body">
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {CATEGORIES[product.category]?.icon} {CATEGORIES[product.category]?.name}
                    </span>
                  </div>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <div className="course-meta" style={{ marginTop: '12px' }}>
                    {product.priceDisplay ? (
                      <span style={{ fontWeight: '700', color: 'var(--success)', fontSize: '1.1rem' }}>
                        {product.priceDisplay}
                        {product.priceNote && (
                          <span style={{ fontWeight: '400', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {product.priceNote}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span style={{ fontWeight: '600', color: 'var(--primary)' }}>
                        {product.type === 'download' ? '📥 Acessar' : '🔗 Acessar'}
                      </span>
                    )}
                    <span className={`badge ${product.type === 'subscription' ? 'badge-premium' : 'badge-free'}`}>
                      {product.type === 'subscription' ? 'Assinatura' :
                       product.type === 'download' ? 'Grátis' :
                       product.type === 'external' ? 'Acesso' : 'Único'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
            Nenhum produto nesta categoria.
          </p>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Método Corpo Limpo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
