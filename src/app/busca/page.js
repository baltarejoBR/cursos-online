'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

const TYPES = [
  { key: 'all', label: 'Tudo', icon: '🔍' },
  { key: 'paginas', label: 'Páginas', icon: '📄' },
  { key: 'produtos', label: 'Produtos', icon: '🛒' },
  { key: 'blog', label: 'Artigos', icon: '📝' },
  { key: 'conhecimento', label: 'Perguntas & Respostas', icon: '❓' },
];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState('all');
  const [aiMode, setAiMode] = useState(false);
  const [results, setResults] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const doSearch = useCallback(async (q, type, ai) => {
    if (!q || q.length < 2) {
      setResults(null);
      setAiResponse(null);
      return;
    }

    setLoading(true);
    try {
      const mode = ai ? 'ai' : 'text';
      const typeParam = type !== 'all' ? `&type=${type}` : '';
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&mode=${mode}${typeParam}`);
      const data = await res.json();

      if (data.results) {
        setResults(data.results);
        if (data.results.ai) {
          setAiResponse(data.results.ai.response);
        } else {
          setAiResponse(null);
        }
      }
    } catch {
      setResults(null);
    }
    setLoading(false);
  }, []);

  // Search on mount if query param exists
  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery, activeType, aiMode);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.length >= 2) {
      router.replace(`/busca?q=${encodeURIComponent(query)}`, { scroll: false });
      doSearch(query, activeType, aiMode);
    }
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    if (query.length >= 2) {
      doSearch(query, type, aiMode);
    }
  };

  const handleAiToggle = () => {
    const newMode = !aiMode;
    setAiMode(newMode);
    if (query.length >= 2) {
      doSearch(query, activeType, newMode);
    }
  };

  const allItems = results
    ? [
        ...(results.paginas || []),
        ...(results.produtos || []),
        ...(results.blog || []),
        ...(results.conhecimento || []),
      ]
    : [];

  const totalResults = allItems.length;

  return (
    <>
      <Header />
      <main className="busca-page">
        <div className="busca-container">
          {/* Title */}
          <h1 className="busca-title">Busca Avançada</h1>
          <p className="busca-subtitle">
            Encontre produtos, artigos e respostas sobre CDS e Terapias Bio-oxidativas
          </p>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="busca-form">
            <div className="busca-input-wrapper">
              <svg className="busca-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="O que você está procurando?"
                className="busca-input"
                autoFocus
              />
              {query && (
                <button type="button" className="busca-clear" onClick={() => { setQuery(''); setResults(null); setAiResponse(null); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
              <button type="submit" className="busca-submit" disabled={query.length < 2}>
                Buscar
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="busca-filters">
            <div className="busca-types">
              {TYPES.map((t) => (
                <button
                  key={t.key}
                  className={`busca-type-btn ${activeType === t.key ? 'busca-type-btn-active' : ''}`}
                  onClick={() => handleTypeChange(t.key)}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            <button
              className={`busca-ai-btn ${aiMode ? 'busca-ai-btn-active' : ''}`}
              onClick={handleAiToggle}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 18, height: 18 }}>
                <path d="M12 2a4 4 0 014 4c0 1.95-2 3-2 5h-4c0-2-2-3.05-2-5a4 4 0 014-4z"/>
                <line x1="10" y1="14" x2="14" y2="14"/>
                <line x1="10" y1="17" x2="14" y2="17"/>
                <line x1="11" y1="20" x2="13" y2="20"/>
              </svg>
              <span>Busca com IA</span>
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="busca-loading">
              <div className="search-loading-spinner" />
              <span>Buscando{aiMode ? ' com inteligência artificial' : ''}...</span>
            </div>
          )}

          {/* AI Response */}
          {aiMode && aiResponse && !loading && (
            <div className="busca-ai-response">
              <div className="busca-ai-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 20, height: 20 }}>
                  <path d="M12 2a4 4 0 014 4c0 1.95-2 3-2 5h-4c0-2-2-3.05-2-5a4 4 0 014-4z"/>
                  <line x1="10" y1="14" x2="14" y2="14"/>
                  <line x1="10" y1="17" x2="14" y2="17"/>
                  <line x1="11" y1="20" x2="13" y2="20"/>
                </svg>
                <span>Resposta da Inteligência Artificial</span>
              </div>
              <div className="busca-ai-text">{aiResponse}</div>
            </div>
          )}

          {/* Results count */}
          {results && !loading && (
            <div className="busca-results-info">
              {totalResults > 0 ? (
                <span>{totalResults} resultado{totalResults !== 1 ? 's' : ''} para &ldquo;{query}&rdquo;</span>
              ) : (
                <span>Nenhum resultado para &ldquo;{query}&rdquo;</span>
              )}
            </div>
          )}

          {/* Results */}
          {results && !loading && (
            <div className="busca-results">
              {/* Páginas */}
              {results.paginas?.length > 0 && (activeType === 'all' || activeType === 'paginas') && (
                <ResultSection title="Páginas" icon="📄" items={results.paginas} />
              )}

              {/* Produtos */}
              {results.produtos?.length > 0 && (activeType === 'all' || activeType === 'produtos') && (
                <ResultSection title="Produtos" icon="🛒" items={results.produtos} />
              )}

              {/* Blog */}
              {results.blog?.length > 0 && (activeType === 'all' || activeType === 'blog') && (
                <ResultSection title="Artigos" icon="📝" items={results.blog} />
              )}

              {/* Conhecimento */}
              {results.conhecimento?.length > 0 && (activeType === 'all' || activeType === 'conhecimento') && (
                <ResultSection title="Perguntas & Respostas" icon="❓" items={results.conhecimento} />
              )}
            </div>
          )}

          {/* No results + suggest AI */}
          {results && !loading && totalResults === 0 && !aiResponse && (
            <div className="busca-no-results">
              <div className="busca-no-results-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48, opacity: 0.4 }}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3>Nenhum resultado encontrado</h3>
              <p>Tente termos diferentes ou ative a busca com IA para perguntas mais complexas.</p>
              {!aiMode && (
                <button className="busca-try-ai" onClick={handleAiToggle}>
                  Tentar com Inteligência Artificial
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function ResultSection({ title, icon, items }) {
  return (
    <div className="busca-section">
      <h2 className="busca-section-title">
        <span>{icon}</span> {title}
        <span className="busca-section-count">{items.length}</span>
      </h2>
      <div className="busca-grid">
        {items.map((item) => (
          <ResultCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function ResultCard({ item }) {
  const isExternal = item.url?.startsWith('http');
  const hasUrl = !!item.url;

  const card = (
    <div className="busca-card">
      {item.image && (
        <div className="busca-card-image">
          <img src={item.image} alt="" />
        </div>
      )}
      <div className="busca-card-body">
        <div className="busca-card-type">{item.type === 'pagina' ? 'Página' : item.type === 'produto' ? 'Produto' : item.type === 'blog' ? 'Artigo' : 'FAQ'}</div>
        <h3 className="busca-card-title">{item.title}</h3>
        {item.description && (
          <p className="busca-card-desc">{item.description}</p>
        )}
        <div className="busca-card-meta">
          {item.price && <span className="busca-card-price">{item.price}</span>}
          {item.badge && <span className="busca-card-badge">{item.badge}</span>}
          {item.category && <span className="busca-card-category">{item.category}</span>}
          {item.readingTime && <span>{item.readingTime} min de leitura</span>}
        </div>
      </div>
    </div>
  );

  if (!hasUrl) {
    return <div className="busca-card-wrapper">{card}</div>;
  }

  if (isExternal) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="busca-card-wrapper">
        {card}
      </a>
    );
  }

  return (
    <Link href={item.url} className="busca-card-wrapper">
      {card}
    </Link>
  );
}

export default function BuscaPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="search-loading-spinner" />
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
