'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/storage';
import { createClient } from '@/lib/supabase-browser';
import SearchModal from './SearchModal';

const ADMIN_EMAILS = ['baltarejo@gmail.com'];

const NAV_ITEMS = [
  { label: 'Início', href: '/' },
  {
    label: 'Sobre o Dioxi',
    key: 'sobre',
    triggerIcon: <svg viewBox="0 0 24 24" fill="none" style={{ width: 15, height: 15 }}><path d="M9 3h6v8l3 4H6l3-4V3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 3h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M8 21l1-4h6l1 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    children: [
      { label: 'O que é Dioxi?', href: '/o-que-e-cds', icon: '🧪', desc: 'Entenda o que é e por que é seguro' },
      { label: 'Depoimentos', href: '/depoimentos', icon: '💬', desc: 'Veja o que nossos alunos dizem' },
    ],
  },
  {
    label: 'Aprender',
    key: 'aprender',
    triggerIcon: <svg viewBox="0 0 24 24" fill="none" style={{ width: 15, height: 15 }}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    children: [
      { label: 'Universidade', href: '/universidade', icon: '🎓', desc: 'O primeiro CDS é grátis — o conhecimento também' },
      { label: 'Cursos e Livros', href: '/planos', icon: '📚', desc: 'Cursos, livros e consultoria' },
      { label: 'TEAmor', href: '/teamor', icon: '💙', desc: 'Curso para famílias de crianças atípicas' },
      { label: 'Consultoria', href: '/produto/mentoria', icon: '👨‍⚕️', desc: 'Conversa direta com o Gabriel' },
    ],
  },
  {
    label: 'Grupos de Detox',
    key: 'detox',
    triggerIcon: <svg viewBox="0 0 24 24" fill="none" style={{ width: 15, height: 15 }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M12 2a10 10 0 010 20" stroke="currentColor" strokeWidth="1.8" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>,
    children: [
      { label: 'Desparasitação Lunar', href: '/desparasitacao', icon: '🌑', desc: 'Protocolo P sincronizado com ciclos da lua' },
    ],
  },
  {
    label: 'Loja',
    key: 'loja',
    triggerIcon: <svg viewBox="0 0 24 24" fill="none" style={{ width: 15, height: 15 }}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 6h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    children: [
      { label: 'Comprar Produtos', href: '/loja', icon: '🛒', desc: 'SDC, Ormus, DMSO e kits completos' },
      { label: 'Nossos Produtos', href: '/loja/nossos-produtos', icon: '📋', desc: 'Entenda a diferença entre CDS, Ormus e DMSO' },
    ],
  },
];

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
                  {item.triggerIcon}
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
          <button
            className="nav-search-btn"
            onClick={() => { closeMenu(); setSearchOpen(true); }}
            aria-label="Buscar"
            title="Buscar (Ctrl+K)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
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
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
