'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TYPE_LABELS = {
  paginas: { label: 'Páginas', icon: '📄' },
  produtos: { label: 'Produtos', icon: '🛒' },
  blog: { label: 'Artigos', icon: '📝' },
  conhecimento: { label: 'Perguntas & Respostas', icon: '❓' },
};

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const router = useRouter();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults(null);
      setAiResponse(null);
      setSelectedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  const doSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults(null);
      setAiResponse(null);
      return;
    }

    setLoading(true);
    try {
      const mode = aiMode ? 'ai' : 'text';
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&mode=${mode}`);
      const data = await res.json();

      if (data.results) {
        setResults(data.results);
        if (data.results.ai) {
          setAiResponse(data.results.ai.response);
        }
      }
    } catch {
      setResults(null);
    }
    setLoading(false);
  }, [aiMode]);

  // Debounce input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doSearch(query);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, doSearch]);

  // Flatten results for keyboard navigation
  const allItems = results
    ? [
        ...(results.paginas || []),
        ...(results.produtos || []),
        ...(results.blog || []),
        ...(results.conhecimento || []),
      ]
    : [];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const item = allItems[selectedIndex];
      if (item?.url) {
        if (item.url.startsWith('http')) {
          window.open(item.url, '_blank');
        } else {
          router.push(item.url);
        }
        onClose();
      }
    } else if (e.key === 'Enter' && query.length >= 2 && selectedIndex === -1) {
      e.preventDefault();
      router.push(`/busca?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  const goToFullSearch = () => {
    if (query.length >= 2) {
      router.push(`/busca?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  const totalResults =
    (results?.produtos?.length || 0) +
    (results?.blog?.length || 0) +
    (results?.conhecimento?.length || 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="search-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="search-modal">
        {/* Header */}
        <div className="search-modal-header">
          <div className="search-input-wrapper">
            <svg className="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={aiMode ? 'Pergunte qualquer coisa sobre CDS...' : 'Buscar produtos, artigos, protocolos...'}
              className="search-input"
              autoComplete="off"
            />
            {query && (
              <button className="search-clear" onClick={() => { setQuery(''); setResults(null); setAiResponse(null); inputRef.current?.focus(); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>

          {/* AI toggle */}
          <button
            className={`search-ai-toggle ${aiMode ? 'search-ai-toggle-active' : ''}`}
            onClick={() => { setAiMode(!aiMode); setAiResponse(null); }}
            title={aiMode ? 'Desativar busca IA' : 'Ativar busca IA'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2a4 4 0 014 4c0 1.95-2 3-2 5h-4c0-2-2-3.05-2-5a4 4 0 014-4z"/>
              <line x1="10" y1="14" x2="14" y2="14"/>
              <line x1="10" y1="17" x2="14" y2="17"/>
              <line x1="11" y1="20" x2="13" y2="20"/>
            </svg>
            <span>IA</span>
          </button>
        </div>

        {/* Body */}
        <div className="search-modal-body">
          {/* Loading */}
          {loading && (
            <div className="search-loading">
              <div className="search-loading-spinner" />
              <span>Buscando{aiMode ? ' com IA' : ''}...</span>
            </div>
          )}

          {/* AI Response */}
          {aiMode && aiResponse && !loading && (
            <div className="search-ai-response">
              <div className="search-ai-response-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 18, height: 18 }}>
                  <path d="M12 2a4 4 0 014 4c0 1.95-2 3-2 5h-4c0-2-2-3.05-2-5a4 4 0 014-4z"/>
                  <line x1="10" y1="14" x2="14" y2="14"/>
                  <line x1="10" y1="17" x2="14" y2="17"/>
                  <line x1="11" y1="20" x2="13" y2="20"/>
                </svg>
                <span>Resposta IA</span>
              </div>
              <div className="search-ai-response-text">{aiResponse}</div>
            </div>
          )}

          {/* No query */}
          {!query && !loading && (
            <div className="search-empty">
              <div className="search-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 40, height: 40, opacity: 0.4 }}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p>Digite para buscar em produtos, artigos e base de conhecimento</p>
              <div className="search-shortcuts">
                <span className="search-shortcut-key">Enter</span> para busca completa
                <span className="search-shortcut-key">Esc</span> para fechar
              </div>
            </div>
          )}

          {/* No results */}
          {query && query.length >= 2 && !loading && totalResults === 0 && !aiResponse && (
            <div className="search-empty">
              <p>Nenhum resultado para &ldquo;{query}&rdquo;</p>
              {!aiMode && (
                <button className="search-try-ai" onClick={() => { setAiMode(true); doSearch(query); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 16, height: 16 }}>
                    <path d="M12 2a4 4 0 014 4c0 1.95-2 3-2 5h-4c0-2-2-3.05-2-5a4 4 0 014-4z"/>
                    <line x1="10" y1="14" x2="14" y2="14"/>
                  </svg>
                  Tentar com IA
                </button>
              )}
            </div>
          )}

          {/* Results grouped by type */}
          {results && !loading && Object.entries(TYPE_LABELS).map(([key, meta]) => {
            const items = results[key];
            if (!items || items.length === 0) return null;

            return (
              <div key={key} className="search-group">
                <div className="search-group-header">
                  <span className="search-group-icon">{meta.icon}</span>
                  <span className="search-group-label">{meta.label}</span>
                  <span className="search-group-count">{items.length}</span>
                </div>
                {items.slice(0, 5).map((item, i) => {
                  const globalIndex = allItems.indexOf(item);
                  return (
                    <SearchResultItem
                      key={item.id}
                      item={item}
                      selected={globalIndex === selectedIndex}
                      onClose={onClose}
                    />
                  );
                })}
              </div>
            );
          })}

          {/* Ver todos os resultados */}
          {totalResults > 0 && !loading && (
            <button className="search-view-all" onClick={goToFullSearch}>
              Ver todos os resultados ({totalResults})
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function SearchResultItem({ item, selected, onClose }) {
  const isExternal = item.url?.startsWith('http');

  const content = (
    <div className={`search-result-item ${selected ? 'search-result-item-selected' : ''}`}>
      {item.image && (
        <div className="search-result-image">
          <img src={item.image} alt="" />
        </div>
      )}
      <div className="search-result-content">
        <div className="search-result-title">{item.title}</div>
        {item.description && (
          <div className="search-result-desc">{item.description}</div>
        )}
        <div className="search-result-meta">
          {item.price && <span className="search-result-price">{item.price}</span>}
          {item.badge && <span className="search-result-badge">{item.badge}</span>}
          {item.category && <span className="search-result-category">{item.category}</span>}
          {item.readingTime && <span>{item.readingTime} min de leitura</span>}
        </div>
      </div>
      <svg className="search-result-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  );

  if (!item.url) {
    return <div className="search-result-link">{content}</div>;
  }

  if (isExternal) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="search-result-link" onClick={onClose}>
        {content}
      </a>
    );
  }

  return (
    <Link href={item.url} className="search-result-link" onClick={onClose}>
      {content}
    </Link>
  );
}
