export function getMarketingLeadsTable() {
  return process.env.SUPABASE_MARKETING_LEADS_TABLE?.trim() || 'marketing_leads';
}
