import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { getMuxClient } from '@/lib/mux';

// POST - Cria um upload direto no Mux (apenas admin)
export async function POST() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== 'baltarejo@gmail.com') {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 });
  }

  try {
    const mux = getMuxClient();

    // Cria um upload direto - o video e enviado direto do browser para o Mux
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ['signed'],
        encoding_tier: 'smart',
      },
      cors_origin: process.env.NEXT_PUBLIC_SITE_URL || '*',
    });

    return NextResponse.json({
      uploadId: upload.id,
      uploadUrl: upload.url,
    });
  } catch (error) {
    console.error('Erro ao criar upload Mux:', error);
    return NextResponse.json({ error: 'Erro ao criar upload' }, { status: 500 });
  }
}
