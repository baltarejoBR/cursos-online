'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { PRODUCTS, CATEGORIES } from '@/lib/products';

const categoryOrder = ['cursos', 'livros', 'servicos', 'comunidade', 'loja', 'gratuitos'];

export default function PlanosPage() {
  const [activeFilter, setActiveFilter] = useState('todos');

  const filtered = activeFilter === 'todos'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeFilter);

  return (
    <>
      <Header />

      <section className="hero" style={{ paddingBottom: '40px' }}>
        <div className="container">
          <h1>Nossos Produtos</h1>
          <p>
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
            className={`btn ${activeFilter === 'todos' ? 'btn-primary' : 'btn-outline'} btn-sm`}
          >
            Todos
          </button>
          {categoryOrder.map(catKey => {
            const cat = CATEGORIES[catKey];
            return (
              <button
                key={catKey}
                onClick={() => setActiveFilter(catKey)}
                className={`btn ${activeFilter === catKey ? 'btn-primary' : 'btn-outline'} btn-sm`}
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
              href={product.type === 'external' ? (product.externalUrl || '#') : `/produto/${product.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              {...(product.type === 'external' ? { target: '_blank', rel: 'noopener' } : {})}
            >
              <div className="course-card">
                <div className="course-thumb" style={{ background: product.gradient, position: 'relative', overflow: 'hidden' }}>
                  {product.badge && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: product.badgeColor || 'var(--primary)',
                      color: 'white',
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
                      style={{ objectFit: 'cover' }}
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
                      <span style={{ fontWeight: '600', color: 'var(--primary)' }}>Ver Loja</span>
                    )}
                    <span className={`badge ${product.type === 'subscription' ? 'badge-premium' : 'badge-free'}`}>
                      {product.type === 'subscription' ? 'Assinatura' :
                       product.type === 'external' ? 'Acesso' : 'Unico'}
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
          <p>&copy; 2026 Metodo Corpo Limpo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
