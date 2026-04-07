'use client';

export default function DecorativeElements({ theme = 'light' }) {
  if (theme === 'marble') {
    return (
      <>
        {/* Gold sparkles for dark/marble sections */}
        <div style={{ position: 'absolute', top: '8%', left: '4%', color: '#c9a84c', opacity: 0.4, fontSize: '1.4rem', animation: 'sparkle-twinkle 3s ease-in-out infinite', pointerEvents: 'none', zIndex: 1 }}>✦</div>
        <div style={{ position: 'absolute', top: '25%', right: '6%', color: '#dfc06a', opacity: 0.3, fontSize: '0.9rem', animation: 'sparkle-twinkle 4s ease-in-out infinite 1s', pointerEvents: 'none', zIndex: 1 }}>✦</div>
        <div style={{ position: 'absolute', bottom: '18%', left: '8%', color: '#c9a84c', opacity: 0.25, fontSize: '1.1rem', animation: 'sparkle-twinkle 5s ease-in-out infinite 2s', pointerEvents: 'none', zIndex: 1 }}>✦</div>
        <div style={{ position: 'absolute', bottom: '30%', right: '10%', color: '#e6c873', opacity: 0.35, fontSize: '0.7rem', animation: 'sparkle-twinkle 3.5s ease-in-out infinite 0.5s', pointerEvents: 'none', zIndex: 1 }}>✦</div>
        <div style={{ position: 'absolute', top: '55%', left: '2%', color: '#c9a84c', opacity: 0.2, fontSize: '1.6rem', animation: 'sparkle-twinkle 6s ease-in-out infinite 1.5s', pointerEvents: 'none', zIndex: 1 }}>✦</div>
        <div style={{ position: 'absolute', top: '70%', right: '3%', color: '#dfc06a', opacity: 0.15, fontSize: '0.5rem', animation: 'sparkle-twinkle 4.5s ease-in-out infinite 3s', pointerEvents: 'none', zIndex: 1 }}>✦</div>
      </>
    );
  }

  if (theme === 'aqua') {
    return (
      <>
        {/* Water bubbles for aqua sections */}
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(91, 188, 201, 0.2)', border: '1px solid rgba(91, 188, 201, 0.3)', animation: 'bubble-rise 8s ease-in-out infinite', pointerEvents: 'none', zIndex: 1 }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '15%', width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(91, 188, 201, 0.15)', border: '1px solid rgba(91, 188, 201, 0.25)', animation: 'bubble-rise 10s ease-in-out infinite 2s', pointerEvents: 'none', zIndex: 1 }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(91, 188, 201, 0.12)', border: '1px solid rgba(91, 188, 201, 0.2)', animation: 'bubble-rise 12s ease-in-out infinite 4s', pointerEvents: 'none', zIndex: 1 }} />
        <div style={{ position: 'absolute', bottom: '8%', right: '25%', width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(91, 188, 201, 0.18)', border: '1px solid rgba(91, 188, 201, 0.3)', animation: 'bubble-rise 9s ease-in-out infinite 1s', pointerEvents: 'none', zIndex: 1 }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '30%', width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(91, 188, 201, 0.1)', border: '1px solid rgba(91, 188, 201, 0.2)', animation: 'bubble-rise 11s ease-in-out infinite 3s', pointerEvents: 'none', zIndex: 1 }} />
      </>
    );
  }

  // Default: light theme — subtle gold particles
  return (
    <>
      <div style={{ position: 'absolute', top: '12%', left: '3%', color: '#c9a84c', opacity: 0.15, fontSize: '0.8rem', animation: 'sparkle-twinkle 5s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }}>✦</div>
      <div style={{ position: 'absolute', top: '40%', right: '5%', color: '#c9a84c', opacity: 0.1, fontSize: '0.6rem', animation: 'sparkle-twinkle 7s ease-in-out infinite 2s', pointerEvents: 'none', zIndex: 0 }}>✦</div>
      <div style={{ position: 'absolute', bottom: '20%', left: '7%', color: '#dfc06a', opacity: 0.12, fontSize: '1rem', animation: 'sparkle-twinkle 6s ease-in-out infinite 1s', pointerEvents: 'none', zIndex: 0 }}>✦</div>
    </>
  );
}
