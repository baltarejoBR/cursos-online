import Link from 'next/link';
import Header from '@/components/Header';
import { getPublishedPosts } from '@/lib/blog';
import { createServerSupabase } from '@/lib/supabase-server';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS, SUB_LABELS } from '@/lib/blog-constants';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog - Método Corpo Limpo',
  description: 'Histórias, reflexões e conteúdo educativo sobre Dióxido de Cloro, saúde integrativa e o movimento pela autonomia sanitária no Brasil.',
};

export default async function BlogPage({ searchParams }) {
  const cat = searchParams?.cat || null;
  const sub = searchParams?.sub || null;

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  let userPlan = 'free';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();
    userPlan = profile?.plan || 'free';
  }

  const isPremium = userPlan === 'premium';
  const posts = await getPublishedPosts({
    category: cat,
    subcategory: sub,
    sortBy: 'date',
  });

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
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '16px',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 400,
          }}>
            Blog
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Histórias, reflexões e conteúdo educativo sobre Dióxido de Cloro,
            saúde integrativa e o movimento pela autonomia sanitária no Brasil.
          </p>
        </div>
      </section>

      {/* Category Navigation (simplificado — sem dropdowns) */}
      <section style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 20px',
        position: 'sticky',
        top: '60px',
        zIndex: 40,
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          flexWrap: 'wrap',
        }}>
          {CATEGORIES.map(c => {
            const isActive = cat === c.value || (!cat && !c.value);
            const href = c.value ? `/blog?cat=${c.value}` : '/blog';
            const activeColor = c.value && CATEGORY_COLORS[c.value];

            return (
              <Link
                key={c.label}
                href={href}
                style={{
                  padding: '8px 18px',
                  borderRadius: '50px',
                  border: isActive
                    ? `2px solid ${activeColor?.hex || 'var(--cds)'}`
                    : '2px solid var(--border)',
                  background: isActive
                    ? (activeColor?.bg || 'var(--cds)')
                    : 'white',
                  color: isActive
                    ? (activeColor?.color || 'var(--cds-dark)')
                    : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{c.icon}</span> {c.label}
              </Link>
            );
          })}
        </div>

        {/* Active filter breadcrumb */}
        {(cat || sub) && (
          <div style={{
            maxWidth: '900px',
            margin: '10px auto 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}>
            <span>Filtrando:</span>
            {cat && (
              <span style={{
                background: CATEGORY_COLORS[cat]?.bg || 'rgba(201,168,76,0.15)',
                color: CATEGORY_COLORS[cat]?.color || 'var(--cds-dark)',
                padding: '2px 10px',
                borderRadius: '20px',
                fontWeight: '600',
              }}>
                {CATEGORY_LABELS[cat] || cat}
              </span>
            )}
            {sub && (
              <>
                <span>{'>'}</span>
                <span style={{
                  background: CATEGORY_COLORS[cat]?.bg || 'rgba(201,168,76,0.25)',
                  color: CATEGORY_COLORS[cat]?.color || 'var(--cds-dark)',
                  padding: '2px 10px',
                  borderRadius: '20px',
                  fontWeight: '600',
                  opacity: 0.85,
                }}>
                  {SUB_LABELS[sub] || sub}
                </span>
              </>
            )}
            <Link href="/blog" style={{
              color: 'var(--error)',
              fontWeight: '600',
              textDecoration: 'none',
              marginLeft: '4px',
            }}>
              ✕ Limpar
            </Link>
          </div>
        )}
      </section>

      {/* Posts Grid */}
      <section style={{ padding: '48px 20px 60px', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{
            textAlign: 'center',
            marginBottom: '32px',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
          }}>
            {posts.length} {posts.length === 1 ? 'artigo' : 'artigos'}
          </div>

          {posts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: 'var(--text-muted)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text)' }}>
                Nenhum artigo nesta categoria ainda
              </h2>
              <p style={{ maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
                Estamos preparando conteúdo para esta seção. Volte em breve!
              </p>
              <Link href="/blog" className="btn btn-gold" style={{ marginTop: '24px', display: 'inline-block' }}>
                Ver todos os artigos
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
              maxWidth: '1200px',
              margin: '0 auto',
            }}>
              {posts.map(post => {
                const isLocked = post.is_premium && !isPremium;
                const catColor = CATEGORY_COLORS[post.category];

                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <article style={{
                      background: 'white',
                      borderRadius: '20px',
                      border: isLocked ? '1px solid rgba(0,0,0,0.1)' : '1px solid var(--border)',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      boxShadow: isLocked ? '0 2px 10px rgba(0,0,0,0.12)' : '0 2px 10px rgba(0,0,0,0.06)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      opacity: isLocked ? 0.75 : 1,
                    }}>
                      <div style={{
                        height: '6px',
                        background: isLocked
                          ? 'linear-gradient(90deg, #555, #888)'
                          : (catColor?.hex || 'linear-gradient(90deg, var(--cds), var(--success))'),
                      }} />

                      {isLocked && (
                        <div style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          boxShadow: '0 2px 8px rgba(201,168,76,0.4)',
                          zIndex: 2,
                        }}>
                          🔒
                        </div>
                      )}

                      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            background: catColor?.bg || 'rgba(201, 168, 76, 0.15)',
                            color: catColor?.color || 'var(--cds-dark)',
                          }}>
                            {CATEGORY_LABELS[post.category] || post.category}
                          </span>
                          {post.subcategory && (
                            <span style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: '20px',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              background: 'rgba(13, 59, 102, 0.1)',
                              color: 'var(--marine)',
                            }}>
                              {SUB_LABELS[post.subcategory] || post.subcategory}
                            </span>
                          )}
                          {isLocked && (
                            <span style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: '20px',
                              fontSize: '0.7rem',
                              fontWeight: '700',
                              background: 'rgba(0,0,0,0.08)',
                              color: '#666',
                            }}>
                              Premium
                            </span>
                          )}
                        </div>

                        <h3 style={{
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          marginBottom: '8px',
                          color: isLocked ? '#555' : 'var(--marine)',
                          lineHeight: 1.3,
                        }}>
                          {post.title}
                        </h3>

                        {post.excerpt && (
                          <p style={{
                            color: isLocked ? '#888' : 'var(--text-muted)',
                            fontSize: '0.85rem',
                            lineHeight: 1.6,
                            marginBottom: '16px',
                            flex: 1,
                          }}>
                            {post.excerpt.length > 120 ? post.excerpt.substring(0, 120) + '...' : post.excerpt}
                          </p>
                        )}

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          color: '#999',
                          fontSize: '0.78rem',
                          marginTop: 'auto',
                          paddingTop: '12px',
                          borderTop: '1px solid var(--border)',
                        }}>
                          {post.reading_time_minutes && (
                            <span>{post.reading_time_minutes} min de leitura</span>
                          )}
                          {isLocked ? (
                            <span style={{
                              color: 'var(--gold-dark)',
                              fontWeight: '600',
                            }}>
                              Desbloquear →
                            </span>
                          ) : (
                            post.published_at && (
                              <span>{new Date(post.published_at).toLocaleDateString('pt-BR')}</span>
                            )
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
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
