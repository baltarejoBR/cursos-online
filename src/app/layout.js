import './globals.css';

export const metadata = {
  title: 'Método Corpo Limpo',
  description: 'Plataforma de cursos e produtos do Método Corpo Limpo.',
  manifest: '/manifest.json',
  themeColor: '#1a6baa',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Corpo Limpo',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
