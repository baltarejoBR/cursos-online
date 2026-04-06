'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

function SucessoContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const isConsultoria = searchParams.get('calendly') === '1';
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/minha-area';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="form-card" style={{ textAlign: 'center', maxWidth: '520px' }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
      <h1 style={{ marginBottom: '12px' }}>Pagamento Confirmado!</h1>
      <p className="subtitle" style={{ marginBottom: '24px' }}>
        Sua compra foi confirmada com sucesso. Aproveite todo o conteudo exclusivo do TEAmor!
      </p>

      <div style={{
        background: 'rgba(34, 197, 94, 0.1)',
        border: '1px solid var(--success)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
      }}>
        <p style={{ color: 'var(--success)', fontWeight: '600' }}>
          ✅ Seu acesso esta ativo
        </p>
      </div>

      {isConsultoria ? (
        <div style={{
          background: 'rgba(90, 138, 60, 0.1)',
          border: '1px solid var(--success)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>
            📅 Agora agende sua consultoria
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
            Escolha o melhor dia e horario para sua sessao:
          </p>
          <a
            href="https://calendly.com/baltarejo/consultoria"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              textDecoration: 'none',
              fontSize: '1rem',
              padding: '12px 28px',
            }}
          >
            Agendar no Calendly
          </a>
        </div>
      ) : (
        <div style={{
          background: 'rgba(0, 136, 204, 0.1)',
          border: '1px solid #0088cc',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          textAlign: 'left',
        }}>
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>
            📱 Acesse o grupo exclusivo TEAmor no Telegram
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
            Para receber seu link de convite automaticamente, inicie uma conversa com nosso bot:
          </p>
          <a
            href="https://t.me/teamoradmbot"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#0088cc',
              color: '#fff',
              padding: '8px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.9rem',
            }}
          >
            Abrir @teamoradmbot no Telegram
          </a>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '8px' }}>
            Clique em "Iniciar" no bot e voce recebera o link do grupo TEAmor.
          </p>
        </div>
      )}

      <Link href="/minha-area" className="btn btn-primary btn-full">
        Ir para Minha Area
      </Link>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '16px' }}>
        Redirecionando em {countdown} segundos...
      </p>
    </div>
  );
}

export default function PagamentoSucessoPage() {
  return (
    <>
      <Header />
      <div className="form-page">
        <Suspense fallback={
          <div className="form-card" style={{ textAlign: 'center', maxWidth: '520px' }}>
            <p>Carregando...</p>
          </div>
        }>
          <SucessoContent />
        </Suspense>
      </div>
    </>
  );
}
