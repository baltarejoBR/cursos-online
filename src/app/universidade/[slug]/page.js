import Link from 'next/link';
import Header from '@/components/Header';
import { getPostBySlug, getRelatedPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Artigo não encontrado' };
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
  const rawRefs = post.study_references || [];
  const references = typeof rawRefs === 'string' ? JSON.parse(rawRefs) : (Array.isArray(rawRefs) ? rawRefs : []);

  return (
    <>
      <Header />

      {/* Hero do Artigo */}
      <section style={{
        background: 'var(--hero-gradient)',
        padding: '48px 20px 40px',
        color: 'white',
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <nav style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.5)' }}>Início</Link>
            {' / '}
            <Link href="/universidade" style={{ color: 'rgba(255,255,255,0.5)' }}>Universidade Dioxi</Link>
            {' / '}
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{post.title}</span>
          </nav>

          <span style={{
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            marginBottom: '16px',
            background: 'rgba(201, 168, 76, 0.2)',
            color: 'var(--gold-bright)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
          }}>
            {post.category}
          </span>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: '800',
            lineHeight: 1.2,
            marginBottom: '16px',
            color: 'white',
            fontFamily: "'Playfair Display', Georgia, serif",
          }}>
            {post.title}
          </h1>

          <div style={{
            display: 'flex',
            gap: '20px',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.9rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            {post.reading_time_minutes && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--gold)' }}>◷</span>
                {post.reading_time_minutes} min de leitura
              </span>
            )}
            {post.published_at && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--gold)' }}>◆</span>
                {new Date(post.published_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Conteúdo do Artigo */}
      <section style={{ padding: '48px 20px 60px', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>

          {/* Artigo principal */}
          <article
            className="article-content"
            style={{
              background: 'var(--bg-card)',
              borderRadius: '20px',
              padding: '48px 40px',
              border: '1px solid var(--border-light)',
              borderTop: '3px solid var(--gold)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Referências Científicas */}
          {references.length > 0 && (
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '20px',
              padding: '32px 40px',
              border: '1px solid var(--border-light)',
              marginTop: '32px',
            }}>
              <h3 style={{
                marginBottom: '20px',
                color: 'var(--marble-dark)',
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span style={{ color: 'var(--gold)' }}>📑</span>
                Referências Científicas
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {references.map((ref, i) => (
                  <li key={i} style={{
                    padding: '16px 20px',
                    background: 'var(--bg)',
                    borderRadius: '12px',
                    borderLeft: '3px solid var(--gold)',
                    fontSize: '0.9rem',
                  }}>
                    <div style={{ fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
                      {ref.title}
                    </div>
                    {ref.journal && (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                        {ref.journal} {ref.year && `(${ref.year})`}
                      </div>
                    )}
                    {ref.url && (
                      <a href={ref.url} target="_blank" rel="noopener noreferrer"
                        style={{ color: 'var(--gold-dark)', fontSize: '0.85rem', fontWeight: '600', marginTop: '4px', display: 'inline-block' }}>
                        Ver estudo completo →
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Artigos Relacionados */}
          {related.length > 0 && (
            <div style={{ marginTop: '48px' }}>
              <h3 style={{
                marginBottom: '24px',
                color: 'var(--marble-dark)',
                textAlign: 'center',
                fontSize: '1.4rem',
              }}>
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
                      padding: '24px',
                      border: '1px solid var(--border-light)',
                      transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                      height: '100%',
                    }}
                    onMouseEnter={undefined}
                    >
                      <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--gold-dark)',
                        fontWeight: '600',
                        background: 'rgba(201, 168, 76, 0.1)',
                        padding: '3px 10px',
                        borderRadius: '20px',
                      }}>
                        {r.category}
                      </span>
                      <h4 style={{
                        fontSize: '1rem',
                        color: 'var(--text)',
                        marginTop: '12px',
                        lineHeight: 1.3,
                        fontWeight: '600',
                      }}>
                        {r.title}
                      </h4>
                      {r.reading_time_minutes && (
                        <span style={{ color: 'var(--text-light)', fontSize: '0.8rem', marginTop: '8px', display: 'block' }}>
                          {r.reading_time_minutes} min de leitura
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
            padding: '48px 40px',
            background: 'var(--hero-gradient)',
            borderRadius: '20px',
            color: 'white',
          }}>
            <h3 style={{ marginBottom: '12px', fontSize: '1.4rem', fontFamily: "'Playfair Display', Georgia, serif" }}>
              Quer aprender mais sobre Terapias Bio-oxidativas?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
              Explore a Universidade Dioxi ou conheça nossos cursos completos.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/universidade" className="btn-dark-gold" style={{
                padding: '12px 28px',
              }}>
                Ver todos os artigos
              </Link>
              <Link href="/produto/curso-cds-completo" className="btn btn-gold" style={{
                padding: '12px 28px',
              }}>
                Curso Completo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container" style={{ textAlign: 'center' }}>
          <p>&copy; 2026 Método Corpo Limpo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
