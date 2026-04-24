// LGPD consent helpers — cds_consent cookie (granted|revoked), 1 ano
// Lido tanto pelo browser (ConsentBanner, MetaPixel) quanto pelo servidor (rotas API).

export const CONSENT_COOKIE = 'cds_consent';
export const CONSENT_GRANTED = 'granted';
export const CONSENT_REVOKED = 'revoked';
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 ano
export const CONSENT_CHANGE_EVENT = 'cds:consent-change';
export const CONSENT_OPEN_EVENT = 'cds:consent-open';

export function isValidConsentValue(value) {
  return value === CONSENT_GRANTED || value === CONSENT_REVOKED;
}

// Browser: le cookie do document.cookie
export function readConsentBrowser() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]+)`));
  if (!match) return null;
  const value = decodeURIComponent(match[1]);
  return isValidConsentValue(value) ? value : null;
}

// Browser: grava cookie + localStorage (espelho) + dispara CustomEvent
export function writeConsentBrowser(value) {
  if (typeof document === 'undefined') return;
  if (!isValidConsentValue(value)) return;
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax`;
  try {
    localStorage.setItem(CONSENT_COOKIE, value);
  } catch {
    // localStorage pode falhar em modo privado — cookie ja persiste
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: { value } }));
}

// Server: le cookie do Request (Next.js route handler)
export function readConsentFromRequest(request) {
  const cookieHeader = request?.headers?.get?.('cookie');
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]+)`));
  if (!match) return null;
  const value = decodeURIComponent(match[1]);
  return isValidConsentValue(value) ? value : null;
}

// Server: decide se pode disparar evento Meta (default = bloquear quando nao ha escolha)
export function canSendMetaEvent(consentValue) {
  return consentValue === CONSENT_GRANTED;
}
