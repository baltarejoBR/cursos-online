'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import { CATEGORIAS_DEPOIMENTOS, DEPOIMENTOS, getDepoimentosByCategory } from '@/lib/depoimentos';

const ITEMS_PER_PAGE = 12;

function ImageGrid({ images, onImageClick }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '16px',
    }}>
      {images.map((src, i) => (
        <div
          key={src}
          onClick={() => onImageClick(src)}
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
            e.currentTarget.style.borderColor = '#c9a84c';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Depoimento ${i + 1}`}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  );
}

function CategorySection({ catKey, cat, images, onImageClick }) {
  const [expanded, setExpanded] = useState(false);
  const preview = expanded ? images : images.slice(0, 6);
  const hasMore = images.length > 6;

  return (
    <section style={{ marginBottom: '48px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        paddingBottom: '12px',
        borderBottom: '2px solid var(--cds-pale)',
      }}>
        <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600 }}>{cat.name}</h2>
        <span style={{
          background: 'rgba(201, 168, 76, 0.15)',
          color: 'var(--cds-dark)',
          padding: '2px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 600,
        }}>
          {images.length}
        </span>
      </div>
      <ImageGrid images={preview} onImageClick={onImageClick} />
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.9rem' }}
          >
            {expanded ? 'Mostrar menos' : `Ver todos (${images.length})`}
          </button>
        </div>
      )}
    </section>
  );
}

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
        background: 'var(--hero-gradient)',
        color: 'white',
        padding: '80px 20px 40px',
        textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '12px',
            fontFamily: "'Playfair Display', Georgia, serif",
            color: 'white',
            fontWeight: 400,
          }}>
            Depoimentos
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', maxWidth: '600px', margin: '0 auto' }}>
            +300 pessoas ja transformaram sua saude com o Metodo Corpo Limpo.
            Veja os resultados reais dos nossos alunos.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section style={{
        background: 'var(--hero-gradient)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
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
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => handleFilterChange(key)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '50px',
                  border: isActive ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  background: isActive ? 'linear-gradient(135deg, #c9a84c, #e6c873)' : 'rgba(255,255,255,0.1)',
                  color: isActive ? '#1a1a1a' : 'rgba(255,255,255,0.7)',
                  fontWeight: isActive ? 600 : 400,
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
        {activeFilter === 'todos' ? (
          // Vista por seções separadas
          Object.entries(DEPOIMENTOS).map(([catKey, catImages]) => {
            const cat = CATEGORIAS_DEPOIMENTOS[catKey];
            if (!cat || catImages.length === 0) return null;
            return (
              <CategorySection
                key={catKey}
                catKey={catKey}
                cat={cat}
                images={catImages}
                onImageClick={setLightbox}
              />
            );
          })
        ) : (
          // Vista filtrada por categoria
          <ImageGrid images={visibleImages} onImageClick={setLightbox} />
        )}

        {/* Carregar mais (só na vista filtrada) */}
        {activeFilter !== 'todos' && hasMore && (
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
              border: '3px solid #c9a84c',
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
