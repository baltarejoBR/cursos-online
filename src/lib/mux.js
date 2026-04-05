import Mux from '@mux/mux-node';

let muxClient = null;

export function getMuxClient() {
  if (!muxClient) {
    muxClient = new Mux({
      tokenId: process.env.MUX_TOKEN_ID,
      tokenSecret: process.env.MUX_TOKEN_SECRET,
    });
  }
  return muxClient;
}

// Gera um token JWT para playback assinado
export function getSignedPlaybackUrl(playbackId) {
  const token = Mux.jwt.signPlaybackId(playbackId, {
    keyId: process.env.MUX_SIGNING_KEY_ID,
    keySecret: process.env.MUX_SIGNING_PRIVATE_KEY,
    type: 'video',
    expiration: '6h',
  });
  return token;
}
