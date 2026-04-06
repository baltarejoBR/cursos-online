'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Ola! Sou o assistente do Metodo Corpo Limpo. Tire suas duvidas sobre CDS, protocolos, dosagens e muito mais!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  async function handleSend(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setLoading(true);

    try {
      const res = await fetch(`/api/knowledge-base?q=${encodeURIComponent(question)}`);
      const data = await res.json();

      if (data.found && data.entries && data.entries.length > 0) {
        // Mostrar a melhor resposta
        const best = data.entries[0];
        setMessages(prev => [...prev, {
          role: 'bot',
          text: best.answer,
          category: best.category,
        }]);

        // Se houver mais resultados relacionados, mencionar
        if (data.entries.length > 1) {
          setMessages(prev => [...prev, {
            role: 'bot',
            text: `Encontrei mais ${data.entries.length - 1} resultado(s) relacionado(s). Quer que eu mostre?`,
            extras: data.entries.slice(1),
          }]);
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: 'Ainda nao tenho uma resposta para essa pergunta, mas ja registrei ela! O Gabriel vai responder em breve e a resposta ficara disponivel aqui. Enquanto isso, tente perguntar de outra forma ou explore outros temas.',
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: 'Desculpe, ocorreu um erro ao buscar a resposta. Tente novamente em instantes.',
      }]);
    }

    setLoading(false);
  }

  function showExtras(extras) {
    const newMessages = extras.map(entry => ({
      role: 'bot',
      text: `**${entry.question}**\n\n${entry.answer}`,
      category: entry.category,
    }));
    setMessages(prev => [...prev.filter(m => !m.extras), ...newMessages]);
  }

  return (
    <>
      {/* Botao flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--primary, #6366f1)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          zIndex: 1000,
          transition: 'transform 0.2s',
          transform: isOpen ? 'rotate(45deg)' : 'none',
        }}
      >
        {isOpen ? '+' : '?'}
      </button>

      {/* Janela do chat */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 48px)',
          height: '500px',
          maxHeight: 'calc(100vh - 140px)',
          background: 'var(--bg-card, #1a1a2e)',
          border: '1px solid var(--border, #2a2a4a)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 999,
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.3)',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'var(--primary, #6366f1)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
            }}>
              ?
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Tira-Duvidas CDS</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Respostas instantaneas</div>
            </div>
          </div>

          {/* Mensagens */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.map((msg, i) => (
              <div key={i}>
                <div style={{
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: msg.role === 'user'
                    ? 'var(--primary, #6366f1)'
                    : 'var(--bg, #0f0f23)',
                  color: msg.role === 'user' ? 'white' : 'var(--text, #e0e0e0)',
                  marginLeft: msg.role === 'user' ? 'auto' : '0',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  border: msg.role === 'bot' ? '1px solid var(--border, #2a2a4a)' : 'none',
                }}>
                  {msg.text}
                  {msg.category && (
                    <span style={{
                      display: 'inline-block',
                      marginTop: '6px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: 'var(--primary, #6366f1)',
                      fontSize: '0.7rem',
                    }}>
                      {msg.category}
                    </span>
                  )}
                </div>
                {msg.extras && (
                  <button
                    onClick={() => showExtras(msg.extras)}
                    style={{
                      marginTop: '6px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: 'var(--primary, #6366f1)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    Mostrar mais {msg.extras.length} resultado(s)
                  </button>
                )}
              </div>
            ))}
            {loading && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '14px 14px 14px 4px',
                background: 'var(--bg, #0f0f23)',
                border: '1px solid var(--border, #2a2a4a)',
                maxWidth: '85%',
                fontSize: '0.9rem',
                color: 'var(--text-muted, #888)',
              }}>
                Buscando resposta...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border, #2a2a4a)',
            display: 'flex',
            gap: '8px',
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Digite sua duvida sobre CDS..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border, #2a2a4a)',
                background: 'var(--bg, #0f0f23)',
                color: 'var(--text, #e0e0e0)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                background: 'var(--primary, #6366f1)',
                color: 'white',
                border: 'none',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.5 : 1,
                fontSize: '0.9rem',
                fontWeight: '600',
              }}
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
}
