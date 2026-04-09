import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';

export const metadata = {
  title: 'TEAmor — Curso para Famílias com TEA - Método Corpo Limpo',
  description: 'Curso em áudio para famílias com filhos com TEA. Aulas práticas sobre hidratação, dieta, desparasitação, detox e mais. Assinatura mensal acessível.',
};

export default function TEAmorPage() {
  return (
    <>
      <Header />

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #1a7ab5 0%, #0d3b66 100%)',
        padding: '80px 20px 60px',
        color: 'white',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '50px',
            padding: '6px 20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '24px',
          }}>
            Curso em áudio no Telegram
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '3rem',
            fontWeight: '800',
            lineHeight: 1.15,
            marginBottom: '20px',
          }}>
            TEAmor
          </h1>
          <p style={{
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.5)',
            margin: '0 auto 20px',
            fontStyle: 'italic',
          }}>
            TEA + Amor — para famílias de crianças no espectro autista e crianças atípicas
          </p>
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.7,
            maxWidth: '600px',
            margin: '0 auto 16px',
          }}>
            Um curso para famílias que não querem ficar paradas esperando — querem agir com direção e com amor.
          </p>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.6,
            maxWidth: '550px',
            margin: '0 auto',
          }}>
            Se você sente que seu filho precisa de mais do que explicações teóricas... se você quer entender o que pode estar por trás de tantos sintomas... a gente criou o TEAmor pensando em você.
          </p>
        </div>
      </section>

      {/* O QUE E */}
      <section style={{ padding: '60px 20px', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '16px', textAlign: 'center' }}>
            Para quem é o TEAmor?
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, textAlign: 'center', marginBottom: '32px', maxWidth: '650px', margin: '0 auto 32px' }}>
            Voltado para famílias com filhos com TEA e também para famílias que percebem atrasos, dificuldades de linguagem, comportamento, sensorial, intestino inflamado, seletividade, agitação ou outros sinais de desequilíbrio. A gente sabe como é difícil — e você não precisa passar por isso sozinho(a).
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}>
            {[
              { icon: '💧', title: 'Hidratação', desc: 'Bases fundamentais da saúde' },
              { icon: '🥗', title: 'Dieta', desc: 'Alimentação funcional para crianças' },
              { icon: '🦠', title: 'Desparasitação', desc: 'Limpeza e equilíbrio intestinal' },
              { icon: '🧫', title: 'Fungos e bactérias', desc: 'Controle e prevenção' },
              { icon: '🌱', title: 'Regeneração intestinal', desc: 'Recuperação da mucosa' },
              { icon: '🧹', title: 'Detox', desc: 'Eliminação de sobrecargas' },
              { icon: '⚗️', title: 'Quelação de metais', desc: 'Redução de metais pesados' },
              { icon: '🔥', title: 'Desinflamação', desc: 'Redução de processos inflamatórios' },
              { icon: '🧠', title: 'Ativação neural', desc: 'Estímulo ao desenvolvimento' },
            ].map(item => (
              <div key={item.title} style={{
                background: 'white',
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid var(--border-light)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '4px' }}>{item.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{ padding: '60px 20px', background: 'white', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '32px', textAlign: 'center' }}>
            Como funciona
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Grupo 1 */}
            <div style={{
              background: 'linear-gradient(135deg, #1a7ab515, #1a7ab508)',
              borderRadius: '20px',
              padding: '32px',
              border: '2px solid #1a7ab520',
            }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a7ab5', marginBottom: '4px' }}>Grupo 1</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px' }}>Curso em Áudio</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '16px' }}>
                Aulas em formato podcast, organizadas por tópicos no Telegram. Dá pra ouvir enquanto faz outras atividades — aprendizado leve e possível mesmo para quem tem a vida corrida.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>✓ Aulas em áudio curtas e práticas</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>✓ Organizado por tópicos</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>✓ Novos módulos todo mês</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>✓ Acervo completo de aulas anteriores</span>
              </div>
              <div style={{ marginTop: '20px', padding: '16px', background: 'white', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1a7ab5' }}>R$ 97<span style={{ fontSize: '1rem', fontWeight: '500' }}>/mês</span></div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '4px 0 0' }}>Cancele quando quiser</p>
              </div>
            </div>

            {/* Grupo 2 */}
            <div style={{
              background: 'linear-gradient(135deg, #4ecdc415, #4ecdc408)',
              borderRadius: '20px',
              padding: '32px',
              border: '2px solid #4ecdc420',
            }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#2eaa8a', marginBottom: '4px' }}>Grupo 2</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px' }}>Acompanhamento</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '16px' }}>
                Grupo separado para tirar dúvidas, compartilhar experiências e receber apoio. Pode ter certeza: você não caminha sozinho(a) — a gente tá junto.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>✓ Tire dúvidas sobre as aulas</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>✓ Apoio de outras famílias</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>✓ Equipe disponível para orientação</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>✓ Ambiente acolhedor e organizado</span>
              </div>
              <div style={{ marginTop: '20px', padding: '16px', background: 'white', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#2eaa8a' }}>R$ 47<span style={{ fontSize: '1rem', fontWeight: '500' }}>/mês</span></div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: '4px 0 0' }}>Cancele quando quiser</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARA QUEM */}
      <section style={{
        padding: '60px 20px',
        background: 'var(--bg)',
        borderTop: '1px solid var(--border-light)',
      }}>
        <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '24px' }}>
            Pensado para famílias reais
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            textAlign: 'left',
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            {[
              'Famílias cansadas de procurar respostas e que merecem direção',
              'Famílias com pouco tempo, muitas dúvidas e muito amor',
              'Famílias simples ou mais estudadas — aqui todo mundo é bem-vindo',
              'Famílias que precisam de algo profundo, mas possível de aplicar',
              'Famílias que querem agir, não apenas assistir ao tempo passar',
            ].map(item => (
              <div key={item} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: 'white',
                borderRadius: '10px',
                border: '1px solid var(--border-light)',
                fontSize: '0.95rem',
                color: 'var(--text-muted)',
              }}>
                <span style={{ color: '#1a7ab5', fontWeight: '700', fontSize: '1.1rem' }}>♥</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{
        background: 'linear-gradient(135deg, #1a7ab5 0%, #0d3b66 100%)',
        padding: '60px 20px',
        color: 'white',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '12px' }}>
            Vamos lá? Comece sua jornada com o TEAmor
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '32px', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Pagamento mensal, sem peso e sem amarras. Você decide a cada mês se quer continuar. Sem se endividar, sem ficar preso. A gente quer que você fique porque faz sentido, não por obrigação.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/produto/curso-teamor-aulas" style={{
              display: 'inline-block',
              padding: '16px 36px',
              background: 'white',
              color: '#1a7ab5',
              borderRadius: '50px',
              fontWeight: '700',
              fontSize: '1.05rem',
              textDecoration: 'none',
            }}>
              Quero o Curso — R$ 97/mês
            </Link>
            <Link href="/produto/curso-teamor-interacao" style={{
              display: 'inline-block',
              padding: '16px 36px',
              background: 'transparent',
              color: 'white',
              borderRadius: '50px',
              fontWeight: '700',
              fontSize: '1.05rem',
              textDecoration: 'none',
              border: '2px solid rgba(255,255,255,0.4)',
            }}>
              Quero o Acompanhamento — R$ 47/mês
            </Link>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '16px' }}>
            Dúvidas? Me chama no WhatsApp que a gente conversa.
          </p>
        </div>
      </section>
    </>
  );
}
