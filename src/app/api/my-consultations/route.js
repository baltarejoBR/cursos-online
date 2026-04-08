import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { createAdminSupabase } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const supabase = createServerSupabase();
    const admin = createAdminSupabase();

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Find contact by email
    const { data: contact } = await admin
      .from('contacts')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!contact) {
      return NextResponse.json({ consultations: [], files: [] });
    }

    // Fetch consultation reports for this contact (only sent/approved ones)
    const { data: reports } = await admin
      .from('consultation_reports')
      .select('id, client_name, meeting_date, conditions, protocols_used, status, recording_url, created_at')
      .eq('contact_id', contact.id)
      .in('status', ['approved', 'sent'])
      .order('meeting_date', { ascending: false });

    // Fetch files for this contact
    const { data: files } = await admin
      .from('consultation_files')
      .select('id, file_name, file_type, public_url, file_size_bytes, created_at')
      .eq('contact_id', contact.id)
      .not('public_url', 'is', null)
      .order('file_type')
      .order('created_at', { ascending: false });

    return NextResponse.json({
      consultations: reports || [],
      files: files || [],
    });
  } catch (error) {
    console.error('My consultations error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
