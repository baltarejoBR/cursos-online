import { NextResponse } from 'next/server';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { sendLeadCouponEmail, createOrUpdateBrevoContact, BREVO_LIST_IDS } from '@/lib/brevo';
import { getMarketingLeadsTable } from '@/lib/marketing-leads';
import { sendCapiEvent } from '@/lib/meta-capi';

const CUPOM_FIXO = 'SEGUIDOR';
const MARKETING_LEADS_TABLE = getMarketingLeadsTable();

function normalizePhone(raw) {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return null;
  return digits.startsWith('55') ? `+${digits}` : `+55${digits}`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      source,
      phone,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      fbp,
      fbc,
      tags: clientTags,
    } = body || {};

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const supabase = createAdminSupabase();
    const emailNormalized = email.toLowerCase().trim();
    const phoneNormalized = normalizePhone(phone);
    const leadSource = source || 'popup';

    // marketing_leads check
    const { data: existing } = await supabase
      .from(MARKETING_LEADS_TABLE)
      .select('coupon_code')
      .eq('email', emailNormalized)
      .single();

    if (!existing) {
      const { error } = await supabase.from(MARKETING_LEADS_TABLE).insert({
        email: emailNormalized,
        name: name || null,
        coupon_code: CUPOM_FIXO,
        source: leadSource,
      });

      if (error) {
        console.error('Lead insert error:', error.message);
        return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
      }
    }

    // workspace_leads upsert (analytics cross-canal — complementar)
    // Dedup de tags: 'lead' sempre + 'lp_40off' se source casa + tags do cliente (sem duplicar)
    const workspaceTagsSet = new Set(['lead']);
    if (leadSource === 'lp_40off') workspaceTagsSet.add('lp_40off');
    if (Array.isArray(clientTags)) {
      clientTags.filter(t => typeof t === 'string').forEach(t => workspaceTagsSet.add(t));
    }
    const workspaceTags = Array.from(workspaceTagsSet);

    const { data: wlData, error: wlError } = await supabase
      .from('workspace_leads')
      .upsert(
        {
          email: emailNormalized,
          name: name || null,
          phone: phoneNormalized,
          source: leadSource,
          utm_source: utm_source || null,
          utm_medium: utm_medium || null,
          utm_campaign: utm_campaign || null,
          utm_content: utm_content || null,
          utm_term: utm_term || null,
          fbp: fbp || null,
          fbc: fbc || null,
          tags: workspaceTags,
          last_touch_at: new Date().toISOString(),
          metadata: { captured_via: 'api/leads' },
        },
        { onConflict: 'email,source' }
      )
      .select('id')
      .single();
    if (wlError) console.error('workspace_leads sync error:', wlError.message);

    // Meta CAPI Lead event (event_id = workspace_leads.id pra dedup com pixel client-side)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
    const userAgent = req.headers.get('user-agent') || null;
    const lpSourceUrl = req.headers.get('referer') || null;
    sendCapiEvent({
      eventName: 'Lead',
      eventId: wlData?.id || undefined,
      user: {
        email: emailNormalized,
        phone: phoneNormalized,
        firstName: (name || '').split(' ')[0] || null,
        externalId: wlData?.id || null,
        fbp: fbp || null,
        fbc: fbc || null,
        clientIp,
        userAgent,
      },
      custom: {
        contentName: leadSource,
        utms: {
          source: utm_source,
          medium: utm_medium,
          campaign: utm_campaign,
          content: utm_content,
          term: utm_term,
        },
      },
      sourceUrl: lpSourceUrl,
    }).catch(err => console.error('meta CAPI Lead error:', err.message));

    // Brevo contact (non-blocking)
    sendLeadCouponEmail(emailNormalized, name, CUPOM_FIXO).catch(err =>
      console.error('Lead email failed:', err.message)
    );

    createOrUpdateBrevoContact({
      email: emailNormalized,
      attributes: {
        FIRSTNAME: name || '',
        FONTE: leadSource,
        DATA_CADASTRO: new Date().toISOString().split('T')[0],
        CUPOM_USADO: CUPOM_FIXO,
        COMPROU: 'false',
      },
      listIds: [BREVO_LIST_IDS.SITE_LEADS, BREVO_LIST_IDS.NEWSLETTER],
    }).catch(err => console.error('Brevo lead contact error:', err.message));

    // CRM contacts upsert
    supabase
      .from('contacts')
      .upsert(
        {
          email: emailNormalized,
          full_name: name || null,
          coupon_code: CUPOM_FIXO,
          first_source: 'website',
          access_level: 'lead',
          lifecycle_stage: 'lead',
          tags: workspaceTags,
        },
        { onConflict: 'email' }
      )
      .then(({ error }) => {
        if (error) console.error('CRM lead sync error:', error.message);
      });

    return NextResponse.json({
      coupon_code: CUPOM_FIXO,
      message: existing ? 'Você já tem um cupom! Use ele na loja.' : 'Cupom gerado com sucesso!',
      already_existed: !!existing,
      leadId: wlData?.id || null,
    });
  } catch (err) {
    console.error('Leads API error:', err.message);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
