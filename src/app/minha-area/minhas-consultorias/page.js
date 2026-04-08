'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';
import { PRODUCTS } from '@/lib/products';

export default function MinhasConsultoriasPage() {
  const supabase = createClient();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [consultations, setConsultations] = useState([]);
  const [files, setFiles] = useState([]);

  const mentoria = PRODUCTS.find(p => p.id === 'mentoria');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Check access
      const { data: userProducts } = await supabase
        .from('user_products')
        .select('product_id')
        .eq('user_id', user.id)
        .eq('active', true);

      const hasServicos = (userProducts || []).some(up => {
        const product = PRODUCTS.find(p => p.id === up.product_id);
        return product && product.category === 'servicos';
      });

      setHasAccess(hasServicos);

      if (hasServicos) {
        // Fetch consultations data
        const res = await fetch('/api/my-consultations');
        if (res.ok) {
          const data = await res.json();
          setConsultations(data.consultations || []);
          setFiles(data.files || []);
        }
      }

      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="dashboard">
        <h1>Minhas Consultorias</h1>
        <p className="subtitle">Seus relatorios e gravacoes de consultorias</p>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderTop: '3px solid #c9a84c',
          borderRadius: '16px',
          padding: '48px 32px',
          textAlign: 'center',
          marginTop: '32px',
        }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🔒</span>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>
            Acesso Exclusivo
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            Esta area e exclusiva para quem fez uma consultoria individual. Agende sua consultoria para ter acesso aos relatorios personalizados.
          </p>
          {mentoria && (
            <a
              href={mentoria.whatsappUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #6b8fad 0%, #4a6a8a 100%)',
                color: '#fff',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              Agendar Consultoria
            </a>
          )}
        </div>
      </div>
    );
  }

  const fileTypeLabels = {
    transcription: 'Transcricao',
    report: 'Relatorio PDF',
    audio: 'Audio',
    recommendation: 'Recomendacoes',
    other: 'Arquivo',
  };

  const fileTypeIcons = {
    transcription: '📝',
    report: '📄',
    audio: '🎵',
    recommendation: '📋',
    other: '📎',
  };

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  }

  function formatSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="dashboard">
      <h1>Minhas Consultorias</h1>
      <p className="subtitle">Seus relatorios, gravacoes e arquivos de consultorias</p>

      {consultations.length === 0 && files.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '48px 32px',
          textAlign: 'center',
          marginTop: '32px',
        }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>📋</span>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>
            Nenhuma consultoria encontrada
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
            Seus relatorios aparecerao aqui apos a consultoria ser realizada e o relatorio ser gerado.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
          {/* Consultation Cards */}
          {consultations.map(c => (
            <div key={c.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <div>
                  <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.1rem' }}>
                    Consultoria CDS
                  </h3>
                  <p style={{ color: 'var(--text-muted)', margin: '4px 0 0', fontSize: '0.85rem' }}>
                    {formatDate(c.meeting_date)}
                  </p>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  background: c.status === 'sent' ? 'rgba(46, 139, 87, 0.15)' : 'rgba(201, 168, 76, 0.15)',
                  color: c.status === 'sent' ? '#2e8b57' : '#c9a84c',
                }}>
                  {c.status === 'sent' ? 'Enviado' : 'Disponivel'}
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: '20px 24px' }}>
                {/* Protocols */}
                {c.protocols_used && c.protocols_used.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px' }}>
                      Protocolos Recomendados
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {c.protocols_used.map(p => (
                        <span key={p} style={{
                          padding: '4px 10px',
                          background: 'rgba(26, 107, 170, 0.12)',
                          color: '#1a6baa',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                        }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conditions */}
                {c.conditions && c.conditions.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px' }}>
                      Condicoes Abordadas
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {c.conditions.slice(0, 6).map(cond => (
                        <span key={cond} style={{
                          padding: '3px 8px',
                          background: 'var(--bg-tertiary, rgba(255,255,255,0.05))',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                        }}>
                          {cond}
                        </span>
                      ))}
                      {c.conditions.length > 6 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          +{c.conditions.length - 6} mais
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
                  {/* Find report file */}
                  {files.filter(f => f.file_type === 'report').length > 0 && (
                    <a
                      href={files.find(f => f.file_type === 'report')?.public_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #1a6baa 0%, #3a9ad9 100%)',
                        color: '#fff',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                      }}
                    >
                      📄 Ver Relatorio
                    </a>
                  )}

                  {c.recording_url && (
                    <a
                      href={c.recording_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        background: 'rgba(46, 139, 87, 0.12)',
                        color: '#2e8b57',
                        border: '1px solid rgba(46, 139, 87, 0.3)',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                      }}
                    >
                      🎥 Ver Gravacao
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* All Files Section */}
          {files.length > 0 && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--border)',
              }}>
                <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>
                  Todos os Arquivos
                </h3>
              </div>
              <div style={{ padding: '12px 24px' }}>
                {files.map(f => (
                  <a
                    key={f.id}
                    href={f.public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 0',
                      borderBottom: '1px solid var(--border)',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>
                      {fileTypeIcons[f.file_type] || '📎'}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        color: 'var(--text-primary)',
                        margin: 0,
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {f.file_name}
                      </p>
                      <p style={{ color: 'var(--text-muted)', margin: '2px 0 0', fontSize: '0.75rem' }}>
                        {fileTypeLabels[f.file_type] || 'Arquivo'}
                        {f.file_size_bytes ? ` - ${formatSize(f.file_size_bytes)}` : ''}
                      </p>
                    </div>
                    <span style={{ color: '#1a6baa', fontSize: '0.8rem', fontWeight: '500' }}>
                      Abrir
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
