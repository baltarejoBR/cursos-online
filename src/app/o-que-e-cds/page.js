import Header from '@/components/Header';
import Link from 'next/link';
import DecorativeElements from '@/components/DecorativeElements';

export const metadata = {
  title: 'O que é Dioxi (CDS/SDC)? - Método Corpo Limpo',
  description: 'Entenda o que é Dioxi, CDS e SDC (Dióxido de Cloro), como funciona e como pode ajudar na sua saúde. Informações básicas para iniciantes.',
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
            fontFamily: "'Playfair Display', Georgia, serif",
            color: 'var(--marble-dark)',
            fontWeight: 400,
          }}>
            O que é Dioxi (CDS/SDC)?
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            Entenda o básico sobre Dióxido de Cloro e Terapias Bio-oxidativas de forma simples e acessível.
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
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Solução de Dióxido de Cloro</div>
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
              Dioxi, CDS e SDC se referem à mesma solução aquosa de Dióxido de Cloro. O nome varia conforme o idioma e a região.
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
            <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Vídeo explicativo em breve</p>
          </div>

          {/* Conteudo explicativo */}
          <div style={{ lineHeight: 1.8, fontSize: '1.05rem', fontFamily: "'Lora', serif" }}>
            <h2 style={{ marginBottom: '16px', color: 'var(--marble-dark)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, fontSize: '1.6rem', borderBottom: '2px solid var(--gold)', paddingBottom: '8px', display: 'inline-block' }}>
              O que é o Dióxido de Cloro (CDS)?
            </h2>
            <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
              O <strong>CDS</strong> (Chlorine Dioxide Solution) é uma solução aquosa contendo gás dióxido de cloro (ClO2) dissolvido em água pura. É um gás amarelo-esverdeado, altamente solúvel em água, com sabor quase imperceptível e pH neutro.
            </p>
            <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
              O CDS funciona como um <strong>oxidante seletivo</strong> — ele busca e age sobre vírus, bactérias, fungos e metais pesados no corpo, sem agredir as células saudáveis. Depois de agir, se decompõe apenas em cloreto e oxigênio — substâncias que já existem naturalmente no corpo.
            </p>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)', fontStyle: 'italic', borderLeft: '3px solid var(--gold)', paddingLeft: '16px' }}>
              "É como ganhar um pulmão extra bebendo água." — Gabriel Baltarejo
            </p>

            {/* Tabela de Oxidação */}
            <h2 style={{ marginBottom: '16px', color: 'var(--marble-dark)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, fontSize: '1.6rem', borderBottom: '2px solid var(--gold)', paddingBottom: '8px', display: 'inline-block' }}>
              Por que o CDS é seguro?
            </h2>
            <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
              O potencial de oxidação do CDS (0,95V) é <strong>menor que o do oxigênio que respiramos</strong> (1,23V). Isso significa que ele não destrói indiscriminadamente tecidos saudáveis.
            </p>
            <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--gold)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--marble-dark)' }}>Substância</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--marble-dark)' }}>Potencial (Volts)</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--marble-dark)' }}>Agressividade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: 'rgba(46,139,87,0.08)', fontWeight: '600' }}>
                    <td style={{ padding: '10px 16px' }}>CDS (ClO2)</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', color: '#2e8b57' }}>0,95V</td>
                    <td style={{ padding: '10px 16px' }}>Baixo — seletivo</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '10px 16px' }}>Oxigênio (O2)</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center' }}>1,23V</td>
                    <td style={{ padding: '10px 16px' }}>Moderado</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '10px 16px' }}>Hipoclorito / Água Sanitária (NaClO)</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', color: '#c0392b' }}>1,49V</td>
                    <td style={{ padding: '10px 16px' }}>Alto</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '10px 16px' }}>Água Oxigenada (H2O2)</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', color: '#c0392b' }}>1,78V</td>
                    <td style={{ padding: '10px 16px' }}>Alto</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 16px' }}>Ozônio (O3)</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', color: '#c0392b' }}>2,07V</td>
                    <td style={{ padding: '10px 16px' }}>Muito alto</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
              O CDS é o <strong>único oxidante</strong> que não gera radicais livres tóxicos e não gera trihalometanos (substâncias cancerígenas). Possui 5 elétrons livres para doar e permanece até 1 hora no organismo.
            </p>

            {/* CDS vs Agua Sanitaria */}
            <h2 style={{ marginBottom: '16px', color: 'var(--marble-dark)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, fontSize: '1.6rem', borderBottom: '2px solid var(--gold)', paddingBottom: '8px', display: 'inline-block' }}>
              CDS NÃO é Água Sanitária
            </h2>
            <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
              Esta é a confusão mais comum — e ela é <strong>intencional</strong>. CDS e água sanitária são substâncias completamente diferentes:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(46,139,87,0.08)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(46,139,87,0.2)' }}>
                <div style={{ fontWeight: '700', color: '#2e8b57', marginBottom: '8px', fontSize: '1.1rem' }}>CDS = Dióxido de Cloro (ClO2)</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Seguro, potencial de oxidação 0,95V. Usado para purificar água potável.</div>
              </div>
              <div style={{ background: 'rgba(192,57,43,0.08)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(192,57,43,0.2)' }}>
                <div style={{ fontWeight: '700', color: '#c0392b', marginBottom: '8px', fontSize: '1.1rem' }}>Água Sanitária = Hipoclorito (NaClO)</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Perigoso, potencial de 1,49V. Produto de limpeza doméstica.</div>
              </div>
            </div>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
              É como comparar oxigênio (O2) com monóxido de carbono (CO) — ambos têm oxigênio na fórmula, mas são substâncias completamente distintas.
            </p>

            {/* MMS vs CDS */}
            <h2 style={{ marginBottom: '16px', color: 'var(--marble-dark)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, fontSize: '1.6rem', borderBottom: '2px solid var(--gold)', paddingBottom: '8px', display: 'inline-block' }}>
              MMS vs CDS: A Evolução
            </h2>
            <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
              O <strong>MMS</strong> foi a primeira versão, criada por Jim Humble em 1994 — a mistura direta de clorito de sódio com ácido, que tinha gosto forte e podia causar desconforto.
            </p>
            <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
              O <strong>CDS</strong> é a evolução, desenvolvida pelo biofísico Andreas Kalcker em 2006: o gás dióxido de cloro é separado e dissolvido em água pura. Resultado: sabor quase imperceptível, pH neutro, sem subprodutos tóxicos e muito mais seguro.
            </p>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)', fontStyle: 'italic', borderLeft: '3px solid var(--gold)', paddingLeft: '16px' }}>
              "O MMS é ativado no momento. O CDS já é engarrafado." — Gabriel
            </p>

            {/* Oxidação Seletiva */}
            <h2 style={{ marginBottom: '16px', color: 'var(--marble-dark)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, fontSize: '1.6rem', borderBottom: '2px solid var(--gold)', paddingBottom: '8px', display: 'inline-block' }}>
              Oxidação Seletiva: Como Age no Corpo
            </h2>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
              O CDS age por <strong>oxidação seletiva</strong> — ele reage com compostos ácidos e cargas elétricas específicas encontradas nas membranas de patógenos. Após oxidar, se decompõe em cloreto (Cl⁻) e oxigênio (O2). É essencialmente um <strong>suplemento de oxigênio</strong>: 1 mg de CDS pode liberar 48 mg de oxigênio, chegando em lugares onde o sangue nem consegue chegar.
            </p>

            {/* Biofilmes */}
            <h2 style={{ marginBottom: '16px', color: 'var(--marble-dark)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, fontSize: '1.6rem', borderBottom: '2px solid var(--gold)', paddingBottom: '8px', display: 'inline-block' }}>
              Biofilmes: A Barreira Invisível
            </h2>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
              Biofilmes são camadas protetoras criadas por colônias de bactérias, fungos e parasitas no intestino e mucosas. Funcionam como uma "capa protetora" que impede o sistema imunológico e medicamentos de alcançar os patógenos. O CDS é capaz de <strong>romper biofilmes</strong>, expondo os patógenos para eliminação.
            </p>

            {/* Herxheimer */}
            <h2 style={{ marginBottom: '16px', color: 'var(--marble-dark)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, fontSize: '1.6rem', borderBottom: '2px solid var(--gold)', paddingBottom: '8px', display: 'inline-block' }}>
              Reação de Herxheimer: A Fase de Limpeza
            </h2>
            <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
              Ao começar a tomar CDS, é comum passar por uma fase de <strong>desintoxicação</strong>. Quando patógenos morrem, eles liberam toxinas, causando sintomas temporários como urina mais forte, erupções na pele, cansaço e dor de cabeça. <strong>Não são efeitos colaterais do CDS</strong> — é o corpo se limpando.
            </p>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)', fontStyle: 'italic', borderLeft: '3px solid var(--gold)', paddingLeft: '16px' }}>
              Regra de ouro: "Piorei: DIMINUI a dose. Estou melhorando: MANTÉM. Não estou melhorando: AUMENTA."
            </p>

            {/* Evidências rápidas */}
            <h2 style={{ marginBottom: '16px', color: 'var(--marble-dark)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, fontSize: '1.6rem', borderBottom: '2px solid var(--gold)', paddingBottom: '8px', display: 'inline-block' }}>
              Evidências de Segurança
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              {[
                { num: '0,95V', label: 'Potencial de oxidação (menor que O2)' },
                { num: '3.000+', label: 'Pacientes em ensaios clínicos' },
                { num: '0', label: 'Efeitos adversos graves' },
                { num: '10.000+', label: 'Médicos na COMUSAV' },
                { num: '4', label: 'Patentes internacionais (Kalcker)' },
                { num: '6+', label: 'Anos que Gabriel toma CDS diariamente' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#2e8b57', fontFamily: 'system-ui' }}>{item.num}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '32px',
              marginTop: '40px',
              borderTop: '3px solid var(--gold)',
            }}>
              <h3 style={{ marginBottom: '12px', textAlign: 'center' }}>Quer se aprofundar?</h3>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.95rem' }}>
                Explore artigos gratuitos na Universidade Dioxi ou aprenda tudo no curso completo.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}>
                <Link href="/universidade" className="btn btn-gold" style={{ textAlign: 'center' }}>
                  Universidade Dioxi (Grátis)
                </Link>
                <Link href="/planos" className="btn btn-outline-gold" style={{ textAlign: 'center' }}>
                  Curso Completo — R$297
                </Link>
              </div>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '16px', fontSize: '0.85rem' }}>
                Casos complexos? <a href="https://wa.me/75998546139" style={{ color: 'var(--gold)' }}>Consultoria Individual com Gabriel — R$620</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Método Corpo Limpo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
