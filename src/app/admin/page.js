'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { PRODUCTS } from '@/lib/products';

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [accesses, setAccesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAccesses, setUserAccesses] = useState([]);
  const [grantLoading, setGrantLoading] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [uploadResult, setUploadResult] = useState(null);

  // Knowledge Base states
  const [kbEntries, setKbEntries] = useState([]);
  const [kbLoading, setKbLoading] = useState(false);
  const [kbFilter, setKbFilter] = useState('all'); // all, pending, approved, rejected
  const [kbCategoryFilter, setKbCategoryFilter] = useState('');
  const [kbSearch, setKbSearch] = useState('');
  const [kbEditingId, setKbEditingId] = useState(null);
  const [kbEditAnswer, setKbEditAnswer] = useState('');
  const [kbNewQuestion, setKbNewQuestion] = useState('');
  const [kbNewAnswer, setKbNewAnswer] = useState('');
  const [kbNewCategory, setKbNewCategory] = useState('geral');
  const [kbShowAdd, setKbShowAdd] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statsRes, accessRes] = await Promise.all([
        fetch('/api/admin/subscribers'),
        fetch('/api/admin/access'),
      ]);

      if (!statsRes.ok) throw new Error('Sem permissao');

      const statsData = await statsRes.json();
      const accessData = accessRes.ok ? await accessRes.json() : { accesses: [] };

      setData(statsData);
      setAccesses(accessData.accesses || []);
    } catch (err) {
      setError('Erro ao carregar dados. Verifique se voce tem permissao de admin.');
    }
    setLoading(false);
  }

  async function loadUserAccesses(userId) {
    const res = await fetch(`/api/admin/access?user_id=${userId}`);
    const data = await res.json();
    setUserAccesses(data.accesses || []);
  }

  async function selectUser(profile) {
    setSelectedUser(profile);
    await loadUserAccesses(profile.id);
  }

  async function grantAccess(productId) {
    if (!selectedUser) return;
    setGrantLoading(productId);
    try {
      const res = await fetch('/api/admin/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUser.id,
          product_id: productId,
        }),
      });
      if (res.ok) {
        await loadUserAccesses(selectedUser.id);
        // Atualizar lista geral de acessos
        const accessRes = await fetch('/api/admin/access');
        const accessData = await accessRes.json();
        setAccesses(accessData.accesses || []);
      }
    } catch {}
    setGrantLoading('');
  }

  async function revokeAccess(productId) {
    if (!selectedUser) return;
    setGrantLoading(productId);
    try {
      const res = await fetch('/api/admin/access', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUser.id,
          product_id: productId,
        }),
      });
      if (res.ok) {
        await loadUserAccesses(selectedUser.id);
        const accessRes = await fetch('/api/admin/access');
        const accessData = await accessRes.json();
        setAccesses(accessData.accesses || []);
      }
    } catch {}
    setGrantLoading('');
  }

  function userHasAccess(productId) {
    return userAccesses.some(a => a.product_id === productId && a.active);
  }

  function getUserAccessCount(userId) {
    return accesses.filter(a => a.user_id === userId && a.active).length;
  }

  async function handleVideoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress('Criando upload no Mux...');
    setUploadResult(null);

    try {
      // 1. Pedir URL de upload ao nosso backend
      const res = await fetch('/api/mux/upload', { method: 'POST' });
      if (!res.ok) throw new Error('Erro ao criar upload');
      const { uploadId, uploadUrl } = await res.json();

      // 2. Enviar o video direto para o Mux
      setUploadProgress(`Enviando ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)...`);

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': 'video/*' },
      });

      if (!uploadRes.ok) throw new Error('Erro ao enviar video');

      // 3. Aguardar processamento
      setUploadProgress('Video enviado! Aguardando processamento...');

      let attempts = 0;
      const maxAttempts = 60;
      let result = null;

      while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 3000));
        const statusRes = await fetch(`/api/mux/status/${uploadId}`);
        const statusData = await statusRes.json();

        if (statusData.status === 'ready' && statusData.playbackId) {
          result = statusData;
          break;
        }

        if (statusData.status === 'errored') {
          throw new Error('Erro no processamento do video');
        }

        attempts++;
        setUploadProgress(`Processando... (${attempts * 3}s)`);
      }

      if (!result) throw new Error('Timeout no processamento');

      setUploadResult(result);
      setUploadProgress('Video pronto!');
    } catch (err) {
      setUploadProgress(`Erro: ${err.message}`);
    } finally {
      setUploading(false);
    }
  }

  // === Knowledge Base functions ===
  async function loadKbEntries() {
    setKbLoading(true);
    try {
      const res = await fetch('/api/knowledge-base?status=all');
      if (res.ok) {
        const data = await res.json();
        setKbEntries(data.entries || []);
      }
    } catch {}
    setKbLoading(false);
  }

  async function kbUpdateEntry(id, updates) {
    const res = await fetch('/api/knowledge-base', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (res.ok) {
      await loadKbEntries();
      setKbEditingId(null);
      setKbEditAnswer('');
    }
  }

  async function kbAddEntry() {
    if (!kbNewQuestion.trim()) return;
    const res = await fetch('/api/knowledge-base', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: kbNewQuestion,
        answer: kbNewAnswer || null,
        category: kbNewCategory,
      }),
    });
    if (res.ok) {
      setKbNewQuestion('');
      setKbNewAnswer('');
      setKbNewCategory('geral');
      setKbShowAdd(false);
      await loadKbEntries();
    }
  }

  async function kbDeleteEntry(id) {
    if (!confirm('Tem certeza que deseja excluir esta entrada?')) return;
    const res = await fetch(`/api/knowledge-base?id=${id}`, { method: 'DELETE' });
    if (res.ok) await loadKbEntries();
  }

  const KB_CATEGORIES = ['geral', 'protocolo', 'dosagem', 'preparo', 'seguranca', 'animais'];

  const filteredKbEntries = kbEntries.filter(e => {
    if (kbFilter !== 'all' && e.status !== kbFilter) return false;
    if (kbCategoryFilter && e.category !== kbCategoryFilter) return false;
    if (kbSearch && !e.question.toLowerCase().includes(kbSearch.toLowerCase())) return false;
    return true;
  });

  function getProductName(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    return product ? product.title : productId;
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

  const filteredProfiles = searchTerm
    ? profiles.filter(p =>
        (p.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : profiles;

  return (
    <>
      <Header />
      <div className="container dashboard">
        <h1>Painel Administrativo</h1>
        <p className="subtitle">Gerencie usuarios, acessos e pagamentos</p>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          <div className="stat-card">
            <div className="number">{stats.totalUsers}</div>
            <div className="label">Total Usuarios</div>
          </div>
          <div className="stat-card">
            <div className="number" style={{ color: 'var(--warning)' }}>{stats.premiumUsers}</div>
            <div className="label">Premium</div>
          </div>
          <div className="stat-card">
            <div className="number" style={{ color: 'var(--success)' }}>{stats.activeSubscriptions}</div>
            <div className="label">Assinaturas Ativas</div>
          </div>
          <div className="stat-card">
            <div className="number" style={{ color: 'var(--primary)' }}>
              {accesses.filter(a => a.active).length}
            </div>
            <div className="label">Acessos Ativos</div>
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
            { id: 'overview', label: 'Usuarios' },
            { id: 'access', label: 'Gerenciar Acessos' },
            { id: 'subscriptions', label: 'Assinaturas' },
            { id: 'payments', label: 'Pagamentos' },
            { id: 'videos', label: 'Videos (Mux)' },
            { id: 'knowledge-base', label: 'Base de Conhecimento' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSelectedUser(null); if (t.id === 'knowledge-base' && kbEntries.length === 0) loadKbEntries(); }}
              className={`btn ${tab === t.id ? 'btn-primary' : 'btn-outline'} btn-sm`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* === ABA: USUARIOS === */}
        {tab === 'overview' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={thStyle}>Nome</th>
                  <th style={thStyle}>Plano</th>
                  <th style={thStyle}>Produtos</th>
                  <th style={thStyle}>Cadastro</th>
                  <th style={thStyle}>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map(profile => (
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
                      <span style={{ color: 'var(--primary)', fontWeight: '600' }}>
                        {getUserAccessCount(profile.id)}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {profile.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : '—'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => { setTab('access'); selectUser(profile); }}
                        className="btn btn-outline btn-sm"
                      >
                        Gerenciar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {profiles.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                Nenhum usuario cadastrado ainda.
              </p>
            )}
          </div>
        )}

        {/* === ABA: GERENCIAR ACESSOS === */}
        {tab === 'access' && (
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
            {/* Lista de usuarios */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px',
              maxHeight: '600px',
              overflowY: 'auto',
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Selecione um usuario</h3>
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  fontSize: '0.9rem',
                  marginBottom: '12px',
                }}
              />
              {filteredProfiles.map(profile => (
                <div
                  key={profile.id}
                  onClick={() => selectUser(profile)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '4px',
                    background: selectedUser?.id === profile.id ? 'var(--primary)' : 'transparent',
                    color: selectedUser?.id === profile.id ? 'white' : 'var(--text)',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                    {profile.full_name || 'Sem nome'}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    opacity: 0.7,
                    marginTop: '2px',
                  }}>
                    {getUserAccessCount(profile.id)} produto(s) ativo(s)
                  </div>
                </div>
              ))}
            </div>

            {/* Painel de acessos do usuario selecionado */}
            <div>
              {selectedUser ? (
                <>
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                  }}>
                    <h3 style={{ marginBottom: '4px' }}>
                      {selectedUser.full_name || 'Sem nome'}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      ID: {selectedUser.id.slice(0, 12)}... | Plano: {selectedUser.plan || 'gratuito'}
                    </p>
                  </div>

                  <h3 style={{ marginBottom: '16px' }}>Produtos disponiveis</h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {PRODUCTS.filter(p => p.type !== 'external').map(product => {
                      const hasAccess = userHasAccess(product.id);
                      const isLoading = grantLoading === product.id;

                      return (
                        <div
                          key={product.id}
                          style={{
                            background: 'var(--bg-card)',
                            border: `1px solid ${hasAccess ? 'var(--success)' : 'var(--border)'}`,
                            borderRadius: '12px',
                            padding: '16px 20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '12px',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                              {hasAccess && <span style={{ color: 'var(--success)', marginRight: '8px' }}>✓</span>}
                              {product.title}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {product.priceDisplay || 'Gratis'}
                              {product.priceNote ? ` ${product.priceNote}` : ''} — {product.type === 'subscription' ? 'Assinatura' : 'Compra unica'}
                            </div>
                          </div>
                          <div>
                            {hasAccess ? (
                              <button
                                onClick={() => revokeAccess(product.id)}
                                disabled={isLoading}
                                className="btn btn-sm"
                                style={{
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  color: '#ef4444',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                }}
                              >
                                {isLoading ? '...' : 'Remover Acesso'}
                              </button>
                            ) : (
                              <button
                                onClick={() => grantAccess(product.id)}
                                disabled={isLoading}
                                className="btn btn-primary btn-sm"
                              >
                                {isLoading ? '...' : 'Dar Acesso'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Historico de acessos */}
                  {userAccesses.length > 0 && (
                    <div style={{ marginTop: '32px' }}>
                      <h3 style={{ marginBottom: '12px' }}>Historico de acessos</h3>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={thStyle}>Produto</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Concedido em</th>
                            <th style={thStyle}>Por</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userAccesses.map(access => (
                            <tr key={access.id} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td style={tdStyle}>{getProductName(access.product_id)}</td>
                              <td style={tdStyle}>
                                <span style={{
                                  color: access.active ? 'var(--success)' : '#ef4444',
                                  fontWeight: '600',
                                  fontSize: '0.85rem',
                                }}>
                                  {access.active ? 'Ativo' : 'Removido'}
                                </span>
                              </td>
                              <td style={tdStyle}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                  {new Date(access.granted_at).toLocaleDateString('pt-BR')}
                                </span>
                              </td>
                              <td style={tdStyle}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                  {access.granted_by || '—'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '60px',
                  textAlign: 'center',
                }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    Selecione um usuario na lista ao lado para gerenciar seus acessos.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === ABA: ASSINATURAS === */}
        {tab === 'subscriptions' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={thStyle}>Usuario</th>
                  <th style={thStyle}>Plano</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Periodo</th>
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
                          <span style={{ color: 'var(--text-muted)' }}>Nao</span>
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

        {/* === ABA: PAGAMENTOS === */}
        {tab === 'payments' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={thStyle}>Usuario</th>
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

        {/* === ABA: VIDEOS (MUX) === */}
        {tab === 'videos' && (
          <div>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '32px',
              marginBottom: '24px',
            }}>
              <h3 style={{ marginBottom: '8px' }}>Upload de Video</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
                Envie um video e receba o Playback ID para usar nas aulas. O video sera protegido com playback assinado.
              </p>

              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                disabled={uploading}
                style={{
                  display: 'block',
                  marginBottom: '16px',
                  padding: '12px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  width: '100%',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                }}
              />

              {uploadProgress && (
                <div style={{
                  padding: '12px 16px',
                  background: uploading ? 'rgba(99, 102, 241, 0.1)' : uploadResult ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${uploading ? 'rgba(99, 102, 241, 0.3)' : uploadResult ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '0.9rem',
                }}>
                  {uploading && '⏳ '}{uploadProgress}
                </div>
              )}

              {uploadResult && (
                <div style={{
                  background: 'var(--bg-input)',
                  border: '2px solid var(--success)',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <h4 style={{ color: 'var(--success)', marginBottom: '12px' }}>Video pronto!</h4>
                  <div style={{ display: 'grid', gap: '8px', fontSize: '0.9rem' }}>
                    <div>
                      <strong>Playback ID (use no campo video_url da aula):</strong>
                      <div style={{
                        background: 'var(--bg)',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        marginTop: '4px',
                        wordBreak: 'break-all',
                        border: '1px solid var(--border)',
                        userSelect: 'all',
                        cursor: 'text',
                      }}>
                        {uploadResult.playbackId}
                      </div>
                    </div>
                    <div>
                      <strong>Asset ID:</strong>{' '}
                      <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{uploadResult.assetId}</span>
                    </div>
                    {uploadResult.duration && (
                      <div>
                        <strong>Duracao:</strong>{' '}
                        <span style={{ color: 'var(--text-muted)' }}>
                          {Math.floor(uploadResult.duration / 60)}min {Math.floor(uploadResult.duration % 60)}s
                        </span>
                      </div>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '16px' }}>
                    Copie o Playback ID acima e cole no campo <code>video_url</code> da aula no Supabase para que o player funcione.
                  </p>
                </div>
              )}
            </div>

            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '24px',
            }}>
              <h3 style={{ marginBottom: '12px' }}>Como usar</h3>
              <ol style={{ paddingLeft: '20px', color: 'var(--text-muted)', lineHeight: '2', fontSize: '0.9rem' }}>
                <li>Faca o upload do video acima</li>
                <li>Copie o <strong>Playback ID</strong> gerado</li>
                <li>No Supabase, abra a tabela <strong>lessons</strong></li>
                <li>Cole o Playback ID no campo <strong>video_url</strong> da aula desejada</li>
                <li>O player aparecera automaticamente na pagina do curso</li>
              </ol>
            </div>
          </div>
        )}

        {/* === ABA: BASE DE CONHECIMENTO === */}
        {tab === 'knowledge-base' && (
          <div>
            {/* Header + botao adicionar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {filteredKbEntries.length} entrada(s)
                  {kbEntries.filter(e => e.status === 'pending').length > 0 && (
                    <span style={{ color: 'var(--warning)', fontWeight: '600', marginLeft: '8px' }}>
                      ({kbEntries.filter(e => e.status === 'pending').length} pendente(s))
                    </span>
                  )}
                </span>
                <button onClick={loadKbEntries} className="btn btn-outline btn-sm" disabled={kbLoading}>
                  {kbLoading ? '...' : 'Atualizar'}
                </button>
              </div>
              <button onClick={() => setKbShowAdd(!kbShowAdd)} className="btn btn-primary btn-sm">
                {kbShowAdd ? 'Cancelar' : '+ Nova Entrada'}
              </button>
            </div>

            {/* Formulario adicionar */}
            {kbShowAdd && (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--primary)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
              }}>
                <h4 style={{ marginBottom: '12px' }}>Nova Entrada</h4>
                <input
                  type="text"
                  placeholder="Pergunta / Situacao..."
                  value={kbNewQuestion}
                  onChange={e => setKbNewQuestion(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid var(--border)', background: 'var(--bg)',
                    color: 'var(--text)', fontSize: '0.9rem', marginBottom: '10px',
                  }}
                />
                <textarea
                  placeholder="Resposta (deixe vazio para status pendente)..."
                  value={kbNewAnswer}
                  onChange={e => setKbNewAnswer(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid var(--border)', background: 'var(--bg)',
                    color: 'var(--text)', fontSize: '0.9rem', marginBottom: '10px',
                    resize: 'vertical',
                  }}
                />
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select
                    value={kbNewCategory}
                    onChange={e => setKbNewCategory(e.target.value)}
                    style={{
                      padding: '8px 12px', borderRadius: '8px',
                      border: '1px solid var(--border)', background: 'var(--bg)',
                      color: 'var(--text)', fontSize: '0.85rem',
                    }}
                  >
                    {KB_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                  <button onClick={kbAddEntry} className="btn btn-primary btn-sm">
                    Salvar
                  </button>
                </div>
              </div>
            )}

            {/* Filtros */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Buscar pergunta..."
                value={kbSearch}
                onChange={e => setKbSearch(e.target.value)}
                style={{
                  padding: '8px 12px', borderRadius: '8px', flex: '1', minWidth: '200px',
                  border: '1px solid var(--border)', background: 'var(--bg)',
                  color: 'var(--text)', fontSize: '0.85rem',
                }}
              />
              <select
                value={kbFilter}
                onChange={e => setKbFilter(e.target.value)}
                style={{
                  padding: '8px 12px', borderRadius: '8px',
                  border: '1px solid var(--border)', background: 'var(--bg)',
                  color: 'var(--text)', fontSize: '0.85rem',
                }}
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendentes</option>
                <option value="approved">Aprovados</option>
                <option value="rejected">Rejeitados</option>
              </select>
              <select
                value={kbCategoryFilter}
                onChange={e => setKbCategoryFilter(e.target.value)}
                style={{
                  padding: '8px 12px', borderRadius: '8px',
                  border: '1px solid var(--border)', background: 'var(--bg)',
                  color: 'var(--text)', fontSize: '0.85rem',
                }}
              >
                <option value="">Todas categorias</option>
                {KB_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Lista de entries */}
            {kbLoading ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                Carregando...
              </p>
            ) : filteredKbEntries.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                Nenhuma entrada encontrada.
              </p>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {filteredKbEntries.map(entry => (
                  <div
                    key={entry.id}
                    style={{
                      background: 'var(--bg-card)',
                      border: `1px solid ${entry.status === 'pending' ? 'var(--warning)' : entry.status === 'approved' ? 'var(--border)' : 'rgba(239, 68, 68, 0.3)'}`,
                      borderRadius: '12px',
                      padding: '16px 20px',
                    }}
                  >
                    {/* Header da entry */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{entry.question}</div>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: '4px',
                            background: entry.status === 'pending' ? 'rgba(245, 158, 11, 0.15)' :
                              entry.status === 'approved' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: entry.status === 'pending' ? 'var(--warning)' :
                              entry.status === 'approved' ? 'var(--success)' : '#ef4444',
                            fontWeight: '600',
                          }}>
                            {entry.status === 'pending' ? 'Pendente' : entry.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                          </span>
                          <span style={{
                            padding: '2px 8px', borderRadius: '4px',
                            background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)',
                          }}>
                            {entry.category}
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            {entry.asked_by} - {new Date(entry.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => kbDeleteEntry(entry.id)}
                        style={{
                          background: 'none', border: 'none', color: '#ef4444',
                          cursor: 'pointer', fontSize: '1.1rem', padding: '4px',
                        }}
                        title="Excluir"
                      >
                        x
                      </button>
                    </div>

                    {/* Resposta */}
                    {entry.answer && kbEditingId !== entry.id && (
                      <div style={{
                        background: 'var(--bg)', borderRadius: '8px', padding: '12px',
                        fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px',
                        whiteSpace: 'pre-wrap',
                      }}>
                        {entry.answer}
                      </div>
                    )}

                    {/* Editor de resposta (para pendentes ou edicao) */}
                    {kbEditingId === entry.id && (
                      <div style={{ marginTop: '8px' }}>
                        <textarea
                          value={kbEditAnswer}
                          onChange={e => setKbEditAnswer(e.target.value)}
                          rows={4}
                          placeholder="Digite a resposta..."
                          style={{
                            width: '100%', padding: '10px 14px', borderRadius: '8px',
                            border: '1px solid var(--border)', background: 'var(--bg)',
                            color: 'var(--text)', fontSize: '0.9rem', marginBottom: '8px',
                            resize: 'vertical',
                          }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => kbUpdateEntry(entry.id, { answer: kbEditAnswer, status: 'approved' })}
                            className="btn btn-primary btn-sm"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => kbUpdateEntry(entry.id, { status: 'rejected' })}
                            className="btn btn-sm"
                            style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                          >
                            Rejeitar
                          </button>
                          <button
                            onClick={() => { setKbEditingId(null); setKbEditAnswer(''); }}
                            className="btn btn-outline btn-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Botoes de acao */}
                    {kbEditingId !== entry.id && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        {entry.status === 'pending' && (
                          <button
                            onClick={() => { setKbEditingId(entry.id); setKbEditAnswer(entry.answer || ''); }}
                            className="btn btn-primary btn-sm"
                          >
                            Responder
                          </button>
                        )}
                        {entry.status === 'approved' && (
                          <button
                            onClick={() => { setKbEditingId(entry.id); setKbEditAnswer(entry.answer || ''); }}
                            className="btn btn-outline btn-sm"
                          >
                            Editar
                          </button>
                        )}
                        {entry.status === 'rejected' && (
                          <button
                            onClick={() => { setKbEditingId(entry.id); setKbEditAnswer(''); }}
                            className="btn btn-outline btn-sm"
                          >
                            Reabrir
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Metodo Corpo Limpo. Todos os direitos reservados.</p>
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
