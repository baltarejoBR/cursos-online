import Link from 'next/link';
import Header from '@/components/Header';
import { PRODUCTS, CATEGORIES } from '@/lib/products';

export default function Home() {
  const categoryOrder = ['cursos', 'livros', 'servicos', 'loja'];

  return (
    <>
      <Header />

      <section className="hero">
        <div className="container">
          <h1>Metodo Corpo Limpo</h1>
          <p>
            Cursos, livros, consultoria e produtos sobre CDS e saude natural.
            Tudo que voce precisa em um so lugar.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="#cursos" className="btn btn-primary">
              Ver Cursos
            </Link>
            <Link href="#livros" className="btn btn-outline">
              Ver Livros
            </Link>
            <Link href="/planos" className="btn btn-outline">
              Todos os Produtos
            </Link>
          </div>
        </div>
      </section>

      <main className="container" id="produtos">
        {categoryOrder.map(catKey => {
          const category = CATEGORIES[catKey];
          const products = PRODUCTS.filter(p => p.category === catKey);
          if (products.length === 0) return null;

          return (
            <section key={catKey} id={catKey}>
              <h2 className="section-title">
                {category.icon} {category.name}
              </h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '-24px', marginBottom: '32px' }}>
                {category.description}
              </p>
              <div className="courses-grid">
                {products.map(product => (
                  <Link
                    key={product.id}
                    href={product.type === 'external' ? (product.externalUrl || '#') : `/produto/${product.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    {...(product.type === 'external' ? { target: '_blank', rel: 'noopener' } : {})}
                  >
                    <div className="course-card">
                      <div className="course-thumb" style={{ background: product.gradient, position: 'relative' }}>
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
                          }}>
                            {product.badge}
                          </span>
                        )}
                        <span style={{ fontSize: '2.5rem' }}>
                          {catKey === 'cursos' ? '🎓' : catKey === 'livros' ? '📚' : catKey === 'servicos' ? '💼' : '🛒'}
                        </span>
                      </div>
                      <div className="course-body">
                        <h3>{product.title}</h3>
                        <p>{product.subtitle}</p>
                        <div className="course-meta">
                          {product.priceDisplay ? (
                            <span style={{ fontWeight: '700', color: 'var(--success)' }}>
                              {product.priceDisplay}
                              {product.priceNote && (
                                <span style={{ fontWeight: '400', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                  {product.priceNote}
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="badge badge-free">Ver Loja</span>
                          )}
                          <span className={`badge ${product.type === 'subscription' ? 'badge-premium' : 'badge-free'}`}>
                            {product.type === 'subscription' ? 'Assinatura' :
                             product.type === 'external' ? 'Loja Externa' : 'Compra Unica'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, var(--bg) 100%)',
        padding: '80px 20px',
        textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>
            Comece sua Jornada Hoje
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 32px', fontSize: '1.1rem' }}>
            Escolha o produto ideal para voce e comece a aprender sobre CDS e saude natural agora mesmo.
          </p>
          <Link href="/planos" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '14px 32px' }}>
            Ver Todos os Produtos
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Metodo Corpo Limpo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
