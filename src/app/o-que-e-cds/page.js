import Header from '@/components/Header';
import Link from 'next/link';
import DecorativeElements from '@/components/DecorativeElements';

export const metadata = {
  title: 'O que e Dioxi (CDS/SDC)? - Metodo Corpo Limpo',
  description: 'Entenda o que e Dioxi, CDS e SDC (Dioxido de Cloro), como funciona e como pode ajudar na sua saude. Informacoes basicas para iniciantes.',
};

export default function OQueECDSPage() {
  return (
    <>
      <Header />

      {/* Hero — Aqua Theme */}
      <section className="aqua-bg" style={{
        padding: '80px 20px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <DecorativeElements theme="aqua" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '16px',
            fontFamily: "'Italiana', serif",
            color: 'var(--marble-dark)',
            fontWeight: 400,
          }}>
            O que e Dioxi (CDS/SDC)?
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            Entenda o basico sobre Dioxido de Cloro e Terapias Bio-oxidativas de forma simples e acessivel.
          </p>
        </div>
      </section>

      {/* Dioxi = CDS = SDC — Premium Card */}
      <section style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '40px 20px',
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="glass-card" style={{
            padding: '40px',
            textAlign: 'center',
          }}>
            <h3 style={{ marginBottom: '28px', color: 'var(--text)', fontSize: '1.3rem' }}>
              Os 3 nomes para o mesmo produto
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              textAlign: 'center',
            }}>
              <div style={{ flex: '1', minWidth: '150px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'rgba(46,139,87,0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px', fontSize: '1.5rem',
                }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 4C10 4 6 10 8 16C10 22 14 26 16 28C18 26 22 22 24 16C26 10 22 4 16 4Z" fill="#2e8b57" opacity="0.8"/>
                    <path d="M16 6C12 8 10 14 12 18C14 22 16 24 16 24C16 24 18 22 20 18C22 14 20 8 16 6Z" fill="#4db87a" opacity="0.6"/>
                  </svg>
                </div>
                <div style={{ fontWeight: '800', color: '#2e8b57', fontSize: '1.4rem' }}>Dioxi</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nosso nome de marca</div>
              </div>
              <div style={{ alignSelf: 'center', color: 'var(--gold)', fontSize: '1.2rem', fontWeight: '300' }}>|</div>
              <div style={{ flex: '1', minWidth: '150px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'rgba(26,107,170,0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px', fontSize: '1.5rem',
                }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="12" y="14" width="8" height="14" rx="1" fill="#1a6baa" opacity="0.7"/>
                    <path d="M11 14h10l-2-6h-6l-2 6z" fill="#3a9ad9" opacity="0.8"/>
                    <circle cx="16" cy="20" r="2" fill="white" opacity="0.5"/>
                  </svg>
                </div>
                <div style={{ fontWeight: '800', color: '#1a6baa', fontSize: '1.4rem' }}>CDS</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chlorine Dioxide Solution</div>
              </div>
              <div style={{ alignSelf: 'center', color: 'var(--gold)', fontSize: '1.2rem', fontWeight: '300' }}>|</div>
              <div style={{ flex: '1', minWidth: '150px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'rgba(91,188,201,0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px', fontSize: '1.5rem',
                }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="4" fill="#5bbcc9" opacity="0.8"/>
                    <circle cx="8" cy="12" r="3" fill="#5bbcc9" opacity="0.5"/>
                    <circle cx="24" cy="12" r="3" fill="#5bbcc9" opacity="0.5"/>
                    <circle cx="12" cy="24" r="3" fill="#5bbcc9" opacity="0.5"/>
                    <circle cx="20" cy="24" r="3" fill="#5bbcc9" opacity="0.5"/>
                    <line x1="16" y1="16" x2="8" y2="12" stroke="#5bbcc9" strokeWidth="1" opacity="0.4"/>
                    <line x1="16" y1="16" x2="24" y2="12" stroke="#5bbcc9" strokeWidth="1" opacity="0.4"/>
                    <line x1="16" y1="16" x2="12" y2="24" stroke="#5bbcc9" strokeWidth="1" opacity="0.4"/>
                    <line x1="16" y1="16" x2="20" y2="24" stroke="#5bbcc9" strokeWidth="1" opacity="0.4"/>
                  </svg>
                </div>
                <div style={{ fontWeight: '800', color: '#5bbcc9', fontSize: '1.4rem' }}>SDC</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Solucao de Dioxido de Cloro</div>
              </div>
            </div>
            <p style={{
              textAlign: 'center',
              marginTop: '20px',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              borderTop: '1px solid var(--border-light)',
              paddingTop: '16px',
            }}>
              Dioxi, CDS e SDC se referem a mesma solucao aquosa de Dioxido de Cloro. O nome varia conforme o idioma e a regiao.
            </p>
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="container" style={{ padding: '60px 20px' }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          <div style={{
            aspectRatio: '16/9',
            background: 'var(--hero-gradient)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginBottom: '48px',
            border: '2px solid rgba(201, 168, 76, 0.2)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          }}>
            <span style={{ fontSize: '4rem', marginBottom: '16px' }}>▶</span>
            <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Video explicativo em breve</p>
          </div>

          {/* Conteudo explicativo */}
          <div style={{ lineHeight: 1.8, fontSize: '1.05rem', fontFamily: "'Lora', serif" }}>
            <h2 style={{ marginBottom: '16px', color: 'var(--marble-dark)', fontFamily: "'Italiana', serif", fontWeight: 400, fontSize: '1.6rem', borderBottom: '2px solid var(--gold)', paddingBottom: '8px', display: 'inline-block' }}>
              O que e o Dioxido de Cloro (CDS)?
            </h2>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
              O CDS (Chlorine Dioxide Solution) e uma solucao aquosa de dioxido de cloro, um gas que quando dissolvido
              em agua e utilizado em diversas aplicacoes. As Terapias Bio-oxidativas estudam o uso dessa substancia
              como complemento para o bem-estar e qualidade de vida.
            </p>

            <h2 style={{ marginBottom: '16px', color: 'var(--marble-dark)', fontFamily: "'Italiana', serif", fontWeight: 400, fontSize: '1.6rem', borderBottom: '2px solid var(--gold)', paddingBottom: '8px', display: 'inline-block' }}>
              Como funciona?
            </h2>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
              O dioxido de cloro atua como um agente oxidante seletivo. Isso significa que ele age sobre
              determinados organismos e substancias sem afetar as celulas saudaveis do corpo. Existem diversos
              protocolos de uso que variam de acordo com a finalidade.
            </p>

            <h2 style={{ marginBottom: '16px', color: 'var(--marble-dark)', fontFamily: "'Italiana', serif", fontWeight: 400, fontSize: '1.6rem', borderBottom: '2px solid var(--gold)', paddingBottom: '8px', display: 'inline-block' }}>
              Por onde comecar?
            </h2>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
              Se voce esta conhecendo o CDS agora, recomendamos comecar pelos materiais gratuitos disponíveis
              na plataforma. Apos entender o basico, voce pode aprofundar seus conhecimentos com nossos
              cursos e livros.
            </p>

            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '32px',
              marginTop: '40px',
              borderTop: '3px solid var(--gold)',
            }}>
              <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Proximos passos</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}>
                <Link href="/cadastro" className="btn btn-gold" style={{ textAlign: 'center' }}>
                  Criar Conta Gratis
                </Link>
                <Link href="/planos" className="btn btn-outline-gold" style={{ textAlign: 'center' }}>
                  Ver Cursos e Livros
                </Link>
              </div>
            </div>
          </div>
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
