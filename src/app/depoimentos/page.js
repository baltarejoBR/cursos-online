'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import { CATEGORIAS_DEPOIMENTOS, getDepoimentosByCategory } from '@/lib/depoimentos';

const ITEMS_PER_PAGE = 24;

export default function DepoimentosPage() {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [lightbox, setLightbox] = useState(null);

  const images = getDepoimentosByCategory(activeFilter);
  const visibleImages = images.slice(0, visibleCount);
  const hasMore = visibleCount < images.length;

  function handleFilterChange(cat) {
    setActiveFilter(cat);
    setVisibleCount(ITEMS_PER_PAGE);
  }

  return (
    <>
      <Header />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #f0f6fa 0%, #d6e8f4 30%, #c2dde8 70%, #daf0e0 100%)',
        padding: '60px 20px 40px',
        textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #0d3b66, #1a6baa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 300,
          }}>
            Depoimentos
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            +300 pessoas ja transformaram sua saude com o Metodo Corpo Limpo.
            Veja os resultados reais dos nossos alunos.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 20px',
        position: 'sticky',
        top: '73px',
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}>
          {Object.entries(CATEGORIAS_DEPOIMENTOS).map(([key, cat]) => {
            const count = key === 'todos'
              ? Object.values(getDepoimentosByCategory('todos')).length
              : getDepoimentosByCategory(key).length;
            return (
              <button
                key={key}
                onClick={() => handleFilterChange(key)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '50px',
                  border: activeFilter === key ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: activeFilter === key ? 'rgba(26, 107, 170, 0.1)' : 'var(--bg)',
                  color: activeFilter === key ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: activeFilter === key ? 600 : 400,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                {cat.icon} {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid de imagens */}
      <main className="container" style={{ padding: '40px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '16px',
        }}>
          {visibleImages.map((src, i) => (
            <div
              key={src}
              onClick={() => setLightbox(src)}
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                aspectRatio: '1',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px var(--shadow-hover)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Depoimento ${i + 1}`}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          ))}
        </div>

        {/* Carregar mais */}
        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
              className="btn btn-outline"
              style={{ fontSize: '1rem', padding: '12px 32px' }}
            >
              Carregar mais ({images.length - visibleCount} restantes)
            </button>
          </div>
        )}

        {visibleImages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: 'var(--text-muted)' }}>Nenhum depoimento nesta categoria ainda.</p>
          </div>
        )}
      </main>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            cursor: 'pointer',
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '2rem',
              cursor: 'pointer',
              zIndex: 1001,
            }}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Depoimento"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '8px',
              cursor: 'default',
            }}
          />
        </div>
      )}

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Metodo Corpo Limpo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
