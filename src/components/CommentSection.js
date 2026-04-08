'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CommentSection({ postId, user, isAdmin, articleTitle }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [isQuestion, setIsQuestion] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setComments(data);
      }
    } catch (err) {
      console.error('Erro ao carregar comentarios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content, isQuestion }),
      });
      if (res.ok) {
        setContent('');
        setIsQuestion(false);
        await fetchComments();
      }
    } catch (err) {
      console.error('Erro ao enviar comentario:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId) => {
    if (!replyContent.trim()) return;
    setReplySubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: replyContent, isQuestion: false, parentId }),
      });
      if (res.ok) {
        setReplyContent('');
        setReplyingTo(null);
        await fetchComments();
      }
    } catch (err) {
      console.error('Erro ao enviar resposta:', err);
    } finally {
      setReplySubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const topLevelComments = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId) => comments.filter((c) => c.parent_id === parentId);

  const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(`Ola! Tenho uma duvida sobre: ${articleTitle}`)}`;

  return (
    <div style={{ marginTop: 48 }}>
      <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
        Perguntas e Comentarios
      </h3>

      {/* WhatsApp button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          background: '#25d366',
          color: '#fff',
          fontFamily: 'var(--font-ui)',
          fontWeight: 600,
          fontSize: 15,
          padding: '12px 24px',
          borderRadius: 12,
          textDecoration: 'none',
          marginBottom: 28,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Tire sua duvida pelo WhatsApp
      </a>

      {/* Comment form or login prompt */}
      {user ? (
        <form onSubmit={handleSubmit} style={{
          background: 'var(--bg-card)',
          borderRadius: 20,
          padding: 24,
          marginBottom: 32,
        }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Faca uma pergunta ou deixe um comentario..."
            rows={4}
            style={{
              width: '100%',
              background: 'var(--bg-input)',
              border: 'none',
              borderRadius: 12,
              padding: 16,
              fontFamily: 'var(--font-ui)',
              fontSize: 15,
              color: 'inherit',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 16,
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => setIsQuestion(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: !isQuestion ? 'var(--cat-estudos)' : 'var(--bg-input)',
                  color: !isQuestion ? '#fff' : 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                Comentario
              </button>
              <button
                type="button"
                onClick={() => setIsQuestion(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: isQuestion ? 'var(--cat-ciencia)' : 'var(--bg-input)',
                  color: isQuestion ? '#fff' : 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                Pergunta
              </button>
            </div>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              style={{
                padding: '10px 28px',
                borderRadius: 10,
                border: 'none',
                fontFamily: 'var(--font-ui)',
                fontSize: 14,
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                background: 'var(--cat-ciencia)',
                color: '#fff',
                opacity: submitting || !content.trim() ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {submitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      ) : (
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 20,
          padding: 24,
          marginBottom: 32,
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, marginBottom: 12 }}>
            Faca login para participar da discussao
          </p>
          <Link
            href="/login"
            style={{
              display: 'inline-block',
              padding: '10px 28px',
              borderRadius: 10,
              background: 'var(--cat-ciencia)',
              color: '#fff',
              fontFamily: 'var(--font-ui)',
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            Entrar
          </Link>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, opacity: 0.6 }}>Carregando comentarios...</p>
      ) : topLevelComments.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, opacity: 0.6 }}>
          Nenhum comentario ainda. Seja o primeiro!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {topLevelComments.map((comment) => (
            <div key={comment.id}>
              {/* Parent comment */}
              <div style={{
                background: 'var(--bg)',
                borderRadius: 16,
                padding: 20,
                borderLeft: `4px solid ${comment.is_question ? 'var(--cat-ciencia)' : 'var(--cat-estudos)'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: comment.is_question ? 'var(--cat-ciencia)' : 'var(--cat-estudos)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 700,
                    fontSize: 15,
                    flexShrink: 0,
                  }}>
                    {getInitial(comment.user_name)}
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 14 }}>
                      {comment.user_name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, opacity: 0.5, marginLeft: 8 }}>
                      {formatDate(comment.created_at)}
                    </span>
                    {comment.is_question && (
                      <span style={{
                        marginLeft: 8,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: 'var(--font-ui)',
                        background: 'var(--cat-ciencia)',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: 6,
                      }}>
                        Pergunta
                      </span>
                    )}
                  </div>
                </div>
                <p style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 14,
                  lineHeight: 1.6,
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}>
                  {comment.content}
                </p>

                {/* Admin reply button */}
                {isAdmin && (
                  <button
                    onClick={() => {
                      setReplyingTo(replyingTo === comment.id ? null : comment.id);
                      setReplyContent('');
                    }}
                    style={{
                      marginTop: 12,
                      padding: '6px 14px',
                      borderRadius: 8,
                      border: 'none',
                      background: 'var(--bg-input)',
                      fontFamily: 'var(--font-ui)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: 'inherit',
                    }}
                  >
                    {replyingTo === comment.id ? 'Cancelar' : 'Responder'}
                  </button>
                )}

                {/* Inline reply form */}
                {replyingTo === comment.id && (
                  <div style={{ marginTop: 12 }}>
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Escreva sua resposta..."
                      rows={3}
                      style={{
                        width: '100%',
                        background: 'var(--bg-input)',
                        border: 'none',
                        borderRadius: 10,
                        padding: 12,
                        fontFamily: 'var(--font-ui)',
                        fontSize: 14,
                        color: 'inherit',
                        resize: 'vertical',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      onClick={() => handleReply(comment.id)}
                      disabled={replySubmitting || !replyContent.trim()}
                      style={{
                        marginTop: 8,
                        padding: '8px 20px',
                        borderRadius: 8,
                        border: 'none',
                        background: 'var(--cat-ciencia)',
                        color: '#fff',
                        fontFamily: 'var(--font-ui)',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: replySubmitting ? 'not-allowed' : 'pointer',
                        opacity: replySubmitting || !replyContent.trim() ? 0.5 : 1,
                      }}
                    >
                      {replySubmitting ? 'Enviando...' : 'Enviar resposta'}
                    </button>
                  </div>
                )}
              </div>

              {/* Replies */}
              {getReplies(comment.id).map((reply) => (
                <div
                  key={reply.id}
                  style={{
                    background: 'var(--bg)',
                    borderRadius: 16,
                    padding: 20,
                    marginTop: 8,
                    marginLeft: 40,
                    borderLeft: '4px solid var(--cat-estudos)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--cat-estudos)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-ui)',
                      fontWeight: 700,
                      fontSize: 13,
                      flexShrink: 0,
                    }}>
                      {getInitial(reply.user_name)}
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13 }}>
                        {reply.user_name}
                      </span>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, opacity: 0.5, marginLeft: 8 }}>
                        {formatDate(reply.created_at)}
                      </span>
                    </div>
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 14,
                    lineHeight: 1.6,
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {reply.content}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
