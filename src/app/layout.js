import './globals.css';

export const metadata = {
  title: 'CursosOnline - Aprenda no seu ritmo',
  description: 'Plataforma de cursos online com conteúdo gratuito e premium.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
