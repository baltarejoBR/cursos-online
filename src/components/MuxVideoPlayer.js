'use client';

import { useEffect, useState } from 'react';
import MuxPlayer from '@mux/mux-player-react';

export default function MuxVideoPlayer({ playbackId, courseId, lessonId, title }) {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playbackId) return;

    async function fetchToken() {
      try {
        const res = await fetch('/api/mux/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playbackId, courseId, lessonId }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Erro ao carregar video');
          return;
        }

        const { token } = await res.json();
        setToken(token);
      } catch (err) {
        setError('Erro de conexao. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }

    fetchToken();
  }, [playbackId, courseId, lessonId]);

  if (!playbackId) {
    return (
      <div style={{
        background: 'var(--bg-input)',
        borderRadius: '8px',
        padding: '40px',
        textAlign: 'center',
        color: 'var(--text-muted)',
      }}>
        Video nao disponivel
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        background: '#000',
        borderRadius: '8px',
        padding: '60px',
        textAlign: 'center',
        color: '#999',
        aspectRatio: '16/9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        Carregando video...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'var(--bg-input)',
        borderRadius: '8px',
        padding: '40px',
        textAlign: 'center',
        color: '#e53e3e',
      }}>
        {error}
      </div>
    );
  }

  return (
    <MuxPlayer
      playbackId={playbackId}
      tokens={{ playback: token }}
      metadata={{
        video_title: title || 'Aula',
      }}
      style={{
        width: '100%',
        borderRadius: '8px',
        aspectRatio: '16/9',
      }}
      accentColor="#5a8a3c"
      streamType="on-demand"
    />
  );
}
