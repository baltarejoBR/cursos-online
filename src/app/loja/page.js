import Header from '@/components/Header';
import StoreGrid from '@/components/StoreGrid';
import { getAllStoreProducts } from '@/lib/store-products';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Loja Dioxi - Comprar SDC/CDS - Método Corpo Limpo',
  description: 'SDC (Solução de Dióxido de Cloro), DMSO, kits e acessórios na loja oficial Dioxi. Produtos de alta qualidade com entrega para todo o Brasil. É barato e acessível.',
};

export default async function LojaPage() {
  const products = await getAllStoreProducts();

  return (
    <>
      <Header />

      {/* Hero */}
      <section style={{
        background: 'var(--hero-gradient)',
        padding: '80px 20px 60px',
        textAlign: 'center',
        color: 'white',
      }}>
        <div className="container">
          <div style={{
            display: 'inline-block',
            background: 'rgba(201, 168, 76, 0.2)',
            border: '1px solid rgba(201, 168, 76, 0.4)',
            borderRadius: '20px',
            padding: '6px 16px',
            fontSize: '0.85rem',
            fontFamily: "'Work Sans', sans-serif",
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '20px',
            color: 'var(--cds-bright)',
          }}>
            Loja Oficial Dioxi
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '16px',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 400,
          }}>
            Comprar SDC / Dioxi
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.75)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Produtos de alta qualidade para Terapias Bio-oxidativas. Corpo limpo é corpo saudável — e o melhor: é acessível para todo mundo.
            SDC = CDS = Dioxi — é tudo a mesma coisa!
          </p>
        </div>
      </section>

      {/* Dioxi naming banner */}
      <section style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '24px 20px',
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          textAlign: 'center',
        }}>
          <div>
            <div style={{ fontWeight: '800', color: 'var(--cds-dark)', fontSize: '1.1rem' }}>Dioxi</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Marca</div>
          </div>
          <div style={{ color: 'var(--border)', fontSize: '1.5rem', alignSelf: 'center' }}>=</div>
          <div>
            <div style={{ fontWeight: '800', color: 'var(--blue-deep)', fontSize: '1.1rem' }}>CDS</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Chlorine Dioxide Solution</div>
          </div>
          <div style={{ color: 'var(--border)', fontSize: '1.5rem', alignSelf: 'center' }}>=</div>
          <div>
            <div style={{ fontWeight: '800', color: 'var(--success)', fontSize: '1.1rem' }}>SDC</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Solução de Dióxido de Cloro</div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: '60px 20px', background: 'var(--bg)' }}>
        <div className="container">
          <StoreGrid products={products} />
        </div>
      </section>

      <footer className="footer">
        <div className="container" style={{ textAlign: 'center' }}>
          <p>&copy; 2026 Método Corpo Limpo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
