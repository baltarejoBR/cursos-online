'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { createClient } from '@/lib/supabase-browser';

export default function MinhaAreaPage() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTelegram, setEditingTelegram] = useState(false);
  const [telegramInput, setTelegramInput] = useState('');
  const [savingTelegram, setSavingTelegram] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);

    // Buscar perfil
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    setProfile(profileData);

    // Buscar matrículas com dados do curso
    const { data: enrollmentData } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses:course_id (*)
      `)
      .eq('user_id', currentUser.id);

    setEnrollments(enrollmentData || []);
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
      <>
        <Header />
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container dashboard">
        <h1>Olá, {profile?.full_name || 'Aluno'}! 👋</h1>
        <p className="subtitle">
          Plano atual: <span className={`badge ${profile?.plan === 'premium' ? 'badge-premium' : 'badge-free'}`}>
            {profile?.plan === 'premium' ? 'Premium' : 'Gratuito'}
          </span>
        </p>

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
                className="btn btn-primary"
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
                {profile?.telegram_username ? `@${profile.telegram_username}` : 'Não informado'}
              </span>
              <button
                onClick={() => setEditingTelegram(true)}
                style={{
                  padding: '4px 12px',
                  fontSize: '0.8rem',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                }}
              >
                Editar
              </button>
              {!profile?.telegram_username && (
                <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', width: '100%' }}>
                  Informe seu Telegram para acessar o grupo exclusivo de membros premium.
                </small>
              )}
            </>
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="number">{enrollments.length}</div>
            <div className="label">Cursos Matriculados</div>
          </div>
          <div className="stat-card">
            <div className="number">
              {enrollments.filter(e => e.completed_at).length}
            </div>
            <div className="label">Cursos Concluídos</div>
          </div>
          <div className="stat-card">
            <div className="number">
              {profile?.plan === 'premium' ? '∞' : enrollments.length}
            </div>
            <div className="label">
              {profile?.plan === 'premium' ? 'Acesso Total' : 'Cursos Disponíveis'}
            </div>
          </div>
        </div>

        <h2 style={{ marginBottom: '20px' }}>Meus Cursos</h2>

        {enrollments.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
          }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '1.1rem' }}>
              Você ainda não está matriculado em nenhum curso.
            </p>
            <Link href="/" className="btn btn-primary">
              Explorar Cursos
            </Link>
          </div>
        ) : (
          <div className="courses-grid">
            {enrollments.map(enrollment => (
              <Link
                key={enrollment.id}
                href={`/cursos/${enrollment.courses.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="course-card">
                  <div
                    className="course-thumb"
                    style={enrollment.courses.is_free
                      ? {}
                      : { background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }
                    }
                  >
                    {enrollment.courses.is_free ? '📚' : '⭐'}
                  </div>
                  <div className="course-body">
                    <h3>{enrollment.courses.title}</h3>
                    <p>{enrollment.courses.description}</p>
                    <div className="course-meta">
                      <span className={`badge ${enrollment.courses.is_free ? 'badge-free' : 'badge-premium'}`}>
                        {enrollment.courses.is_free ? 'Gratuito' : 'Premium'}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {enrollment.completed_at ? '✅ Concluído' : '📖 Em andamento'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {profile?.plan !== 'premium' && (
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, var(--bg-card) 100%)',
            border: '1px solid var(--primary)',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            marginTop: '48px',
          }}>
            <h2 style={{ marginBottom: '12px' }}>🚀 Faça Upgrade para Premium</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
              Acesse todos os cursos, incluindo conteúdo exclusivo, sem limitações.
            </p>
            <Link href="/planos" className="btn btn-primary">Quero ser Premium</Link>
          </div>
        )}
      </div>

      <footer className="footer">
        <div className="container">
          <p>© 2026 CursosOnline. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
