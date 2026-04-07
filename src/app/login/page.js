'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { createClient } from '@/lib/supabase-browser';
import GoogleAuthButton from '@/components/GoogleAuthButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
        <h1 style={{ fontFamily: "'Italiana', serif", fontWeight: 400 }}>Entrar</h1>
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
