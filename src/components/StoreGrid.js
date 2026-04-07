'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function StoreGrid({ products }) {
  const [filter, setFilter] = useState('Todos');

  const filtered = filter === 'Todos'
    ? products
    : products.filter(p => p.category === filter);

  return (
    <>
      {/* Filter tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        marginBottom: '40px',
        flexWrap: 'wrap',
      }}>
        {['Todos', 'Combo', 'Product'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '8px 20px',
              borderRadius: '50px',
              border: filter === cat ? '2px solid #1a6baa' : '2px solid #c5d8e8',
              background: filter === cat ? '#1a6baa' : 'white',
              color: filter === cat ? 'white' : '#4a6a8a',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cat === 'Product' ? 'Produtos' : cat === 'Combo' ? 'Combos/Kits' : 'Todos'}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {filtered.map(product => (
          <div
            key={product.id}
            style={{
              background: 'white',
              borderRadius: '20px',
              border: product.is_featured ? '2px solid #2e8b57' : '1px solid #dde9f2',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: product.is_featured
                ? '0 8px 30px rgba(46,139,87,0.15)'
                : '0 2px 10px rgba(13,59,102,0.08)',
              position: 'relative',
            }}
          >
            {product.is_featured && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#2e8b57',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '700',
                zIndex: 1,
              }}>
                Destaque
              </div>
            )}

            {/* Product color header */}
            <div style={{
              height: '8px',
              background: product.category === 'Combo'
                ? 'linear-gradient(90deg, #1a6baa, #2e8b57)'
                : 'linear-gradient(90deg, #2e8b57, #4db87a)',
            }} />

            {product.image_url && (
              <div style={{
                position: 'relative',
                width: '100%',
                height: '200px',
                background: '#f5f8fb',
              }}>
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'contain', padding: '12px' }}
                  sizes="(max-width: 768px) 100vw, 280px"
                />
              </div>
            )}

            <div style={{ padding: '24px' }}>
              {/* Category badge */}
              <span style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                marginBottom: '12px',
                background: product.category === 'Combo'
                  ? 'rgba(26,107,170,0.1)' : 'rgba(46,139,87,0.1)',
                color: product.category === 'Combo' ? '#1a6baa' : '#2e8b57',
              }}>
                {product.category === 'Combo' ? 'Combo/Kit' : 'Produto'}
              </span>

              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '8px',
                color: '#0d2137',
                lineHeight: 1.3,
              }}>
                {product.name}
              </h3>

              <p style={{
                color: '#4a6a8a',
                fontSize: '0.85rem',
                marginBottom: '16px',
                lineHeight: 1.5,
              }}>
                {product.items_description}
              </p>

              {/* Price */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '1.4rem',
                  fontWeight: '800',
                  color: '#2e8b57',
                }}>
                  {product.price_display}
                </div>
                {product.installments && (
                  <div style={{ color: '#4a6a8a', fontSize: '0.85rem' }}>
                    ou {product.installments}
                  </div>
                )}
                {product.discount_percent > 0 && (
                  <span style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: 'rgba(212,160,23,0.15)',
                    color: '#b8860b',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}>
                    {product.discount_percent}% OFF
                  </span>
                )}
              </div>

              {/* Buy button */}
              <a
                href={product.external_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #2e8b57, #1a6baa)',
                  color: 'white',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                Comprar Agora
              </a>
            </div>
          </div>
        ))}
      </div>

      <p style={{
        textAlign: 'center',
        color: '#999',
        fontSize: '0.8rem',
        marginTop: '32px',
      }}>
        Produtos vendidos pela loja parceira CLO2BR. Links de afiliado.
      </p>
    </>
  );
}
