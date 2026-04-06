'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-browser';

const ADMIN_EMAILS = ['baltarejo@gmail.com'];

export default function Header() {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image src="/images/logo-metodo-corpo-limpo.png" alt="Método Corpo Limpo" width={40} height={40} />
          <span>Método Corpo Limpo</span>
        </Link>
        <nav className="nav">
          <Link href="/">Inicio</Link>
          <Link href="/o-que-e-cds">O que e CDS?</Link>
          <Link href="/planos">Produtos</Link>
          {user ? (
            <>
              <Link href="/minha-area">Minha Área</Link>
              {ADMIN_EMAILS.includes(user.email) && (
                <Link href="/admin">Admin</Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Entrar</Link>
              <Link href="/cadastro" className="btn btn-primary btn-sm">
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
