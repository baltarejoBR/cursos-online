'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { createClient } from '@/lib/supabase-browser';
import GoogleAuthButton from '@/components/GoogleAuthButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const supabase = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Email ou senha incorretos.'
          : error.message
      );
      setLoading(false);
      return;
    }

    router.push('/minha-area');
    router.refresh();
  };

  return (
    <>
    <Header />
    <div className="form-page">
      <div className="form-card">
        {reason === 'auth_required' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
            border: '1px solid rgba(201,168,76,0.4)',
            borderLeft: '4px solid var(--gold)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}>
            <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>🔒</span>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                Conteúdo exclusivo para usuários cadastrados
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Entre na sua conta para desbloquear o vídeo. Não tem conta? <Link href="/cadastro?reason=auth_required" style={{ color: 'var(--gold-dark)', fontWeight: 600 }}>Cadastre-se grátis</Link>.
              </div>
            </div>
          </div>
        )}
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400 }}>Entrar</h1>
        <p className="subtitle">Acesse sua conta para continuar aprendendo.</p>

        {error && <div className="error-msg">{error}</div>}

        <GoogleAuthButton label="Entrar com Google" redirectTo="/minha-area" />

        <div className="divider">ou</div>

        <form onSubmit={handleLogin}>
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
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-gold btn-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="form-footer">
          Não tem conta? <Link href="/cadastro">Cadastre-se grátis</Link>
        </div>
      </div>
    </div>
    </>
  );
}
