import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import { PRODUCTS, CATEGORIES } from '@/lib/products';
import { getImageUrl } from '@/lib/storage';
import { getFeaturedStoreProducts } from '@/lib/store-products';
import { getPublishedPosts } from '@/lib/blog';
import { DEPOIMENTOS_TEXTO } from '@/lib/depoimentos';

export default async function Home() {
  const destaqueCurso = PRODUCTS.find(p => p.id === 'curso-cds-completo');
  const destaqueLivro = PRODUCTS.find(p => p.id === 'livro-completo');

  let featuredProducts = [];
  let latestPosts = [];
  try {
    featuredProducts = await getFeaturedStoreProducts();
  } catch (e) { /* table may not exist yet */ }
  try {
    latestPosts = await getPublishedPosts(3);
  } catch (e) { /* table may not exist yet */ }

  return (
    <>
      <Header />

      {/* HERO */}
      <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '85vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d3a25 50%, #1a2915 100%)',
        color: 'white',
        padding: '60px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center',
          width: '100%',
        }} className="hero-grid">
          <div>
            <div style={{
              display: 'inline-block',
              background: 'rgba(200, 214, 22, 0.2)',
              border: '1px solid rgba(200, 214, 22, 0.4)',
              borderRadius: '20px',
              padding: '6px 16px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              color: '#d6e234',
            }}>
              +300 alunos transformando sua saude
            </div>
            <h1 style={{
              fontFamily: "'Italiana', serif",
              fontSize: '3.2rem',
              fontWeight: '400',
              lineHeight: '1.15',
              marginBottom: '20px',
            }}>
              Transforme sua{' '}
              <span style={{ color: '#c8d616' }}>Saude</span>{' '}
              com o Metodo Corpo Limpo
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: '1.7',
              marginBottom: '32px',
              maxWidth: '500px',
            }}>
              Aprenda tudo sobre Terapias Bio-oxidativas com cursos, livros e mentoria personalizada com Gabriel Baltarejo.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="/downloads/guia-basico-iniciantes.pdf" download className="btn btn-cds" style={{
                fontSize: '1.05rem',
                padding: '16px 36px',
              }}>
                Guia Gratis para Iniciantes
              </a>
              <Link href="/loja" className="btn btn-primary" style={{
                fontSize: '1.05rem',
                padding: '16px 36px',
              }}>
                Comprar Dioxi (SDC)
              </Link>
              <Link href="#qual-produto" className="btn btn-outline" style={{
                fontSize: '1.05rem',
                padding: '16px 36px',
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
              }}>
                Qual produto escolher?
              </Link>
            </div>
          </div>
          <div style={{ textAlign: 'center', position: 'relative', width: '100%', maxWidth: '450px', margin: '0 auto' }}>
            <Image
              src={getImageUrl('gabriel/hero-gabriel.jpeg')}
              alt="Gabriel Baltarejo"
              width={450}
              height={550}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
              priority
            />
          </div>
        </div>
      </section>

      {/* BANNER DIOXI = CDS = SDC */}
      <section style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '40px 20px',
      }}>
        <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '8px', color: 'var(--text)' }}>
            Dioxi = CDS = SDC — e tudo a mesma coisa!
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
            Entenda os nomes diferentes para o mesmo produto
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}>
            <div style={{ textAlign: 'center', maxWidth: '200px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(46,139,87,0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px', fontSize: '1.5rem',
              }}>
                🧪
              </div>
              <div style={{ fontWeight: '800', color: '#2e8b57', fontSize: '1.3rem' }}>Dioxi</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                Nosso nome de marca para Dioxido de Cloro
              </div>
            </div>
            <div style={{ fontSize: '2rem', color: 'var(--border)', alignSelf: 'center', marginTop: '20px' }}>=</div>
            <div style={{ textAlign: 'center', maxWidth: '200px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(26,107,170,0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px', fontSize: '1.5rem',
              }}>
                🌍
              </div>
              <div style={{ fontWeight: '800', color: '#1a6baa', fontSize: '1.3rem' }}>CDS</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                Chlorine Dioxide Solution (nome internacional)
              </div>
            </div>
            <div style={{ fontSize: '2rem', color: 'var(--border)', alignSelf: 'center', marginTop: '20px' }}>=</div>
            <div style={{ textAlign: 'center', maxWidth: '200px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(107,143,173,0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px', fontSize: '1.5rem',
              }}>
                🇧🇷
              </div>
              <div style={{ fontWeight: '800', color: '#6b8fad', fontSize: '1.3rem' }}>SDC</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                Solucao de Dioxido de Cloro (nome em portugues)
              </div>
            </div>
          </div>
          <Link href="/o-que-e-cds" style={{
            display: 'inline-block',
            marginTop: '24px',
            color: 'var(--primary)',
            fontWeight: '600',
            fontSize: '0.95rem',
          }}>
            Saiba mais sobre o que e Dioxi/CDS →
          </Link>
        </div>
      </section>

      {/* PRODUTOS DESTAQUE DA LOJA */}
      {featuredProducts.length > 0 && (
        <section style={{
          background: 'linear-gradient(135deg, #1a2915 0%, #2d3a25 100%)',
          padding: '60px 20px',
          color: 'white',
        }}>
          <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
              Comprar Dioxi (SDC)
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px' }}>
              Os produtos mais procurados da loja. Entrega para todo o Brasil.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}>
              {featuredProducts.map(product => (
                <div key={product.id} style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  padding: '32px 24px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  textAlign: 'left',
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    marginBottom: '12px',
                    background: 'rgba(122,179,86,0.3)',
                    color: '#d6e234',
                  }}>
                    {product.category === 'Combo' ? 'Kit Completo' : 'SDC Puro'}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>
                    {product.name}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.5 }}>
                    {product.items_description}
                  </p>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#c8d616' }}>
                      {product.price_display}
                    </div>
                    {product.installments && (
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                        ou {product.installments}
                      </div>
                    )}
                  </div>
                  <a
                    href={product.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '12px',
                      background: '#2e8b57',
                      color: 'white',
                      borderRadius: '50px',
                      textDecoration: 'none',
                      fontWeight: '700',
                      fontSize: '1rem',
                    }}
                  >
                    Comprar Agora
                  </a>
                </div>
              ))}
            </div>
            <Link href="/loja" style={{
              display: 'inline-block',
              marginTop: '24px',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.95rem',
            }}>
              Ver todos os 37 produtos da loja →
            </Link>
          </div>
        </section>
      )}

      {/* PROVA SOCIAL */}
      <section style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '48px 20px',
      }}>
        {/* Numeros */}
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          textAlign: 'center',
        }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>+300</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Alunos</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>4.9/5</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Avaliacao dos alunos</div>
          </div>
          <div>
            <a href="https://www.instagram.com/gabrielbaltarejo" target="_blank" rel="noopener noreferrer" style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: '800',
                background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Instagram</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>@gabrielbaltarejo</div>
            </a>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>50+</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Paises</div>
          </div>
        </div>

        {/* Depoimentos dos alunos */}
        <div style={{
          maxWidth: '1000px',
          margin: '40px auto 0',
        }}>
          <h3 style={{
            textAlign: 'center',
            fontSize: '1.3rem',
            marginBottom: '24px',
            color: 'var(--text)',
            fontWeight: '600',
          }}>O que nossos alunos dizem</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}>
            {DEPOIMENTOS_TEXTO.map((dep, i) => (
              <div key={i} style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '20px',
                position: 'relative',
              }}>
                <div style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '8px', opacity: 0.3 }}>&ldquo;</div>
                <p style={{
                  color: 'var(--text)',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  marginBottom: '12px',
                  fontStyle: 'italic',
                }}>{dep.texto}</p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1a6baa, #2e8b57)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                  }}>{dep.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text)' }}>{dep.nome}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Aluno(a) do curso</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link href="/depoimentos" style={{
              color: 'var(--primary)',
              fontSize: '0.9rem',
              fontWeight: '600',
              textDecoration: 'none',
            }}>
              Ver todos os depoimentos →
            </Link>
          </div>
        </div>
      </section>

      {/* GUIA GRATIS */}
      <section style={{
        background: 'linear-gradient(135deg, #a8b814 0%, #2e8b57 100%)',
        padding: '60px 20px',
        color: 'white',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📖</div>
          <h2 style={{ fontFamily: "'Italiana', serif", fontSize: '1.8rem', marginBottom: '12px' }}>
            Novo por aqui? Comece pelo Guia Gratuito!
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '24px' }}>
            Baixe o Guia Basico para Iniciantes e aprenda os fundamentos das Terapias Bio-oxidativas.
            Material completo e gratuito para voce dar o primeiro passo.
          </p>
          <a href="/downloads/guia-basico-iniciantes.pdf" download className="btn" style={{
            fontSize: '1.1rem',
            padding: '14px 32px',
            background: 'white',
            color: '#1a6baa',
            fontWeight: '700',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-block',
          }}>
            Baixar Guia Gratis (PDF)
          </a>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '12px' }}>
            Tem duvidas? Acesse o{' '}
            <a href="https://www.forumcds.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>
              Forum CDS
            </a>
            {' '}e tire todas as suas duvidas com a comunidade.
          </p>
        </div>
      </section>

      {/* QUAL PRODUTO IDEAL PRA VOCE? */}
      <section id="qual-produto" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f9faf5 100%)',
        padding: '80px 20px',
      }}>
        <div className="container">
          <h2 style={{
            textAlign: 'center',
            fontFamily: "'Italiana', serif",
            fontSize: '2.2rem',
            marginBottom: '16px',
            color: 'var(--text)',
          }}>
            Qual produto ideal pra voce?
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
            Muita gente tem duvida sobre por onde comecar. Veja qual opcao se encaixa melhor no seu momento:
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '1100px',
            margin: '0 auto',
          }}>
            {/* Iniciante */}
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '20px',
              padding: '32px 24px',
              border: '2px solid #c8d616',
              position: 'relative',
              boxShadow: '0 4px 20px rgba(200, 214, 22, 0.15)',
            }}>
              <span style={{
                position: 'absolute',
                top: '-12px',
                left: '24px',
                background: '#c8d616',
                color: '#1a1c18',
                padding: '4px 16px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '700',
              }}>Iniciante</span>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🌱</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>&quot;Nunca ouvi falar de CDS&quot;</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                Comece pelo guia gratuito para entender o basico. Depois, o livro traz tudo de forma detalhada.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/downloads/guia-basico-iniciantes.pdf" download style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: '#2e8b57', fontWeight: '600', textDecoration: 'none',
                }}>
                  ✓ 1. Baixe o Guia Gratis (PDF)
                </a>
                <Link href="/produto/livro-completo" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: '#2e8b57', fontWeight: '600', textDecoration: 'none',
                }}>
                  ✓ 2. Livro Protocolos de A a Z - R$ 97
                </Link>
                <a href="https://www.forumcds.com/" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem',
                }}>
                  💬 Tire duvidas no Forum CDS
                </a>
              </div>
            </div>

            {/* Intermediario */}
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '20px',
              padding: '32px 24px',
              border: '2px solid #1a6baa',
              position: 'relative',
              boxShadow: '0 8px 30px rgba(26,107,170,0.15)',
              transform: 'scale(1.03)',
            }}>
              <span style={{
                position: 'absolute',
                top: '-12px',
                left: '24px',
                background: '#1a6baa',
                color: 'white',
                padding: '4px 16px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '700',
              }}>Mais Popular</span>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🎓</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>&quot;Quero aprender de verdade&quot;</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                O curso completo e a melhor opcao. Inclui acesso a comunidade exclusiva com grupos especializados.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link href="/produto/curso-cds-completo" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: '#1a6baa', fontWeight: '600', textDecoration: 'none',
                }}>
                  ⭐ Curso Completo + Comunidade - R$ 297
                </Link>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', paddingLeft: '24px' }}>
                  Inclui grupos: Enema CDS, CDS Hotmart, CDS Mama
                </span>
                <Link href="/depoimentos" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem',
                }}>
                  📸 Veja depoimentos de alunos
                </Link>
              </div>
            </div>

            {/* Avancado */}
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '20px',
              padding: '32px 24px',
              border: '2px solid #6b8fad',
              position: 'relative',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}>
              <span style={{
                position: 'absolute',
                top: '-12px',
                left: '24px',
                background: '#6b8fad',
                color: 'white',
                padding: '4px 16px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '700',
              }}>Personalizado</span>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>💡</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>&quot;Preciso de ajuda especifica&quot;</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                Consultoria individual por Zoom com Gabriel Baltarejo. Analiso seu caso e monto protocolos personalizados.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link href="/produto/mentoria" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: '#6b8fad', fontWeight: '600', textDecoration: 'none',
                }}>
                  ✓ Consultoria Individual - R$ 620
                </Link>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', paddingLeft: '24px' }}>
                  Zoom ate 1h30 + acompanhamento WhatsApp por 30 dias
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUTO DESTAQUE: CURSO */}
      <section style={{ padding: '80px 20px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {destaqueCurso && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px',
              alignItems: 'center',
            }} className="destaque-grid">
              <div style={{ textAlign: 'center' }}>
                <Image
                  src={destaqueCurso.image}
                  alt={destaqueCurso.title}
                  width={500}
                  height={500}
                  style={{ width: '100%', maxWidth: '420px', height: 'auto', borderRadius: '16px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }}
                  sizes="(max-width: 768px) 100vw, 420px"
                />
              </div>
              <div>
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(90, 138, 60, 0.12)',
                  color: 'var(--primary)',
                  padding: '4px 16px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}>Mais Vendido</span>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{destaqueCurso.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
                  {destaqueCurso.description}
                </p>
                <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
                  {destaqueCurso.features.map(f => (
                    <li key={f} style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--primary)' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/produto/${destaqueCurso.slug}`} className="btn btn-primary" style={{ fontSize: '1rem', padding: '12px 28px' }}>
                  Quero o Curso - {destaqueCurso.priceDisplay}
                </Link>
              </div>
            </div>
          )}

          {/* Livro */}
          {destaqueLivro && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px',
              alignItems: 'center',
              marginTop: '80px',
            }} className="destaque-grid">
              <div>
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(201, 148, 46, 0.15)',
                  color: 'var(--warning)',
                  padding: '4px 16px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}>Livro Digital</span>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{destaqueLivro.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
                  {destaqueLivro.description}
                </p>
                <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
                  {destaqueLivro.features.map(f => (
                    <li key={f} style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--warning)' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/produto/${destaqueLivro.slug}`} className="btn btn-primary" style={{ fontSize: '1rem', padding: '12px 28px', background: 'var(--warning)' }}>
                  Quero o Livro - {destaqueLivro.priceDisplay}
                </Link>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Image
                  src={destaqueLivro.image}
                  alt={destaqueLivro.title}
                  width={500}
                  height={500}
                  style={{ width: '100%', maxWidth: '420px', height: 'auto', borderRadius: '16px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }}
                  sizes="(max-width: 768px) 100vw, 420px"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* UNIVERSIDADE DIOXI PREVIEW */}
      {latestPosts.length > 0 && (
        <section style={{
          background: 'var(--bg-card)',
          padding: '80px 20px',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div className="container" style={{ maxWidth: '1100px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎓</div>
              <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--text)' }}>
                Universidade Dioxi
              </h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                Artigos, estudos cientificos e conteudo educativo sobre Terapias Bio-oxidativas.
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}>
              {latestPosts.map(post => (
                <Link key={post.id} href={`/universidade/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{
                    background: 'var(--bg)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid var(--border-light)',
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      marginBottom: '12px',
                      background: 'rgba(26,107,170,0.1)',
                      color: '#1a6baa',
                    }}>
                      {post.category}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text)', lineHeight: 1.3 }}>
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link href="/universidade" className="btn btn-outline" style={{ padding: '12px 28px' }}>
                Ver todos os artigos
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* COMUNIDADE */}
      <section style={{
        background: 'linear-gradient(135deg, #0d3b66 0%, #1a6baa 100%)',
        padding: '80px 20px',
        color: 'white',
      }}>
        <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>
            Ao comprar o curso, voce entra na Comunidade
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', marginBottom: '40px', maxWidth: '650px', margin: '0 auto 40px' }}>
            Alem do conteudo completo, quem compra o curso tem acesso exclusivo a grupos especializados
            onde voce troca experiencias e tira duvidas com outros alunos:
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}>
            {[
              { name: 'Enema CDS', icon: '💊', desc: 'Protocolos de enema e aplicacoes' },
              { name: 'CDS Hotmart', icon: '🎓', desc: 'Conteudo exclusivo de alunos' },
              { name: 'CDS Mama', icon: '👩', desc: 'Grupo de mulheres e maes' },
              { name: 'Comunidade Geral', icon: '👥', desc: 'Troca de experiencias e suporte' },
            ].map(g => (
              <div key={g.name} style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '24px 16px',
                border: '1px solid rgba(255,255,255,0.15)',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{g.icon}</div>
                <h4 style={{ marginBottom: '6px' }}>{g.name}</h4>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{g.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/produto/curso-cds-completo" className="btn" style={{
            fontSize: '1.1rem',
            padding: '14px 32px',
            background: 'white',
            color: '#1a6baa',
            fontWeight: '700',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-block',
          }}>
            Quero o Curso + Comunidade
          </Link>
        </div>
      </section>

      {/* FORUM */}
      <section style={{
        background: 'var(--bg-card)',
        padding: '60px 20px',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>💬</div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>
            Tem duvidas? Acesse o Forum CDS
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
            O Forum CDS e uma comunidade aberta onde voce pode tirar duvidas, ler artigos,
            compartilhar experiencias e aprender com outras pessoas que ja praticam Terapias Bio-oxidativas.
            Acesso gratuito para todos.
          </p>
          <a href="https://www.forumcds.com/" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{
            fontSize: '1rem',
            padding: '12px 28px',
            background: '#675614',
          }}>
            Acessar o Forum CDS
          </a>
        </div>
      </section>

      {/* SOBRE / AUTORIDADE */}
      <section id="sobre" style={{
        background: '#1a1a1a',
        color: 'white',
        padding: '80px 20px',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '350px 1fr',
          gap: '60px',
          alignItems: 'center',
        }} className="sobre-grid">
          <div style={{ position: 'relative', width: '100%', height: '420px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
            <Image
              src={getImageUrl('gabriel/gabriel-profissional.jpeg')}
              alt="Gabriel Baltarejo"
              fill
              style={{ objectFit: 'cover' }}
              sizes="350px"
            />
          </div>
          <div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>
              Quem e <span style={{ color: '#c8d616' }}>Gabriel Baltarejo</span>?
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
              Pesquisador e educador sobre Terapias Bio-oxidativas, Gabriel Baltarejo
              e o criador do Metodo Corpo Limpo e autor do livro &quot;Transforme sua Saude -
              Protocolos Biooxidativos de A a Z&quot;.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)', marginBottom: '24px' }}>
              Com milhares de alunos em mais de 50 paises, Gabriel compartilha conhecimento
              pratico e acessivel sobre protocolos biooxidativos, ajudando pessoas a transformar
              sua saude de forma natural e consciente.
            </p>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {['Autor best-seller', '+300 alunos', 'Entrevistou Andreas Kalcker'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#c8d616', fontSize: '1.2rem' }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="https://www.instagram.com/gabrielbaltarejo" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50px', padding: '8px 20px', color: 'white', fontSize: '0.9rem', textDecoration: 'none',
              }}>
                📸 @gabrielbaltarejo
              </a>
              <a href="https://t.me/+YFVp36x1zKhmM2Ix" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50px', padding: '8px 20px', color: 'white', fontSize: '0.9rem', textDecoration: 'none',
              }}>
                📱 Telegram
              </a>
              <a href="https://linktr.ee/metodocorpolimpo" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50px', padding: '8px 20px', color: 'white', fontSize: '0.9rem', textDecoration: 'none',
              }}>
                🔗 Linktree
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{
        background: 'linear-gradient(135deg, #2d3a25 0%, #1a2915 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        color: 'white',
      }}>
        <div className="container">
          <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '4px solid rgba(122, 179, 86, 0.5)', margin: '0 auto 24px' }}>
            <Image
              src={getImageUrl('gabriel/avatar-baltarejo.jpeg')}
              alt="Gabriel Baltarejo"
              fill
              style={{ objectFit: 'cover' }}
              sizes="120px"
            />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>
            Comece sua Jornada Hoje
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto 32px', fontSize: '1.1rem' }}>
            Nao sabe por onde comecar? Baixe o guia gratuito. Ja conhece o Dioxi? Va direto para a loja ou o curso completo.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/downloads/guia-basico-iniciantes.pdf" download className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '14px 32px', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
              Guia Gratis
            </a>
            <Link href="/loja" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '14px 32px', background: '#2e8b57' }}>
              Comprar Dioxi (SDC)
            </Link>
            <Link href="/produto/curso-cds-completo" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '14px 32px', background: '#1a6baa' }}>
              Quero o Curso Completo
            </Link>
            <Link href="/produto/mentoria" className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '14px 32px', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
              Agendar Mentoria
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <a href="https://www.instagram.com/gabrielbaltarejo" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Instagram
            </a>
            <a href="https://t.me/+YFVp36x1zKhmM2Ix" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Telegram
            </a>
            <a href="https://www.forumcds.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Forum CDS
            </a>
            <Link href="/loja" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Loja Dioxi
            </Link>
            <Link href="/universidade" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Universidade Dioxi
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Image src={getImageUrl('logos/logo-metodo-corpo-limpo.png')} alt="Logo" width={30} height={30} />
            <p>&copy; 2026 Metodo Corpo Limpo. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <LeadCaptureModal />
    </>
  );
}
