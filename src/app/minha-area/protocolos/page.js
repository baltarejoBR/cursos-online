'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { PRODUCTS } from '@/lib/products';

export default function ProtocolosPage() {
  const supabase = createClient();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: userProducts } = await supabase
        .from('user_products')
        .select('product_id')
        .eq('user_id', user.id)
        .eq('active', true);

      const hasCursoOrLivro = (userProducts || []).some(up => {
        const product = PRODUCTS.find(p => p.id === up.product_id);
        return product && (product.category === 'cursos' || product.category === 'livros');
      });

      setHasAccess(hasCursoOrLivro);
      setLoading(false);
    }
    checkAccess();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="dashboard">
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '60px 32px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🔒</span>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Acesso Restrito</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            Os protocolos estao disponiveis para quem adquiriu um curso ou livro.
          </p>
          <Link href="/planos" className="btn btn-primary">Ver Cursos e Livros</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Protocolos</h1>
      <p className="subtitle">Protocolos Bio-oxidativos detalhados</p>

      <div style={{
        display: 'grid',
        gap: '20px',
        marginTop: '32px',
      }}>
        {[
          { name: 'Protocolo C', desc: 'Protocolo basico para iniciantes. Ideal para comecar com seguranca.', level: 'Iniciante' },
          { name: 'Protocolo D', desc: 'Protocolo de desintoxicacao. Uso diario com dosagem progressiva.', level: 'Intermediario' },
          { name: 'Protocolo K', desc: 'Protocolo intensivo. Para casos que exigem maior concentracao.', level: 'Avancado' },
          { name: 'Protocolo F', desc: 'Protocolo frequente. Aplicacoes em intervalos curtos ao longo do dia.', level: 'Intermediario' },
        ].map((protocolo, i) => (
          <div key={i} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.1rem' }}>🧪 {protocolo.name}</h3>
              <span className="badge" style={{
                background: protocolo.level === 'Iniciante' ? 'rgba(46,139,87,0.12)' :
                  protocolo.level === 'Avancado' ? 'rgba(212,160,23,0.15)' : 'rgba(26,107,170,0.12)',
                color: protocolo.level === 'Iniciante' ? 'var(--success)' :
                  protocolo.level === 'Avancado' ? 'var(--warning)' : 'var(--primary)',
              }}>
                {protocolo.level}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{protocolo.desc}</p>
          </div>
        ))}
      </div>

      <p style={{
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        marginTop: '32px',
        textAlign: 'center',
        fontStyle: 'italic',
      }}>
        Mais protocolos serao adicionados em breve. Consulte seu curso para instrucoes detalhadas de cada protocolo.
      </p>
    </div>
  );
}
