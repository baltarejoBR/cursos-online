import Header from '@/components/Header';
import Link from 'next/link';

export const metadata = {
  title: 'O que e Dioxi (CDS/SDC)? - Metodo Corpo Limpo',
  description: 'Entenda o que e Dioxi, CDS e SDC (Dioxido de Cloro), como funciona e como pode ajudar na sua saude. Informacoes basicas para iniciantes.',
};

export default function OQueECDSPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #f0f6fa 0%, #d6e8f4 30%, #c2dde8 70%, #daf0e0 100%)',
        padding: '80px 20px 60px',
        textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #0d3b66, #1a6baa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 300,
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

      {/* Dioxi = CDS = SDC */}
      <section style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '40px 20px',
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{
            background: 'var(--bg)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid var(--border-light)',
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text)' }}>
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
                <div style={{ fontWeight: '800', color: '#2e8b57', fontSize: '1.4rem' }}>Dioxi</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nosso nome de marca</div>
              </div>
              <div style={{ alignSelf: 'center', color: 'var(--border)', fontSize: '1.5rem' }}>=</div>
              <div style={{ flex: '1', minWidth: '150px' }}>
                <div style={{ fontWeight: '800', color: '#1a6baa', fontSize: '1.4rem' }}>CDS</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chlorine Dioxide Solution</div>
              </div>
              <div style={{ alignSelf: 'center', color: 'var(--border)', fontSize: '1.5rem' }}>=</div>
              <div style={{ flex: '1', minWidth: '150px' }}>
                <div style={{ fontWeight: '800', color: '#6b8fad', fontSize: '1.4rem' }}>SDC</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Solucao de Dioxido de Cloro</div>
              </div>
            </div>
            <p style={{
              textAlign: 'center',
              marginTop: '16px',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
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
            background: 'linear-gradient(135deg, #0d3b66, #1a6baa)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginBottom: '48px',
          }}>
            <span style={{ fontSize: '4rem', marginBottom: '16px' }}>▶</span>
            <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Video explicativo em breve</p>
          </div>

          {/* Conteúdo explicativo */}
          <div style={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
            <h2 style={{ marginBottom: '16px', color: 'var(--primary-dark)' }}>
              O que e o Dioxido de Cloro (CDS)?
            </h2>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
              O CDS (Chlorine Dioxide Solution) e uma solucao aquosa de dioxido de cloro, um gas que quando dissolvido
              em agua e utilizado em diversas aplicacoes. As Terapias Bio-oxidativas estudam o uso dessa substancia
              como complemento para o bem-estar e qualidade de vida.
            </p>

            <h2 style={{ marginBottom: '16px', color: 'var(--primary-dark)' }}>
              Como funciona?
            </h2>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
              O dioxido de cloro atua como um agente oxidante seletivo. Isso significa que ele age sobre
              determinados organismos e substancias sem afetar as celulas saudaveis do corpo. Existem diversos
              protocolos de uso que variam de acordo com a finalidade.
            </p>

            <h2 style={{ marginBottom: '16px', color: 'var(--primary-dark)' }}>
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
            }}>
              <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Proximos passos</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}>
                <Link href="/cadastro" className="btn btn-primary" style={{ textAlign: 'center' }}>
                  Criar Conta Gratis
                </Link>
                <Link href="/planos" className="btn btn-outline" style={{ textAlign: 'center' }}>
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
