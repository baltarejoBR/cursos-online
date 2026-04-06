'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { createClient } from '@/lib/supabase-browser';
import { getProductBySlug, CATEGORIES } from '@/lib/products';
import { useState, useEffect } from 'react';

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const product = getProductBySlug(slug);

  const [user, setUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [contentError, setContentError] = useState(null);

  useEffect(() => {
    async function init() {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);

      if (u && product) {
        const { data } = await supabase
          .from('user_products')
          .select('id')
          .eq('user_id', u.id)
          .eq('product_id', product.id)
          .eq('active', true)
          .single();

        setHasAccess(!!data);
      }
    }
    init();
  }, []);

  async function handleCheckout() {
    if (!user) {
      router.push('/cadastro');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erro ao processar pagamento');
      }
    } catch {
      alert('Erro ao processar. Tente novamente.');
    }
    setLoading(false);
  }

  async function handleOpenContent() {
    setContentError(null);
    try {
      const res = await fetch(`/api/conteudo/${product.contentSlug}`);
      if (res.ok) {
        setShowContent(true);
      } else {
        const data = await res.json();
        setContentError(data.error || 'Erro ao acessar conteudo.');
      }
    } catch {
      setContentError('Erro de conexao. Tente novamente.');
    }
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h1>Produto nao encontrado</h1>
          <Link href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Voltar para Home
          </Link>
        </div>
      </>
    );
  }

  if (product.type === 'external') {
    if (typeof window !== 'undefined' && product.externalUrl && product.externalUrl !== '#') {
      window.location.href = product.externalUrl;
    }
    return (
      <>
        <Header />
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h1>{product.title}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>Redirecionando para a loja...</p>
          <Link href="/" className="btn btn-outline" style={{ marginTop: '20px' }}>
            Voltar para Home
          </Link>
        </div>
      </>
    );
  }

  const category = CATEGORIES[product.category];

  return (
    <>
      <Header />

      <div className="container" style={{ padding: '48px 20px 80px' }}>
        <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          &larr; Voltar
        </Link>

        <div className="product-grid" style={{ marginTop: '32px' }}>
          {/* Lado esquerdo - Info */}
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {category?.icon} {category?.name}
              </span>
              {product.badge && (
                <span style={{
                  background: product.badgeColor || 'var(--primary)',
                  color: 'white',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                }}>
                  {product.badge}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '2.25rem', marginBottom: '8px' }}>{product.title}</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              {product.subtitle}
            </p>

            <div style={{
              background: product.gradient,
              borderRadius: '16px',
              height: '220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
              marginBottom: '32px',
            }}>
              {product.category === 'cursos' ? '🎓' :
               product.category === 'livros' ? '📚' :
               product.category === 'servicos' ? '💼' : '🛒'}
            </div>

            <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
              {product.description}
            </p>
          </div>

          {/* Lado direito - Compra ou Acesso */}
          <div>
            <div style={{
              background: 'var(--bg-card)',
              border: `1px solid ${hasAccess ? 'var(--success)' : 'var(--border)'}`,
              borderRadius: '16px',
              padding: '32px',
              position: 'sticky',
              top: '100px',
            }}>
              {/* Usuario tem acesso */}
              {hasAccess ? (
                <>
                  <div style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid var(--success)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    marginBottom: '24px',
                  }}>
                    <p style={{ color: 'var(--success)', fontWeight: '700', fontSize: '1.1rem' }}>
                      ✓ Voce tem acesso a este produto
                    </p>
                  </div>

                  {/* Botao para abrir conteudo HTML */}
                  {product.contentSlug && (
                    <button
                      onClick={handleOpenContent}
                      className="btn btn-primary btn-full"
                      style={{ fontSize: '1.05rem', padding: '14px 24px', marginBottom: '12px' }}
                    >
                      {showContent ? '📖 Conteudo aberto abaixo' : '📖 Ler Versao Online (HTML)'}
                    </button>
                  )}

                  {/* Botao de download do PDF */}
                  {product.downloadId ? (
                    <a
                      href={`/api/download/${product.downloadId}`}
                      className="btn btn-outline btn-full"
                      style={{ fontSize: '0.95rem', padding: '12px 24px', marginBottom: '16px', textDecoration: 'none' }}
                    >
                      📥 Baixar PDF
                    </a>
                  ) : (
                    <button
                      className="btn btn-outline btn-full"
                      disabled
                      style={{ fontSize: '0.95rem', padding: '12px 24px', marginBottom: '16px', opacity: 0.5 }}
                    >
                      📥 Baixar PDF (em breve)
                    </button>
                  )}

                  {contentError && (
                    <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '0.9rem', marginTop: '8px' }}>
                      {contentError}
                    </p>
                  )}
                </>
              ) : (
                <>
                  {/* Usuario nao tem acesso - mostrar preco e botao comprar */}
                  <div style={{ marginBottom: '24px' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: '700' }}>
                      {product.priceDisplay}
                    </span>
                    {product.priceNote && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '1rem', marginLeft: '4px' }}>
                        {product.priceNote}
                      </span>
                    )}
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <span className={`badge ${product.type === 'subscription' ? 'badge-premium' : 'badge-free'}`}>
                      {product.type === 'subscription' ? 'Assinatura Mensal' : 'Pagamento Unico'}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="btn btn-primary btn-full"
                    disabled={loading}
                    style={{ fontSize: '1.05rem', padding: '14px 24px', marginBottom: '16px' }}
                  >
                    {loading ? 'Processando...' :
                     product.paymentMethod === 'pix' ? 'Pagar via Pix' :
                     product.type === 'subscription' ? 'Assinar Agora' : 'Comprar Agora'}
                  </button>

                  {product.paymentMethod === 'pix' && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>
                      Apos o pagamento, voce sera redirecionado para agendar no Calendly
                    </p>
                  )}

                  {!user && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Voce precisa estar logado para comprar.{' '}
                      <Link href="/login">Entrar</Link> ou{' '}
                      <Link href="/cadastro">Cadastrar</Link>
                    </p>
                  )}
                </>
              )}

              <div style={{ marginTop: '32px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>O que esta incluso:</h3>
                <ul style={{ listStyle: 'none' }}>
                  {product.features?.map((feature, i) => (
                    <li key={i} style={{
                      padding: '8px 0',
                      color: 'var(--text-muted)',
                      fontSize: '0.95rem',
                      borderBottom: i < product.features.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {!hasAccess && (
                <div style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: 'rgba(90, 138, 60, 0.1)',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}>
                  <p style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: '600' }}>
                    {product.paymentMethod === 'pix' ? 'Pagamento seguro via Pix' : 'Pagamento seguro via Stripe'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Iframe com conteudo HTML */}
        {showContent && product.contentSlug && (
          <div style={{
            marginTop: '40px',
            border: '2px solid var(--primary)',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'white',
          }}>
            <div style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontWeight: 600 }}>📖 {product.title}</span>
              <button
                onClick={() => setShowContent(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                Fechar
              </button>
            </div>
            <iframe
              src={`/api/conteudo/${product.contentSlug}`}
              style={{ width: '100%', height: '80vh', border: 'none' }}
              title={product.title}
            />
          </div>
        )}
      </div>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Metodo Corpo Limpo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
