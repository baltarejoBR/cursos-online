'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import MuxVideoPlayer from '@/components/MuxVideoPlayer';
import { createClient } from '@/lib/supabase-browser';

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showHtmlContent, setShowHtmlContent] = useState(false);
  const [htmlError, setHtmlError] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    // Buscar curso
    const { data: courseData } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    setCourse(courseData);

    // Buscar aulas
    const { data: lessonsData } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', id)
      .order('order_index');

    setLessons(lessonsData || []);

    // Verificar usuário
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser);

    if (currentUser) {
      // Buscar perfil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      setProfile(profileData);

      // Verificar matrícula
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('course_id', id)
        .single();

      setEnrolled(!!enrollment);
    }

    setLoading(false);
  }

  async function handleEnroll() {
    if (!user) {
      router.push('/login');
      return;
    }

    setEnrolling(true);
    await supabase.from('enrollments').insert({
      user_id: user.id,
      course_id: id,
    });
    setEnrolled(true);
    setEnrolling(false);
  }

  function canAccessHtmlCourse() {
    if (!user) return false;
    if (profile?.plan === 'premium') return true;
    return false;
  }

  async function handleOpenHtmlContent() {
    if (!canAccessHtmlCourse()) return;
    setHtmlError(null);

    // Testar se o acesso funciona antes de abrir o iframe
    try {
      const res = await fetch(`/api/conteudo/${course.content_slug}`);
      if (res.ok) {
        setShowHtmlContent(true);
      } else {
        const data = await res.json();
        setHtmlError(data.error || 'Erro ao acessar conteudo.');
      }
    } catch (err) {
      setHtmlError('Erro de conexao. Tente novamente.');
    }
  }

  function canAccessLesson(lesson) {
    if (!lesson) return false;
    if (lesson.is_preview) return true;
    if (course?.is_free) return true;
    if (!user) return false;
    if (profile?.plan === 'premium') return true;
    if (enrolled && course?.is_free) return true;
    return false;
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Carregando curso...</p>
        </div>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h1>Curso não encontrado</h1>
          <Link href="/" className="btn btn-gold" style={{ marginTop: '20px' }}>
            Voltar para Home
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container course-detail">
        <div className="course-header">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
            <span className={`badge ${course.is_free ? 'badge-free' : 'badge-premium'}`}>
              {course.is_free ? 'Gratuito' : 'Premium'}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{course.category}</span>
          </div>
          <h1>{course.title}</h1>
          <p>{course.description}</p>

          {!course.is_free && !enrolled && (
            <div style={{ marginTop: '24px' }}>
              {user ? (
                profile?.plan === 'premium' ? (
                  <p style={{ color: 'var(--success)' }}>✅ Você tem acesso Premium!</p>
                ) : (
                  <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <p style={{ marginBottom: '12px' }}>
                      Este é um curso <strong>premium</strong>. Faça upgrade para acessar todo o conteúdo.
                    </p>
                    <Link href="/planos" className="btn btn-gold">Fazer Upgrade para Premium</Link>
                  </div>
                )
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link href="/login" className="btn btn-gold">Entrar para Acessar</Link>
                  <Link href="/cadastro" className="btn btn-outline">Cadastrar</Link>
                </div>
              )}
            </div>
          )}

          {course.is_free && user && !enrolled && (
            <button
              onClick={handleEnroll}
              className="btn btn-gold"
              disabled={enrolling}
              style={{ marginTop: '24px' }}
            >
              {enrolling ? 'Matriculando...' : '📝 Matricular-se Grátis'}
            </button>
          )}

          {enrolled && (
            <p style={{ color: 'var(--success)', marginTop: '16px' }}>✅ Você está matriculado neste curso</p>
          )}

          {/* Botao de acesso para cursos com HTML proprio (premium) */}
          {course.content_slug && !course.is_free && (
            <div style={{ marginTop: '24px' }}>
              {canAccessHtmlCourse() ? (
                <button
                  onClick={handleOpenHtmlContent}
                  className="btn btn-gold"
                  style={{ fontSize: '1.1rem', padding: '14px 32px' }}
                >
                  {showHtmlContent ? '📖 Conteudo aberto abaixo' : '📖 Acessar Conteudo Completo'}
                </button>
              ) : !user ? (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link href="/login" className="btn btn-gold">Entrar para Acessar</Link>
                  <Link href="/cadastro" className="btn btn-outline">Cadastrar</Link>
                </div>
              ) : (
                <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <p style={{ marginBottom: '12px' }}>
                    Este conteudo e exclusivo para assinantes <strong>Premium</strong>.
                  </p>
                  <button className="btn btn-gold">Fazer Upgrade para Premium</button>
                </div>
              )}
              {htmlError && (
                <p style={{ color: '#e53e3e', marginTop: '12px' }}>{htmlError}</p>
              )}
            </div>
          )}
        </div>

        {/* Iframe com conteudo HTML protegido */}
        {showHtmlContent && course.content_slug && (
          <div style={{
            marginTop: '24px',
            border: '2px solid var(--primary)',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'white',
          }}>
            <div style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'var(--font-ui, sans-serif)',
            }}>
              <span style={{ fontWeight: 600 }}>📖 {course.title}</span>
              <button
                onClick={() => setShowHtmlContent(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                Fechar
              </button>
            </div>
            <iframe
              src={`/api/conteudo/${course.content_slug}`}
              style={{
                width: '100%',
                height: '80vh',
                border: 'none',
              }}
              title={course.title}
            />
          </div>
        )}

        {/* Lista de aulas (para cursos tradicionais sem content_slug) */}
        {!course.content_slug && (
        <>
        <h2 style={{ marginBottom: '20px' }}>Aulas ({lessons.length})</h2>
        <ul className="lessons-list">
          {lessons.map((lesson, index) => {
            const hasAccess = canAccessLesson(lesson);
            return (
              <li
                key={lesson.id}
                className={`lesson-item ${!hasAccess ? 'locked' : ''}`}
                onClick={() => hasAccess && setSelectedLesson(selectedLesson?.id === lesson.id ? null : lesson)}
                style={{ cursor: hasAccess ? 'pointer' : 'default' }}
              >
                <div className="lesson-info">
                  <h3>
                    <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {lesson.title}
                  </h3>
                  <span>
                    {lesson.is_preview && '👁️ Preview gratuito'}
                    {!lesson.is_preview && course.is_free && '📖 Gratuito'}
                    {!lesson.is_preview && !course.is_free && !hasAccess && '🔒 Premium'}
                  </span>
                </div>
                <span className="lock-icon">
                  {hasAccess ? '▶️' : '🔒'}
                </span>
              </li>
            );
          })}
        </ul>

        {selectedLesson && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--primary)',
            borderRadius: '12px',
            padding: '32px',
            marginTop: '24px',
          }}>
            <h2 style={{ marginBottom: '16px' }}>{selectedLesson.title}</h2>
            {selectedLesson.video_url && (
              <div style={{ marginBottom: '20px' }}>
                <MuxVideoPlayer
                  playbackId={selectedLesson.video_url}
                  courseId={id}
                  lessonId={selectedLesson.id}
                  title={selectedLesson.title}
                />
              </div>
            )}
            <div style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
              {selectedLesson.content}
            </div>
          </div>
        )}
        </>
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
