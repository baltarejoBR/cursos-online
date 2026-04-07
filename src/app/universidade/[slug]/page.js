import Link from 'next/link';
import Header from '@/components/Header';
import { getPostBySlug, getRelatedPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Artigo nao encontrado' };
  return {
    title: `${post.title} - Universidade Dioxi`,
    description: post.excerpt || post.title,
  };
}

export default async function ArtigoPage({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const related = await getRelatedPosts(params.slug, post.category, 3);
  const references = post.study_references || [];

  return (
    <>
      <Header />

      {/* Breadcrumb */}
      <section style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 20px',
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <nav style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--text-muted)' }}>Inicio</Link>
            {' > '}
            <Link href="/universidade" style={{ color: 'var(--text-muted)' }}>Universidade Dioxi</Link>
            {' > '}
            <span style={{ color: 'var(--text)' }}>{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Article */}
      <section style={{ padding: '60px 20px', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              marginBottom: '16px',
              background: 'rgba(26,107,170,0.1)',
              color: '#1a6baa',
            }}>
              {post.category}
            </span>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: '800',
              lineHeight: 1.2,
              marginBottom: '16px',
              color: 'var(--text)',
            }}>
              {post.title}
            </h1>
            <div style={{
              display: 'flex',
              gap: '16px',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              flexWrap: 'wrap',
            }}>
              {post.reading_time_minutes && <span>{post.reading_time_minutes} min de leitura</span>}
              {post.published_at && (
                <span>{new Date(post.published_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              )}
            </div>
          </div>

          {/* Content */}
          <article
            style={{
              background: 'var(--bg-card)',
              borderRadius: '20px',
              padding: '40px 32px',
              border: '1px solid var(--border-light)',
              lineHeight: 1.8,
              fontSize: '1.05rem',
              color: 'var(--text)',
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Study References */}
          {references.length > 0 && (
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid var(--border-light)',
              marginTop: '32px',
            }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--text)' }}>
                Referencias Cientificas
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {references.map((ref, i) => (
                  <li key={i} style={{
                    padding: '12px 16px',
                    background: 'var(--bg)',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                  }}>
                    <div style={{ fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
                      {ref.title}
                    </div>
                    {ref.journal && (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {ref.journal} {ref.year && `(${ref.year})`}
                      </div>
                    )}
                    {ref.url && (
                      <a href={ref.url} target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>
                        Ver estudo completo
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Articles */}
          {related.length > 0 && (
            <div style={{ marginTop: '48px' }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--text)', textAlign: 'center' }}>
                Artigos Relacionados
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '16px',
              }}>
                {related.map(r => (
                  <Link key={r.slug} href={`/universidade/${r.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'var(--bg-card)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid var(--border-light)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#1a6baa',
                        fontWeight: '600',
                      }}>
                        {r.category}
                      </span>
                      <h4 style={{
                        fontSize: '1rem',
                        color: 'var(--text)',
                        marginTop: '8px',
                        lineHeight: 1.3,
                      }}>
                        {r.title}
                      </h4>
                      {r.reading_time_minutes && (
                        <span style={{ color: '#999', fontSize: '0.8rem' }}>
                          {r.reading_time_minutes} min
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{
            textAlign: 'center',
            marginTop: '48px',
            padding: '40px',
            background: 'linear-gradient(135deg, #0d3b66, #1a6baa)',
            borderRadius: '20px',
            color: 'white',
          }}>
            <h3 style={{ marginBottom: '12px', fontSize: '1.3rem' }}>
              Quer aprender mais sobre Terapias Bio-oxidativas?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>
              Explore a Universidade Dioxi ou conhca nossos cursos completos.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/universidade" style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
                border: '1px solid rgba(255,255,255,0.3)',
              }}>
                Ver todos os artigos
              </Link>
              <Link href="/produto/curso-cds-completo" style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: 'white',
                color: '#1a6baa',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
              }}>
                Curso Completo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container" style={{ textAlign: 'center' }}>
          <p>&copy; 2026 Metodo Corpo Limpo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
