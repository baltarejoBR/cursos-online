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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
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

    // Salvar telegram_username no perfil se informado
    if (telegramUsername.trim() && data.user) {
      const cleanUsername = telegramUsername.trim().replace(/^@/, '');
      await supabase
        .from('profiles')
        .update({ telegram_username: cleanUsername })
        .eq('id', data.user.id);
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <>
      <Header />
      <div className="form-page">
        <div className="form-card" style={{ textAlign: 'center' }}>
          <h1>Cadastro realizado!</h1>
          <p className="subtitle">
            Enviamos um link de confirmação para <strong>{email}</strong>.
            Verifique sua caixa de entrada (e spam) para ativar sua conta.
          </p>
          <Link href="/login" className="btn btn-primary">
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
        <h1>Criar Conta</h1>
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
            <label htmlFor="telegram">Usuário do Telegram (opcional)</label>
            <input
              id="telegram"
              type="text"
              placeholder="@seuusuario"
              value={telegramUsername}
              onChange={(e) => setTelegramUsername(e.target.value)}
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Necessario para acesso ao grupo exclusivo TEAmor no Telegram.
            </small>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Criar Conta Grátis'}
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
