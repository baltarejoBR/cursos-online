import Header from '@/components/Header';
import StoreGrid from '@/components/StoreGrid';
import { getAllStoreProducts } from '@/lib/store-products';

export const metadata = {
  title: 'Loja Dioxi - Comprar SDC/CDS - Metodo Corpo Limpo',
  description: 'Compre SDC (Solucao de Dioxido de Cloro), DMSO, kits e acessorios na loja oficial. Produtos de alta qualidade com entrega para todo o Brasil.',
};

export default async function LojaPage() {
  const products = await getAllStoreProducts();

  return (
    <>
      <Header />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #1a2915 0%, #2d3a25 50%, #1a1a1a 100%)',
        padding: '80px 20px 60px',
        textAlign: 'center',
        color: 'white',
      }}>
        <div className="container">
          <div style={{
            display: 'inline-block',
            background: 'rgba(90, 138, 60, 0.3)',
            border: '1px solid rgba(90, 138, 60, 0.5)',
            borderRadius: '20px',
            padding: '6px 16px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            color: '#a8d88a',
          }}>
            Loja Oficial Dioxi
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '16px',
            fontWeight: '800',
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
            Produtos de alta qualidade para Terapias Bio-oxidativas.
            SDC = CDS = Dioxi — e tudo a mesma coisa!
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
            <div style={{ fontWeight: '800', color: '#2e8b57', fontSize: '1.1rem' }}>Dioxi</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Marca</div>
          </div>
          <div style={{ color: 'var(--border)', fontSize: '1.5rem', alignSelf: 'center' }}>=</div>
          <div>
            <div style={{ fontWeight: '800', color: '#1a6baa', fontSize: '1.1rem' }}>CDS</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Chlorine Dioxide Solution</div>
          </div>
          <div style={{ color: 'var(--border)', fontSize: '1.5rem', alignSelf: 'center' }}>=</div>
          <div>
            <div style={{ fontWeight: '800', color: '#6b8fad', fontSize: '1.1rem' }}>SDC</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Solucao de Dioxido de Cloro</div>
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
          <p>&copy; 2026 Metodo Corpo Limpo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
