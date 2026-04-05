'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

function SucessoContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [countdown, setCountdown] = useState(5);

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
        Sua assinatura Premium foi ativada com sucesso. Agora você tem acesso
        a todo o conteúdo exclusivo e ao grupo do Instagram!
      </p>

      <div style={{
        background: 'rgba(34, 197, 94, 0.1)',
        border: '1px solid var(--success)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
      }}>
        <p style={{ color: 'var(--success)', fontWeight: '600' }}>
          ✅ Seu acesso premium está ativo
        </p>
      </div>

      <Link href="/minha-area" className="btn btn-primary btn-full">
        Ir para Minha Área
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
