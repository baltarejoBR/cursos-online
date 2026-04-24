'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_GRANTED,
  readConsentBrowser,
} from '@/lib/consent';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!PIXEL_ID) return;
    if (typeof window === 'undefined') return;
    if (typeof window.fbq !== 'function') return;
    if (readConsentBrowser() !== CONSENT_GRANTED) return;
    window.fbq('track', 'PageView');
  }, [pathname, searchParams]);

  return null;
}

// Escuta mudancas de consent e propaga pro fbq (grant/revoke).
function ConsentBridge() {
  const lastAppliedRef = useRef(null);

  useEffect(() => {
    if (!PIXEL_ID) return;
    if (typeof window === 'undefined') return;

    const apply = (value) => {
      if (typeof window.fbq !== 'function') return;
      if (lastAppliedRef.current === value) return;
      lastAppliedRef.current = value;
      if (value === CONSENT_GRANTED) {
        window.fbq('consent', 'grant');
        // Re-dispara PageView da pagina atual agora que consent foi dado
        window.fbq('track', 'PageView');
      } else {
        window.fbq('consent', 'revoke');
      }
    };

    // Aplica estado inicial apos hidration (caso o inline script tenha rodado antes)
    apply(readConsentBrowser() === CONSENT_GRANTED ? CONSENT_GRANTED : 'revoked');

    const onChange = (e) => {
      apply(e?.detail?.value ?? readConsentBrowser());
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  }, []);

  return null;
}

export default function MetaPixel() {
  if (!PIXEL_ID) return null;

  // O inline script abaixo inicializa fbq em modo consent REVOKED.
  // O ConsentBridge eleva para grant quando o cookie ja estiver presente (ou o user aceitar).
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('consent', 'revoke');
          fbq('init', '${PIXEL_ID}');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
      <ConsentBridge />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}

// Wrapper client-side que respeita consent antes de disparar fbq('track', ...).
export function trackMetaEvent(eventName, params) {
  if (typeof window === 'undefined') return;
  if (typeof window.fbq !== 'function') return;
  if (readConsentBrowser() !== CONSENT_GRANTED) return;
  if (params) {
    window.fbq('track', eventName, params);
  } else {
    window.fbq('track', eventName);
  }
}
