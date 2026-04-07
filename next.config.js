/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'image.mux.com' },
      { protocol: 'https', hostname: 'www.clo2br.com.br' },
      { protocol: 'https', hostname: 'cdn.awsli.com.br' },
    ],
  },
};

module.exports = nextConfig;
