'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { PRODUCTS, CATEGORIES } from '@/lib/products';

const VISIBLE_CATEGORIES = ['cursos', 'livros', 'servicos'];

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
    if (catParam && (catParam === 'todos' || VISIBLE_CATEGORIES.includes(catParam))) {
      setActiveFilter(catParam);
    }
  }, [catParam]);

  const filtered = activeFilter === 'todos'
    ? PRODUCTS.filter(p => !p.hidden && VISIBLE_CATEGORIES.includes(p.category))
    : PRODUCTS.filter(p => p.category === activeFilter && !p.hidden);

  return (
    <>
      <Header />

      <section className="hero" style={{ paddingBottom: '40px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, color: 'white' }}>
            Cursos, Livros e Serviços
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '550px', margin: '0 auto' }}>
            Cursos, livros e consultoria personalizada sobre Terapias Bio-oxidativas — desenvolvidos com cuidado e baseados em mais de uma década de experiência prática.
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
              background: activeFilter === 'todos' ? 'linear-gradient(135deg, #c9a84c, #e6c873)' : 'var(--bg-card)',
              color: activeFilter === 'todos' ? '#1a1a1a' : 'var(--text-muted)',
              border: activeFilter === 'todos' ? '2px solid var(--gold)' : '2px solid var(--border)',
              fontWeight: activeFilter === 'todos' ? 600 : 500,
            }}
          >
            Todos
          </button>
          {VISIBLE_CATEGORIES.map(catKey => {
            const cat = CATEGORIES[catKey];
            const isActive = activeFilter === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setActiveFilter(catKey)}
                className="btn btn-sm"
                style={{
                  background: isActive ? 'linear-gradient(135deg, #c9a84c, #e6c873)' : 'var(--bg-card)',
                  color: isActive ? '#1a1a1a' : 'var(--text-muted)',
                  border: isActive ? '2px solid var(--gold)' : '2px solid var(--border)',
                  fontWeight: isActive ? 600 : 500,
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
                    product.type === 'whatsapp' ? (product.whatsappUrl || '#') :
                    `/produto/${product.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              {...(product.type === 'external' || product.type === 'whatsapp' ? { target: '_blank', rel: 'noopener' } : {})}
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
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {product.subtitle}
                  </p>
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
                        🔗 Acessar
                      </span>
                    )}
                    <span className={`badge ${product.type === 'subscription' ? 'badge-premium' : 'badge-free'}`}>
                      {product.type === 'subscription' ? 'Assinatura' :
                       product.type === 'whatsapp' ? 'Agendar' : 'Pagamento único'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0' }}>
            Nenhum produto nesta categoria ainda. Novos conteúdos em breve.
          </p>
        )}
      </main>
    </>
  );
}
