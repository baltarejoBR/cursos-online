// Meta Conversions API (CAPI) — server-side event helper.
// Ref: https://developers.facebook.com/docs/marketing-api/conversions-api
// Design: no-op silencioso se env vars nao setadas (nao quebra producao).

import crypto from 'crypto';

const DEFAULT_API_VERSION = 'v21.0';

function sha256(value) {
  if (!value) return null;
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

function normalizePhoneDigits(phone) {
  if (!phone) return null;
  return String(phone).replace(/\D/g, '');
}

function hasCredentials() {
  return Boolean(process.env.META_PIXEL_ID && process.env.META_ACCESS_TOKEN);
}

/**
 * Envia um evento server-side ao Meta CAPI.
 * @param {Object} params
 * @param {string} params.eventName  - Lead | InitiateCheckout | Purchase | PageView | etc
 * @param {string} params.eventId    - UUID pra dedup com evento client-side (pixel)
 * @param {Object} params.user       - { email, phone, firstName, lastName, city, state, country, externalId, fbp, fbc, clientIp, userAgent }
 * @param {Object} [params.custom]   - { value, currency, contentName, contentIds, utms: {source, medium, campaign, content, term} }
 * @param {string} [params.sourceUrl] - URL da pagina (quando aplicavel)
 * @param {string} [params.actionSource] - website | email | system_generated (default: website)
 * @param {string} [params.eventTime] - unix seconds (default: agora)
 * @returns {Promise<{ok: boolean, status: number, fbtrace_id?: string, skipped?: boolean, error?: string}>}
 */
export async function sendCapiEvent({
  eventName,
  eventId,
  user = {},
  custom = {},
  sourceUrl,
  actionSource = 'website',
  eventTime,
}) {
  if (!hasCredentials()) {
    console.warn('[meta-capi] skipped: META_PIXEL_ID or META_ACCESS_TOKEN missing');
    return { ok: true, status: 204, skipped: true };
  }
  if (!eventName) {
    return { ok: false, status: 400, error: 'eventName required' };
  }

  const apiVersion = process.env.META_API_VERSION || DEFAULT_API_VERSION;
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  const user_data = {};
  if (user.email) user_data.em = [sha256(user.email)];
  if (user.phone) user_data.ph = [sha256(normalizePhoneDigits(user.phone))];
  if (user.firstName) user_data.fn = [sha256(user.firstName)];
  if (user.lastName) user_data.ln = [sha256(user.lastName)];
  if (user.city) user_data.ct = [sha256(user.city)];
  if (user.state) user_data.st = [sha256(user.state)];
  if (user.country) user_data.country = [sha256(user.country)];
  if (user.externalId) user_data.external_id = [sha256(user.externalId)];
  if (user.fbp) user_data.fbp = user.fbp;
  if (user.fbc) user_data.fbc = user.fbc;
  if (user.clientIp) user_data.client_ip_address = user.clientIp;
  if (user.userAgent) user_data.client_user_agent = user.userAgent;

  const custom_data = {};
  if (typeof custom.value === 'number') custom_data.value = custom.value;
  if (custom.currency) custom_data.currency = custom.currency;
  if (custom.contentName) custom_data.content_name = custom.contentName;
  if (Array.isArray(custom.contentIds) && custom.contentIds.length) {
    custom_data.content_ids = custom.contentIds;
  }
  const utms = custom.utms || {};
  if (utms.source) custom_data.utm_source = utms.source;
  if (utms.medium) custom_data.utm_medium = utms.medium;
  if (utms.campaign) custom_data.utm_campaign = utms.campaign;
  if (utms.content) custom_data.utm_content = utms.content;
  if (utms.term) custom_data.utm_term = utms.term;

  const event = {
    event_name: eventName,
    event_time: eventTime || Math.floor(Date.now() / 1000),
    action_source: actionSource,
    user_data,
  };
  if (eventId) event.event_id = eventId;
  if (sourceUrl) event.event_source_url = sourceUrl;
  if (Object.keys(custom_data).length) event.custom_data = custom_data;

  const payload = { data: [event] };
  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  const url = `https://graph.facebook.com/${apiVersion}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('[meta-capi] error', res.status, body);
      return {
        ok: false,
        status: res.status,
        error: body.error?.message || 'Meta CAPI error',
        fbtrace_id: body.fbtrace_id,
      };
    }

    return {
      ok: true,
      status: res.status,
      events_received: body.events_received,
      fbtrace_id: body.fbtrace_id,
    };
  } catch (err) {
    console.error('[meta-capi] exception', err.message);
    return { ok: false, status: 500, error: err.message };
  }
}
