'use client';

import Link from 'next/link';

export default function IniciantesPage() {
  return (
    <div className="dashboard">
      <h1>Para Iniciantes</h1>
      <p className="subtitle">Tudo que você precisa saber para começar</p>

      <div style={{
        display: 'grid',
        gap: '24px',
        marginTop: '32px',
      }}>
        {/* O que é CDS */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '32px',
        }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>📖 O que é CDS?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.7 }}>
            O CDS (Chlorine Dioxide Solution) é uma solução aquosa de dióxido de cloro utilizada em
            Terapias Bio-oxidativas. Se você está começando agora, recomendamos assistir nosso vídeo
            explicativo para entender o básico.
          </p>
          <Link href="/o-que-e-cds" className="btn btn-gold btn-sm">
            Ver Explicação Completa
          </Link>
        </div>

        {/* Primeiros passos */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '32px',
        }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>🚀 Primeiros Passos</h2>
          <ol style={{
            color: 'var(--text-muted)',
            lineHeight: 2,
            paddingLeft: '20px',
          }}>
            <li>Assista o vídeo explicativo sobre o que é CDS</li>
            <li>Baixe o Guia Gratuito do Protocolo K na seção de PDFs Grátis</li>
            <li>Participe do Grupo Telegram gratuito para tirar dúvidas</li>
            <li>Quando estiver pronto, escolha um curso ou livro para aprofundar</li>
          </ol>
        </div>

        {/* Perguntas frequentes */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '32px',
        }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>❓ Perguntas Frequentes</h2>

          {[
            {
              q: 'O CDS é seguro?',
              a: 'Quando utilizado corretamente seguindo os protocolos adequados, o CDS tem sido utilizado por milhares de pessoas. Nossos cursos ensinam o uso correto e seguro.',
            },
            {
              q: 'Preciso de conhecimento prévio?',
              a: 'Não! Nossos materiais são feitos para iniciantes. Comece pelo vídeo explicativo e pelo guia gratuito.',
            },
            {
              q: 'Posso usar em animais?',
              a: 'Sim, existem protocolos específicos para animais. Temos um curso e um livro dedicados ao tema.',
            },
          ].map((faq, i) => (
            <div key={i} style={{
              padding: '16px 0',
              borderBottom: i < 2 ? '1px solid var(--border-light)' : 'none',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>{faq.q}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, var(--bg-card) 100%)',
          border: '1px solid var(--gold)',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Pronto para aprofundar?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Confira nossos cursos e livros para dominar as Terapias Bio-oxidativas.
          </p>
          <Link href="/planos" className="btn btn-gold">Ver Cursos e Livros</Link>
        </div>
      </div>
    </div>
  );
}
