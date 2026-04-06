import Link from 'next/link';
import Header from '@/components/Header';
import { PRODUCTS, CATEGORIES } from '@/lib/products';

export default function Home() {
  const categoryOrder = ['cursos', 'livros', 'servicos', 'loja'];

  const productImages = {
    'curso-cds-completo': '/images/capa-curso.png',
    'livro-completo': '/images/capa-livro.png',
    'consultoria': '/images/gabriel-terno.jpeg',
  };

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
              background: 'rgba(90, 138, 60, 0.3)',
              border: '1px solid rgba(90, 138, 60, 0.5)',
              borderRadius: '20px',
              padding: '6px 16px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              color: '#a8d88a',
            }}>
              +5.000 alunos transformando sua saude
            </div>
            <h1 style={{
              fontSize: '3.2rem',
              fontWeight: '800',
              lineHeight: '1.15',
              marginBottom: '20px',
            }}>
              Transforme sua{' '}
              <span style={{ color: '#7ab356' }}>Saude</span>{' '}
              com o Metodo Corpo Limpo
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: '1.7',
              marginBottom: '32px',
              maxWidth: '500px',
            }}>
              Cursos, livros e consultoria sobre CDS e saude natural.
              Aprenda protocolos biooxidativos de A a Z com Gabriel Baltarejo.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="#cursos" className="btn btn-primary" style={{
                fontSize: '1.1rem',
                padding: '14px 32px',
                background: '#1a6baa',
              }}>
                Conhecer Cursos
              </Link>
              <Link href="#sobre" className="btn btn-outline" style={{
                fontSize: '1.1rem',
                padding: '14px 32px',
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
              }}>
                Quem sou eu
              </Link>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img
              src="/images/hero-gabriel.jpeg"
              alt="Gabriel Baltarejo"
              style={{
                width: '100%',
                maxWidth: '450px',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
            />
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '32px 20px',
      }}>
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
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>+5.000</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Alunos</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>7</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Cursos e Livros</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>+50</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Paises alcancados</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>4.9/5</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Avaliacao dos alunos</div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f6fa 100%)',
        padding: '80px 20px',
      }}>
        <div className="container">
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.2rem',
            marginBottom: '60px',
            color: 'var(--text)',
          }}>
            Por que escolher o Metodo Corpo Limpo?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            maxWidth: '1000px',
            margin: '0 auto',
          }}>
            {[
              { icon: '🌿', title: '100% Natural', desc: 'Metodo baseado em principios naturais de saude e bem-estar, sem quimicos agressivos.' },
              { icon: '🧠', title: 'Baseado em Ciencia', desc: 'Conhecimento fundamentado em estudos cientificos e experiencia pratica comprovada.' },
              { icon: '💚', title: 'Resultados Reais', desc: 'Milhares de pessoas ja transformaram sua saude seguindo nossos metodos naturais.' },
            ].map(b => (
              <div key={b.title} style={{
                textAlign: 'center',
                padding: '30px 20px',
                background: 'var(--bg-card)',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{b.icon}</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>{b.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUTOS POR CATEGORIA */}
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
                      <div className="course-thumb" style={{
                        background: productImages[product.id]
                          ? `url(${productImages[product.id]}) center/cover no-repeat`
                          : product.gradient,
                        position: 'relative',
                        height: '200px',
                      }}>
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
                        {!productImages[product.id] && (
                          <span style={{ fontSize: '2.5rem' }}>
                            {catKey === 'cursos' ? '🎓' : catKey === 'livros' ? '📚' : catKey === 'servicos' ? '💼' : '🛒'}
                          </span>
                        )}
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
          <div>
            <img
              src="/images/gabriel-profissional.jpeg"
              alt="Gabriel Baltarejo"
              style={{
                width: '100%',
                borderRadius: '16px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              }}
            />
          </div>
          <div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>
              Quem e <span style={{ color: '#7ab356' }}>Gabriel Baltarejo</span>?
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
              Pesquisador e educador sobre CDS e saude integrativa, Gabriel Baltarejo
              e o criador do Metodo Corpo Limpo e autor do livro &quot;Transforme sua Saude -
              Protocolos Biooxidativos de A a Z&quot;.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)', marginBottom: '24px' }}>
              Com milhares de alunos em mais de 50 paises, Gabriel compartilha conhecimento
              pratico e acessivel sobre protocolos biooxidativos, ajudando pessoas a transformar
              sua saude de forma natural e consciente.
            </p>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {['Autor best-seller', '+5.000 alunos', 'Entrevistou Andreas Kalcker'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#7ab356', fontSize: '1.2rem' }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUTOS EM DESTAQUE */}
      <section style={{
        padding: '80px 20px',
        background: 'var(--bg)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '48px' }}>
            Produtos em Destaque
          </h2>

          {/* Curso */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'center',
          }} className="destaque-grid">
            <div style={{ textAlign: 'center' }}>
              <img
                src="/images/capa-curso.png"
                alt="Curso Detox Biooxidativo"
                style={{
                  width: '280px',
                  borderRadius: '16px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                }}
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
              <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Curso Detox Biooxidativo</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
                O metodo natural para limpeza e regeneracao do corpo. Aprenda tudo sobre
                CDS desde o basico ate aplicacoes avancadas com protocolos detalhados.
              </p>
              <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
                {['Acesso vitalicio', 'Protocolos para humanos e animais', 'Grupo exclusivo de alunos', 'Atualizacoes gratuitas'].map(f => (
                  <li key={f} style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--primary)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/produto/curso-cds-completo" className="btn btn-primary" style={{ fontSize: '1rem', padding: '12px 28px' }}>
                Saiba mais - R$ 297,00
              </Link>
            </div>
          </div>

          {/* Livro */}
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
              <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Transforme sua Saude</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
                Protocolos Biooxidativos de A a Z. O guia definitivo sobre CDS com tudo
                que voce precisa saber: historia, ciencia, preparacao e protocolos completos.
              </p>
              <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
                {['E-book em PDF de alta qualidade', 'Protocolos para humanos e animais', 'Tabelas de dosagem praticas', 'Atualizacoes gratuitas'].map(f => (
                  <li key={f} style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--warning)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/produto/livro-completo" className="btn btn-primary" style={{ fontSize: '1rem', padding: '12px 28px', background: 'var(--warning)' }}>
                Saiba mais - R$ 97,00
              </Link>
            </div>
            <div style={{ textAlign: 'center' }}>
              <img
                src="/images/capa-livro.png"
                alt="Livro Transforme sua Saude"
                style={{
                  width: '280px',
                  borderRadius: '16px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #2d3a25 0%, #1a2915 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        color: 'white',
      }}>
        <div className="container">
          <img
            src="/images/gabriel-com-cds.jpeg"
            alt="Gabriel Baltarejo com CDS"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid rgba(122, 179, 86, 0.5)',
              marginBottom: '24px',
            }}
          />
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>
            Comece sua Jornada Hoje
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto 32px', fontSize: '1.1rem' }}>
            Escolha o produto ideal para voce e comece a aprender sobre CDS e saude natural agora mesmo.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/planos" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '14px 32px', background: '#1a6baa' }}>
              Ver Todos os Produtos
            </Link>
            <Link href="/produto/consultoria" className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '14px 32px', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
              Agendar Consultoria
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <img src="/images/logo-metodo-corpo-limpo.png" alt="Logo" style={{ height: '30px' }} />
          <p>&copy; 2026 Metodo Corpo Limpo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
