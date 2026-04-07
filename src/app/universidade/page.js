import Link from 'next/link';
import Header from '@/components/Header';
import { getPublishedPosts } from '@/lib/blog';

export const metadata = {
  title: 'Universidade Dioxi - Estudos e Artigos - Método Corpo Limpo',
  description: 'Acesse estudos científicos, protocolos e artigos educativos sobre Dióxido de Cloro (CDS/SDC/Dioxi) e Terapias Bio-oxidativas.',
};

const CATEGORIES = [
  { value: null, label: 'Todos' },
  { value: 'estudos', label: 'Estudos Científicos' },
  { value: 'protocolos', label: 'Protocolos' },
  { value: 'iniciantes', label: 'Para Iniciantes' },
  { value: 'ciencia', label: 'Ciência' },
];

export default async function UniversidadePage({ searchParams }) {
  const cat = searchParams?.cat || null;
  const posts = await getPublishedPosts(50, cat);

  return (
    <>
      <Header />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0d3b66 0%, var(--cds-intense) 60%, var(--cds) 100%)',
        padding: '80px 20px 60px',
        textAlign: 'center',
        color: 'white',
      }}>
        <div className="container">
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎓</div>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '16px',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 400,
          }}>
            Universidade Dioxi
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Estudos científicos, protocolos e artigos educativos sobre Dióxido de Cloro
            e Terapias Bio-oxidativas. Conhecimento acessível para todos.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 20px',
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          {CATEGORIES.map(c => {
            const isActive = cat === c.value || (!cat && !c.value);
            const href = c.value ? `/universidade?cat=${c.value}` : '/universidade';
            return (
              <Link
                key={c.label}
                href={href}
                style={{
                  padding: '8px 20px',
                  borderRadius: '50px',
                  border: isActive ? '2px solid var(--cds)' : '2px solid var(--border)',
                  background: isActive ? 'var(--cds)' : 'white',
                  color: isActive ? 'var(--cds-dark)' : 'var(--text-muted)',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                {c.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Posts Grid */}
      <section style={{ padding: '60px 20px', background: 'var(--bg)' }}>
        <div className="container">
          {posts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: 'var(--text-muted)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text)' }}>
                Em breve!
              </h2>
              <p style={{ maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
                Estamos preparando artigos e estudos científicos sobre Dióxido de Cloro e Terapias Bio-oxidativas.
                Volte em breve para conferir!
              </p>
              <Link href="/" className="btn btn-gold" style={{ marginTop: '24px', display: 'inline-block' }}>
                Voltar para o Início
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
              maxWidth: '1200px',
              margin: '0 auto',
            }}>
              {posts.map(post => (
                <Link
                  key={post.id}
                  href={`/universidade/${post.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <article style={{
                    background: 'white',
                    borderRadius: '20px',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    {/* Color header */}
                    <div style={{
                      height: '6px',
                      background: 'linear-gradient(90deg, var(--cds), var(--success))',
                    }} />

                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Category badge */}
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        marginBottom: '12px',
                        background: 'rgba(201, 168, 76, 0.15)',
                        color: 'var(--cds-dark)',
                        alignSelf: 'flex-start',
                      }}>
                        {post.category}
                      </span>

                      <h3 style={{
                        fontSize: '1.15rem',
                        fontWeight: '700',
                        marginBottom: '8px',
                        color: 'var(--marine)',
                        lineHeight: 1.3,
                      }}>
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.9rem',
                          lineHeight: 1.6,
                          marginBottom: '16px',
                          flex: 1,
                        }}>
                          {post.excerpt}
                        </p>
                      )}

                      {/* Meta */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: '#999',
                        fontSize: '0.8rem',
                        marginTop: 'auto',
                      }}>
                        {post.reading_time_minutes && (
                          <span>{post.reading_time_minutes} min de leitura</span>
                        )}
                        {post.published_at && (
                          <span>{new Date(post.published_at).toLocaleDateString('pt-BR')}</span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
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
