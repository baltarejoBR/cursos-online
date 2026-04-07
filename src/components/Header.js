'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/storage';
import { createClient } from '@/lib/supabase-browser';

const ADMIN_EMAILS = ['baltarejo@gmail.com'];

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
          <Image src={getImageUrl('logos/logo-metodo-corpo-limpo.png')} alt="Método Corpo Limpo" width={40} height={40} />
          <span>Método Corpo Limpo</span>
        </Link>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link href="/o-que-e-cds" onClick={() => setMenuOpen(false)}>O que e Dioxi?</Link>
          <Link href="/loja" onClick={() => setMenuOpen(false)}>🛒 Comprar SDC</Link>
          <Link href="/universidade" onClick={() => setMenuOpen(false)}>🎓 Universidade</Link>
          <Link href="/planos?cat=cursos" onClick={() => setMenuOpen(false)}>📚 Cursos</Link>
          <Link href="/produto/mentoria" onClick={() => setMenuOpen(false)}>📞 Consultoria</Link>
          <Link href="/depoimentos" onClick={() => setMenuOpen(false)}>Depoimentos</Link>
          {user ? (
            <>
              <Link href="/minha-area" onClick={() => setMenuOpen(false)}>Minha Area</Link>
              {ADMIN_EMAILS.includes(user.email) && (
                <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="btn btn-outline btn-sm">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Entrar</Link>
              <Link href="/cadastro" onClick={() => setMenuOpen(false)} className="btn btn-cds btn-sm">
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
