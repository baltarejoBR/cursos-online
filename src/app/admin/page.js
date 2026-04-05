'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const response = await fetch('/api/admin/subscribers');
      if (!response.ok) throw new Error('Sem permissão');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Erro ao carregar dados. Verifique se você tem permissão de admin.');
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Carregando painel admin...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div className="error-msg">{error}</div>
          <Link href="/minha-area" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Voltar
          </Link>
        </div>
      </>
    );
  }

  const { stats, profiles, subscriptions, recentPayments } = data;

  // Mapear subscriptions por user_id para fácil acesso
  const subsByUser = {};
  subscriptions.forEach(sub => {
    if (!subsByUser[sub.user_id] || sub.status === 'active') {
      subsByUser[sub.user_id] = sub;
    }
  });

  return (
    <>
      <Header />
      <div className="container dashboard">
        <h1>Painel Administrativo</h1>
        <p className="subtitle">Gerencie assinantes e pagamentos</p>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <div className="stat-card">
            <div className="number">{stats.totalUsers}</div>
            <div className="label">Total de Usuários</div>
          </div>
          <div className="stat-card">
            <div className="number" style={{ color: 'var(--warning)' }}>{stats.premiumUsers}</div>
            <div className="label">Assinantes Premium</div>
          </div>
          <div className="stat-card">
            <div className="number" style={{ color: 'var(--success)' }}>{stats.activeSubscriptions}</div>
            <div className="label">Assinaturas Ativas</div>
          </div>
          <div className="stat-card">
            <div className="number" style={{ color: 'var(--success)' }}>
              R$ {(stats.totalRevenue / 100).toFixed(2)}
            </div>
            <div className="label">Receita Total</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { id: 'overview', label: 'Usuários' },
            { id: 'subscriptions', label: 'Assinaturas' },
            { id: 'payments', label: 'Pagamentos' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`btn ${tab === t.id ? 'btn-primary' : 'btn-outline'} btn-sm`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Usuários */}
        {tab === 'overview' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={thStyle}>Nome</th>
                  <th style={thStyle}>Plano</th>
                  <th style={thStyle}>Assinatura</th>
                  <th style={thStyle}>Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map(profile => {
                  const sub = subsByUser[profile.id];
                  return (
                    <tr key={profile.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={tdStyle}>
                        <div>{profile.full_name || 'Sem nome'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {profile.id.slice(0, 8)}...
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span className={`badge ${profile.plan === 'premium' ? 'badge-premium' : 'badge-free'}`}>
                          {profile.plan === 'premium' ? 'Premium' : 'Gratuito'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {sub ? (
                          <div>
                            <span style={{
                              color: sub.status === 'active' ? 'var(--success)' :
                                sub.status === 'past_due' ? 'var(--warning)' : 'var(--text-muted)',
                              fontWeight: '600',
                              fontSize: '0.85rem',
                            }}>
                              {sub.status === 'active' ? 'Ativa' :
                                sub.status === 'past_due' ? 'Pendente' :
                                sub.status === 'canceled' ? 'Cancelada' : sub.status}
                            </span>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {sub.plan_type === 'monthly' ? 'Mensal' : 'Anual'}
                              {sub.current_period_end && (
                                <> — até {new Date(sub.current_period_end).toLocaleDateString('pt-BR')}</>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {profile.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : '—'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {profiles.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                Nenhum usuário cadastrado ainda.
              </p>
            )}
          </div>
        )}

        {/* Assinaturas */}
        {tab === 'subscriptions' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={thStyle}>Usuário</th>
                  <th style={thStyle}>Plano</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Período</th>
                  <th style={thStyle}>Cancelar no fim?</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map(sub => {
                  const profile = profiles.find(p => p.id === sub.user_id);
                  return (
                    <tr key={sub.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={tdStyle}>{profile?.full_name || sub.user_id.slice(0, 8)}</td>
                      <td style={tdStyle}>{sub.plan_type === 'monthly' ? 'Mensal' : 'Anual'}</td>
                      <td style={tdStyle}>
                        <span style={{
                          color: sub.status === 'active' ? 'var(--success)' :
                            sub.status === 'past_due' ? 'var(--warning)' : '#ef4444',
                          fontWeight: '600',
                        }}>
                          {sub.status === 'active' ? 'Ativa' :
                            sub.status === 'past_due' ? 'Pendente' :
                            sub.status === 'canceled' ? 'Cancelada' :
                            sub.status === 'expired' ? 'Expirada' : sub.status}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {sub.current_period_start && sub.current_period_end ? (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {new Date(sub.current_period_start).toLocaleDateString('pt-BR')} —{' '}
                            {new Date(sub.current_period_end).toLocaleDateString('pt-BR')}
                          </span>
                        ) : '—'}
                      </td>
                      <td style={tdStyle}>
                        {sub.cancel_at_period_end ? (
                          <span style={{ color: 'var(--warning)' }}>Sim</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>Não</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {subscriptions.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                Nenhuma assinatura encontrada.
              </p>
            )}
          </div>
        )}

        {/* Pagamentos */}
        {tab === 'payments' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={thStyle}>Usuário</th>
                  <th style={thStyle}>Valor</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Data</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map(payment => {
                  const profile = profiles.find(p => p.id === payment.user_id);
                  return (
                    <tr key={payment.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={tdStyle}>{profile?.full_name || payment.user_id.slice(0, 8)}</td>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: '600' }}>
                          R$ {(payment.amount / 100).toFixed(2)}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          color: payment.status === 'succeeded' ? 'var(--success)' :
                            payment.status === 'failed' ? '#ef4444' : 'var(--warning)',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                        }}>
                          {payment.status === 'succeeded' ? 'Pago' :
                            payment.status === 'failed' ? 'Falhou' :
                            payment.status === 'refunded' ? 'Reembolsado' : 'Pendente'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {recentPayments.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                Nenhum pagamento registrado.
              </p>
            )}
          </div>
        )}
      </div>

      <footer className="footer">
        <div className="container">
          <p>© 2026 Método Corpo Limpo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 16px',
  color: 'var(--text-muted)',
  fontSize: '0.85rem',
  fontWeight: '600',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: '0.9rem',
};
