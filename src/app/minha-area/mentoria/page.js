'use client';

import { PRODUCTS } from '@/lib/products';

export default function MentoriaPage() {
  const mentoria = PRODUCTS.find(p => p.id === 'mentoria');

  return (
    <div className="dashboard">
      <h1>Mentoria</h1>
      <p className="subtitle">Atendimento personalizado com Baltarejo</p>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '40px',
        marginTop: '32px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '32px',
          flexWrap: 'wrap',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: mentoria?.gradient || 'linear-gradient(135deg, #6b8fad, #4a6a8a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            flexShrink: 0,
          }}>
            💼
          </div>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>{mentoria?.title || 'Mentoria com Baltarejo'}</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
              {mentoria?.description || 'Mentoria individual para tirar todas as suas duvidas sobre Terapias Bio-oxidativas.'}
            </p>

            {mentoria?.features && (
              <ul style={{
                listStyle: 'none',
                display: 'grid',
                gap: '10px',
                marginBottom: '32px',
              }}>
                {mentoria.features.map((f, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'var(--text-muted)',
                    fontSize: '0.95rem',
                  }}>
                    <span style={{ color: 'var(--success)', fontSize: '1.1rem' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--primary-dark)',
              }}>
                {mentoria?.priceDisplay || 'R$ 497,00'}
                <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                  {mentoria?.priceNote || '/sessao'}
                </span>
              </span>
              <a
                href={mentoria?.externalUrl || 'https://wa.me/75998546139'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ textDecoration: 'none' }}
              >
                Agendar via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Como funciona */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Como funciona</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {[
            { step: '1', title: 'Agendamento', desc: 'Entre em contato pelo WhatsApp e escolha o melhor horario.' },
            { step: '2', title: 'Sessao', desc: 'Sessao individual por videochamada com protocolo personalizado.' },
            { step: '3', title: 'Acompanhamento', desc: 'Acompanhamento por 7 dias apos a sessao para tirar duvidas.' },
          ].map((item) => (
            <div key={item.step} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                margin: '0 auto 12px',
              }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
