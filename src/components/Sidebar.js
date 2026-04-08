'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const MENU_ITEMS = [
  // Sempre visíveis
  { id: 'inicio', label: 'Início', icon: '🏠', href: '/minha-area', free: true },
  { id: 'iniciantes', label: 'Para Iniciantes', icon: '📖', href: '/minha-area/iniciantes', free: true },
  // Separador
  { id: 'separator', type: 'separator' },
  // Condicionais
  { id: 'cursos', label: 'Meus Cursos', icon: '🎓', href: '/minha-area#cursos', requiresCategory: ['cursos'] },
  { id: 'livros', label: 'Meus Livros', icon: '📚', href: '/minha-area#livros', requiresCategory: ['livros'] },
  { id: 'consultoria', label: 'Consultoria & Mentoria', icon: '📋', href: '/minha-area/minhas-consultorias', requiresCategory: ['servicos'] },
  // Sempre visível - por último
  { id: 'comunidade', label: 'Comunidades', icon: '👥', href: '/minha-area/comunidade', free: true },
];

export default function Sidebar({ userCategories = [] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href) {
    if (href === '/minha-area') return pathname === '/minha-area';
    return pathname.startsWith(href.split('#')[0]) && href !== '/minha-area';
  }

  function hasAccess(item) {
    if (item.free) return true;
    if (!item.requiresCategory) return true;
    return item.requiresCategory.some(cat => userCategories.includes(cat));
  }

  return (
    <>
      {/* Botão mobile */}
      <button
        className="sidebar-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Menu"
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <nav className="sidebar-nav">
          {MENU_ITEMS.map((item) => {
            if (item.type === 'separator') {
              return <div key={item.id} className="sidebar-separator" />;
            }

            const accessible = hasAccess(item);
            const active = isActive(item.href);

            if (accessible) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`sidebar-item ${active ? 'sidebar-item-active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`sidebar-item sidebar-item-locked ${active ? 'sidebar-item-active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
                <span className="sidebar-lock">🔒</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
