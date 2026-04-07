'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-browser';
import { PRODUCTS, CATEGORIES } from '@/lib/products';

export default function MinhaAreaPage() {
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTelegram, setEditingTelegram] = useState(false);
  const [telegramInput, setTelegramInput] = useState('');
  const [savingTelegram, setSavingTelegram] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;

    setUser(currentUser);

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    setProfile(profileData);

    const { data: userProducts } = await supabase
      .from('user_products')
      .select('*')
      .eq('user_id', currentUser.id)
      .eq('active', true);

    const productsWithInfo = (userProducts || []).map(up => {
      const product = PRODUCTS.find(p => p.id === up.product_id);
      return { ...up, product };
    }).filter(up => up.product);

    setMyProducts(productsWithInfo);
    setTelegramInput(profileData?.telegram_username || '');
    setLoading(false);
  }

  async function saveTelegram() {
    setSavingTelegram(true);
    const cleanUsername = telegramInput.trim().replace(/^@/, '');
    await supabase
      .from('profiles')
      .update({ telegram_username: cleanUsername || null })
      .eq('id', user.id);
    setProfile(prev => ({ ...prev, telegram_username: cleanUsername || null }));
    setEditingTelegram(false);
    setSavingTelegram(false);
  }

  if (loading) {
    return (
      <div className="dashboard">
        <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
      </div>
    );
  }

  const cursos = myProducts.filter(p => p.product.category === 'cursos');
  const livros = myProducts.filter(p => p.product.category === 'livros');
  const servicos = myProducts.filter(p => p.product.category === 'servicos');

  return (
    <div className="dashboard">
      <h1>Ola, {profile?.full_name || 'Aluno'}!</h1>
      <p className="subtitle">Seus produtos e acessos</p>

      {/* Telegram */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '1.2rem' }}>📱</span>
        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Telegram:</span>
        {editingTelegram ? (
          <>
            <input
              type="text"
              placeholder="@seuusuario"
              value={telegramInput}
              onChange={(e) => setTelegramInput(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '0.9rem',
              }}
            />
            <button
              onClick={saveTelegram}
              disabled={savingTelegram}
              className="btn btn-gold"
              style={{ padding: '6px 16px', fontSize: '0.85rem' }}
            >
              {savingTelegram ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              onClick={() => { setEditingTelegram(false); setTelegramInput(profile?.telegram_username || ''); }}
              style={{ padding: '6px 12px', fontSize: '0.85rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <span style={{ color: profile?.telegram_username ? 'var(--text)' : 'var(--text-muted)' }}>
              {profile?.telegram_username ? `@${profile.telegram_username}` : 'Nao informado'}
            </span>
            <button
              onClick={() => setEditingTelegram(true)}
              style={{
                padding: '4px 12px',
                fontSize: '0.8rem',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--gold)',
                cursor: 'pointer',
              }}
            >
              Editar
            </button>
            {!profile?.telegram_username && (
              <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', width: '100%' }}>
                Informe seu Telegram para participar do grupo da comunidade.
              </small>
            )}
          </>
        )}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="number">{myProducts.length}</div>
          <div className="label">Produtos Ativos</div>
        </div>
        <div className="stat-card">
          <div className="number">{cursos.length}</div>
          <div className="label">Cursos</div>
        </div>
        <div className="stat-card">
          <div className="number">{livros.length}</div>
          <div className="label">Livros</div>
        </div>
      </div>

      {/* Meus Produtos */}
      {myProducts.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center',
        }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '1.1rem' }}>
            Voce ainda nao tem acesso a nenhum produto.
          </p>
          <Link href="/planos" className="btn btn-gold">
            Ver Produtos
          </Link>
        </div>
      ) : (
        <>
          {[
            { items: cursos, label: 'Meus Cursos' },
            { items: livros, label: 'Meus Livros' },
            { items: servicos, label: 'Servicos' },
          ].map(({ items, label }) => items.length > 0 && (
            <div key={label}>
              <h2 style={{ marginBottom: '20px' }}>{CATEGORIES[items[0].product.category]?.icon} {label}</h2>
              <div className="courses-grid" style={{ marginBottom: '40px' }}>
                {items.map(item => (
                  <Link
                    key={item.id}
                    href={`/produto/${item.product.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="course-card">
                      <div className="course-thumb" style={{ background: item.product.gradient, position: 'relative', overflow: 'hidden' }}>
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.title}
                            fill
                            style={{ objectFit: 'contain' }}
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <span style={{ fontSize: '2.5rem' }}>
                            {CATEGORIES[item.product.category]?.icon || '📦'}
                          </span>
                        )}
                      </div>
                      <div className="course-body">
                        <h3>{item.product.title}</h3>
                        <p>{item.product.subtitle}</p>
                        <div className="course-meta">
                          <span className="badge badge-free" style={{ background: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)' }}>
                            Acesso Ativo
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {/* CTA para ver mais produtos */}
      <div style={{
        background: 'linear-gradient(135deg, var(--cds-pale) 0%, var(--bg-card) 100%)',
        border: '1px solid var(--cds)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        marginTop: '48px',
      }}>
        <h2 style={{ marginBottom: '12px' }}>Quer mais conteudo?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
          Confira todos os nossos cursos, livros e servicos disponiveis.
        </p>
        <Link href="/planos" className="btn btn-gold">Ver Todos os Produtos</Link>
      </div>
    </div>
  );
}
