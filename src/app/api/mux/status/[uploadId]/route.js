import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import { getMuxClient } from '@/lib/mux';

// GET - Verifica status do upload e retorna o playback_id quando pronto
export async function GET(request, { params }) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== 'baltarejo@gmail.com') {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 });
  }

  try {
    const mux = getMuxClient();
    const upload = await mux.video.uploads.retrieve(params.uploadId);

    if (upload.status === 'asset_created' && upload.asset_id) {
      const asset = await mux.video.assets.retrieve(upload.asset_id);
      const signedPlayback = asset.playback_ids?.find(p => p.policy === 'signed');

      return NextResponse.json({
        status: 'ready',
        assetId: asset.id,
        playbackId: signedPlayback?.id || null,
        duration: asset.duration,
      });
    }

    return NextResponse.json({
      status: upload.status,
      assetId: upload.asset_id || null,
    });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return NextResponse.json({ error: 'Erro ao verificar status' }, { status: 500 });
  }
}
