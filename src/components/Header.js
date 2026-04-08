'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/storage';
import { createClient } from '@/lib/supabase-browser';

const ADMIN_EMAILS = ['baltarejo@gmail.com'];

const NAV_ITEMS = [
  { label: 'Início', href: '/' },
  {
    label: 'Sobre o Dioxi',
    key: 'sobre',
    children: [
      { label: 'O que é Dioxi?', href: '/o-que-e-cds', icon: '🧪', desc: 'Entenda o que é e como funciona' },
      { label: 'Depoimentos', href: '/depoimentos', icon: '💬', desc: 'Veja o que nossos alunos dizem' },
    ],
  },
  {
    label: 'Loja',
    key: 'loja',
    children: [
      { label: 'Comprar Produtos', href: '/loja', icon: '🛒', desc: 'SDC, Ormus, DMSO e kits completos' },
      { label: 'Nossos Produtos', href: '/loja/nossos-produtos', icon: '📋', desc: 'Entenda a diferença entre CDS, Ormus e DMSO' },
    ],
  },
  {
    label: 'Aprender',
    key: 'aprender',
    children: [
      { label: 'Universidade', href: '/universidade', icon: '🎓', desc: 'Conteúdo gratuito para iniciantes' },
      { label: 'Cursos', href: '/planos', icon: '📚', desc: 'Cursos completos e especializados' },
      { label: 'Consultoria', href: '/produto/mentoria', icon: '👨‍⚕️', desc: 'Mentoria personalizada' },
    ],
  },
];

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const pathname = usePathname();
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

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const isDropdownActive = (children) => children.some(child => isActive(child.href));

  const navLinkClass = (href) => `nav-link${isActive(href) ? ' nav-link-active' : ''}`;

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (key) => {
    setOpenSubmenu(prev => prev === key ? null : key);
  };

  const handleDropdownKeyDown = (e, key) => {
    if (e.key === 'Escape') {
      setOpenSubmenu(null);
      e.currentTarget.querySelector('.nav-dropdown-trigger')?.focus();
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image src={getImageUrl('logos/logo-metodo-corpo-limpo.png')} alt="Método Corpo Limpo" width={40} height={40} style={{ borderRadius: '8px' }} />
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
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div
                key={item.key}
                className="nav-dropdown"
                onKeyDown={(e) => handleDropdownKeyDown(e, item.key)}
              >
                <button
                  className={`nav-dropdown-trigger${isDropdownActive(item.children) ? ' nav-dropdown-trigger-active' : ''}`}
                  onClick={() => toggleSubmenu(item.key)}
                  aria-expanded={openSubmenu === item.key}
                  aria-haspopup="true"
                >
                  {item.label}
                  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div
                  className={`nav-dropdown-menu${openSubmenu === item.key ? ' nav-dropdown-menu-open' : ''}`}
                  role="menu"
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`nav-dropdown-item${isActive(child.href) ? ' nav-dropdown-item-active' : ''}`}
                      onClick={closeMenu}
                      role="menuitem"
                    >
                      <span className="nav-dropdown-icon">{child.icon}</span>
                      <span className="nav-dropdown-text">
                        <span className="nav-dropdown-label">{child.label}</span>
                        <span className="nav-dropdown-desc">{child.desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={navLinkClass(item.href)}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            )
          )}
          {user ? (
            <>
              <Link href="/minha-area" className={navLinkClass('/minha-area')} onClick={closeMenu}>Minha Área</Link>
              {ADMIN_EMAILS.includes(user.email) && (
                <Link href="/admin" className={navLinkClass('/admin')} onClick={closeMenu}>Admin</Link>
              )}
              <button onClick={() => { closeMenu(); handleLogout(); }} className="nav-logout">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={navLinkClass('/login')} onClick={closeMenu}>Entrar</Link>
              <Link href="/cadastro" onClick={closeMenu} className="btn btn-gold btn-sm">
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
