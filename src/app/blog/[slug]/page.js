import Link from 'next/link';
import Header from '@/components/Header';
import CommentSection from '@/components/CommentSection';
import MuxVideoPlayer from '@/components/MuxVideoPlayer';
import { getPostForUser, getRelatedPosts } from '@/lib/blog';
import { createServerSupabase } from '@/lib/supabase-server';
import { CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_COLORS_HERO } from '@/lib/blog-constants';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { getPostBySlug } = await import('@/lib/blog');
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Artigo não encontrado' };
  return {
    title: `${post.title} - Blog - Método Corpo Limpo`,
    description: post.excerpt || post.title,
  };
}

export default async function BlogPostPage({ params }) {
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

  const post = await getPostForUser(params.slug, userPlan);

  if (!post) {
    notFound();
  }

  if (post.post_type === 'universidade') {
    redirect(`/universidade/${params.slug}`);
  }

  if (post.requires_auth && !user) {
    redirect('/cadastro?reason=auth_required');
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
            <Link href="/blog" style={{ color: 'rgba(255,255,255,0.5)' }}>Blog</Link>
            {' / '}
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{post.title}</span>
          </nav>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              background: CATEGORY_COLORS_HERO[post.category]?.bg || 'rgba(201, 168, 76, 0.2)',
              color: CATEGORY_COLORS_HERO[post.category]?.color || 'var(--gold-bright)',
            }}>
              {CATEGORY_LABELS[post.category] || post.category}
            </span>
            {post.isLocked && (
              <span style={{
                display: 'inline-block',
                padding: '4px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '700',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
              }}>
                🔒 Premium
              </span>
            )}
          </div>

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

          {post.isLocked ? (
            <>
              <div style={{
                position: 'relative',
                maxHeight: '400px',
                overflow: 'hidden',
              }}>
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
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '250px',
                  background: 'linear-gradient(transparent 0%, var(--bg) 85%)',
                  pointerEvents: 'none',
                }} />
              </div>

              <div style={{
                marginTop: '-20px',
                position: 'relative',
                zIndex: 2,
                background: 'linear-gradient(135deg, #0d3b66 0%, #1a4a7a 50%, #0d3b66 100%)',
                borderRadius: '20px',
                padding: '48px 40px',
                textAlign: 'center',
                color: 'white',
                border: '2px solid rgba(201,168,76,0.3)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  margin: '0 auto 20px',
                  boxShadow: '0 4px 20px rgba(201,168,76,0.4)',
                }}>
                  🔒
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '12px',
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}>
                  Conteúdo Exclusivo para Assinantes
                </h3>
                <p style={{
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.7,
                  maxWidth: '450px',
                  margin: '0 auto 28px',
                }}>
                  Desbloqueie este e todos os outros artigos premium,
                  incluindo protocolos e estudos científicos completos.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/planos" className="btn-dark-gold" style={{
                    padding: '14px 32px',
                    fontSize: '1rem',
                  }}>
                    {user ? 'Fazer Upgrade' : 'Assinar Agora'}
                  </Link>
                  {!user && (
                    <Link href="/login" style={{
                      padding: '14px 32px',
                      color: 'white',
                      textDecoration: 'none',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '50px',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s',
                    }}>
                      Já sou assinante
                    </Link>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {post.video_url && (
                post.requires_auth && !user ? (
                  <div style={{
                    marginBottom: '32px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '2px solid rgba(201,168,76,0.3)',
                    background: 'linear-gradient(135deg, #0d3b66 0%, #1a4a7a 50%, #0d3b66 100%)',
                    color: 'white',
                    aspectRatio: '16/9',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '32px 24px',
                    textAlign: 'center',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      marginBottom: '20px',
                      boxShadow: '0 4px 20px rgba(201,168,76,0.4)',
                    }}>
                      ▶
                    </div>
                    <h3 style={{
                      fontSize: '1.4rem',
                      marginBottom: '10px',
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}>
                      Cadastre-se grátis para assistir
                    </h3>
                    <p style={{
                      color: 'rgba(255,255,255,0.75)',
                      lineHeight: 1.6,
                      maxWidth: '480px',
                      marginBottom: '24px',
                      fontSize: '0.95rem',
                    }}>
                      Este vídeo é liberado para quem tem uma conta no Método Corpo Limpo. O cadastro leva menos de 1 minuto e é gratuito.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <Link
                        href="/cadastro"
                        className="btn-dark-gold"
                        style={{ padding: '12px 28px', fontSize: '1rem' }}
                      >
                        Criar conta grátis
                      </Link>
                      <Link
                        href="/login"
                        style={{
                          padding: '12px 28px',
                          color: 'white',
                          textDecoration: 'none',
                          border: '1px solid rgba(255,255,255,0.3)',
                          borderRadius: '50px',
                          fontSize: '0.95rem',
                        }}
                      >
                        Já tenho conta
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    marginBottom: '32px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-light)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}>
                    <MuxVideoPlayer
                      playbackId={post.video_url}
                      blogPostId={post.id}
                      title={post.title}
                    />
                  </div>
                )
              )}

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
                    Referências
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
                            Ver referência completa →
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {!post.isLocked && (
            <CommentSection
              postId={post.id}
              user={user ? { id: user.id, email: user.email, name: user.user_metadata?.full_name || user.email?.split('@')[0] } : null}
              isAdmin={user?.email === 'baltarejo@gmail.com'}
              articleTitle={post.title}
            />
          )}

          {related.length > 0 && (
            <div style={{ marginTop: '48px' }}>
              <h3 style={{
                marginBottom: '24px',
                color: 'var(--marble-dark)',
                textAlign: 'center',
                fontSize: '1.4rem',
              }}>
                Leia também
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '16px',
              }}>
                {related.map(r => {
                  const rLocked = r.is_premium && userPlan !== 'premium';
                  return (
                    <Link key={r.slug} href={`/blog/${r.slug}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: '16px',
                        padding: '24px',
                        border: '1px solid var(--border-light)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        height: '100%',
                        position: 'relative',
                        opacity: rLocked ? 0.7 : 1,
                      }}>
                        {rLocked && (
                          <span style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            fontSize: '1rem',
                          }}>🔒</span>
                        )}
                        <span style={{
                          fontSize: '0.75rem',
                          color: CATEGORY_COLORS[r.category]?.color || 'var(--gold-dark)',
                          fontWeight: '600',
                          background: CATEGORY_COLORS[r.category]?.bg || 'rgba(201, 168, 76, 0.1)',
                          padding: '3px 10px',
                          borderRadius: '20px',
                        }}>
                          {CATEGORY_LABELS[r.category] || r.category}
                        </span>
                        <h4 style={{
                          fontSize: '1rem',
                          color: rLocked ? '#555' : 'var(--text)',
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
                  );
                })}
              </div>
            </div>
          )}

          <div style={{
            textAlign: 'center',
            marginTop: '48px',
            padding: '48px 40px',
            background: 'var(--hero-gradient)',
            borderRadius: '20px',
            color: 'white',
          }}>
            <h3 style={{ marginBottom: '12px', fontSize: '1.4rem', fontFamily: "'Playfair Display', Georgia, serif" }}>
              Gostou do conteúdo?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
              Explore mais artigos no blog ou conheça o Método Corpo Limpo completo.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/blog" className="btn-dark-gold" style={{ padding: '12px 28px' }}>
                Ver todos os artigos
              </Link>
              <Link href="/produto/curso-cds-completo" className="btn btn-gold" style={{ padding: '12px 28px' }}>
                Conhecer o curso
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
