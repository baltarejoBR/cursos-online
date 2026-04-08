'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { createClient } from '@/lib/supabase-browser';
import GoogleAuthButton from '@/components/GoogleAuthButton';

export default function CadastroPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [howKnew, setHowKnew] = useState('');
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (value) => {
    setInterests(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };
  const supabase = createClient();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Salvar campos extras no perfil
    if (data.user) {
      const updates = {};
      if (telegramUsername.trim()) updates.telegram_username = telegramUsername.trim().replace(/^@/, '');
      if (whatsapp.trim()) updates.whatsapp_number = whatsapp.trim();
      if (Object.keys(updates).length > 0) {
        await supabase.from('profiles').update(updates).eq('id', data.user.id);
      }
    }

    // Enviar email de boas-vindas + criar contato no CRM e Brevo
    fetch('/api/welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name: fullName,
        whatsapp: whatsapp.trim() || null,
        howKnew: howKnew || null,
        interests: interests.length > 0 ? interests : null,
        userId: data.user?.id || null,
      }),
    }).catch(() => {});

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <>
      <Header />
      <div className="form-page">
        <div className="form-card" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400 }}>Cadastro realizado!</h1>
          <p className="subtitle">
            Enviamos um link de confirmação para <strong>{email}</strong>.
            Verifique sua caixa de entrada (e spam) para ativar sua conta.
          </p>
          <Link href="/login" className="btn btn-gold">
            Ir para Login
          </Link>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
    <Header />
    <div className="form-page">
      <div className="form-card">
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400 }}>Criar Conta</h1>
        <p className="subtitle">Cadastre-se grátis e comece a aprender agora.</p>

        {error && <div className="error-msg">{error}</div>}

        <GoogleAuthButton label="Cadastrar com Google" redirectTo="/minha-area" />

        <div className="divider">ou</div>

        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="name">Nome completo</label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="whatsapp">WhatsApp (opcional)</label>
            <input
              id="whatsapp"
              type="tel"
              placeholder="(11) 99999-9999"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Para receber novidades e suporte direto.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="telegram">Telegram (opcional)</label>
            <input
              id="telegram"
              type="text"
              placeholder="@seuusuario"
              value={telegramUsername}
              onChange={(e) => setTelegramUsername(e.target.value)}
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Para participar do grupo da comunidade.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="howKnew">Como conheceu o CDS?</label>
            <select
              id="howKnew"
              value={howKnew}
              onChange={(e) => setHowKnew(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', fontSize: '0.95rem' }}
            >
              <option value="">Selecione...</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="amigos">Amigos / Familia</option>
              <option value="google">Google / Pesquisa</option>
              <option value="forum">Forum CDS</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label>O que voce busca? (opcional)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
              {[
                { value: 'aprender', label: 'Aprender sobre CDS' },
                { value: 'comprar', label: 'Comprar produtos' },
                { value: 'consultoria', label: 'Consultoria individual' },
                { value: 'animais', label: 'Protocolos para animais' },
                { value: 'pesquisa', label: 'Pesquisa cientifica' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleInterest(opt.value)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: interests.includes(opt.value) ? '2px solid var(--gold)' : '1px solid var(--border)',
                    background: interests.includes(opt.value) ? 'rgba(201, 168, 76, 0.1)' : 'var(--bg-card)',
                    color: interests.includes(opt.value) ? 'var(--gold)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: interests.includes(opt.value) ? 600 : 400,
                    transition: 'all 0.2s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-gold btn-full" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Criar Conta Gratis'}
          </button>
        </form>

        <div className="form-footer">
          Já tem conta? <Link href="/login">Faça login</Link>
        </div>
      </div>
    </div>
    </>
  );
}
