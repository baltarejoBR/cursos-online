import Link from 'next/link';
import Header from '@/components/Header';

export const metadata = {
  title: 'Nossos Produtos - CDS, Ormus e DMSO - Método Corpo Limpo',
  description: 'Entenda a diferença entre CDS (Dióxido de Cloro), Ormus e DMSO. Guia completo para escolher o produto ideal para você.',
};

const PRODUTOS = [
  {
    nome: 'SDC / CDS',
    subtitulo: 'Solução de Dióxido de Cloro',
    emoji: '🧪',
    cor: '#2e8b57',
    descricao: 'O Dióxido de Cloro (ClO₂) é uma molécula oxidante usada há décadas para purificação de água. Na forma de solução (SDC/CDS), é preparado a 3000 ppm e diluído conforme os protocolos estabelecidos por pesquisadores como Andreas Kalcker.',
    beneficios: [
      'Purificação e tratamento de água',
      'Ampla documentação científica desde os anos 90',
      'Legalizado na Bolívia para uso terapêutico',
      'Disponível em embalagem PET ou vidro',
    ],
    produtos: [
      { nome: 'SDC 3000 ppm 1000 mL PET', preco: 'R$ 113,00', destaque: 'Mais econômico' },
      { nome: 'SDC 3000 ppm 1000 mL Vidro', preco: 'R$ 168,00', destaque: 'Mais puro' },
      { nome: 'SDC 3000 ppm 500 mL PET', preco: 'R$ 67,00', destaque: 'Para começar' },
    ],
  },
  {
    nome: 'ORMUS',
    subtitulo: 'Elementos monoatômicos em suspensão',
    emoji: '✨',
    cor: '#c9a84c',
    descricao: 'Ormus (ORME — Orbitally Rearranged Monoatomic Elements) é uma suspensão coloidal rica em minerais monoatômicos como ouro, prata, platina e irídio. É considerado um suplemento mineral de alta biodisponibilidade, utilizado para suporte energético e bem-estar geral.',
    beneficios: [
      'Rico em minerais monoatômicos de alta absorção',
      'Suporte energético e vitalidade',
      'Complemento ideal ao SDC nos combos',
      'Produção artesanal de alta qualidade',
    ],
    produtos: [
      { nome: 'Ormus 1000 mL', preco: 'R$ 249,00', destaque: 'Melhor custo-benefício' },
      { nome: 'Ormus 500 mL', preco: 'R$ 147,00', destaque: 'Para experimentar' },
    ],
  },
  {
    nome: 'DMSO',
    subtitulo: 'Dimetilsulfóxido',
    emoji: '💧',
    cor: '#4a90d9',
    descricao: 'O DMSO é um solvente orgânico natural derivado da madeira, conhecido por sua capacidade de penetrar membranas biológicas. É usado como veículo de transporte para outras substâncias e possui propriedades próprias reconhecidas em estudos científicos.',
    beneficios: [
      'Capacidade de penetração em membranas biológicas',
      'Funciona como veículo de transporte para outros compostos',
      'Disponível em concentrações de 70% e 99,9%',
      'Ampla literatura científica desde os anos 60',
    ],
    produtos: [
      { nome: 'DMSO 70% — 250 mL', preco: 'R$ 230,00', destaque: 'Uso geral' },
      { nome: 'DMSO 70% — 100 mL', preco: 'R$ 115,00', destaque: '12% desconto' },
      { nome: 'DMSO 99,9% — 100 mL', preco: 'R$ 169,50', destaque: 'Concentrado' },
    ],
  },
];

export default function NossosProdutosPage() {
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
        <div className="container" style={{ maxWidth: '700px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '16px' }}>
            Nossos Produtos
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Entenda a diferença entre <strong style={{ color: '#dfc06a' }}>CDS</strong>, <strong style={{ color: '#dfc06a' }}>Ormus</strong> e <strong style={{ color: '#dfc06a' }}>DMSO</strong> para escolher o produto ideal para você.
          </p>
        </div>
      </section>

      {/* Produto cards */}
      <section style={{ padding: '60px 20px', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {PRODUTOS.map((produto) => (
              <div key={produto.nome} style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}>
                {/* Header do card */}
                <div style={{
                  background: `linear-gradient(135deg, ${produto.cor}15, ${produto.cor}08)`,
                  borderBottom: `2px solid ${produto.cor}25`,
                  padding: '28px 32px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}>
                  <span style={{
                    fontSize: '2.2rem',
                    width: '56px',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${produto.cor}18`,
                    borderRadius: '14px',
                  }}>
                    {produto.emoji}
                  </span>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)', margin: 0 }}>
                      {produto.nome}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                      {produto.subtitulo}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '28px 32px' }}>
                  <p style={{
                    color: 'var(--text-muted)',
                    lineHeight: 1.7,
                    fontSize: '0.95rem',
                    marginBottom: '24px',
                  }}>
                    {produto.descricao}
                  </p>

                  {/* Benefícios */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-light)', marginBottom: '12px' }}>
                      Características
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                      {produto.beneficios.map((b) => (
                        <div key={b} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.88rem',
                          color: 'var(--text-muted)',
                        }}>
                          <span style={{ color: produto.cor, fontWeight: '700', fontSize: '1rem' }}>✓</span>
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Produtos disponíveis */}
                  <div>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-light)', marginBottom: '12px' }}>
                      Opções disponíveis
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {produto.produtos.map((p) => (
                        <div key={p.nome} style={{
                          padding: '10px 16px',
                          background: 'var(--bg)',
                          borderRadius: '10px',
                          border: '1px solid var(--border-light)',
                          fontSize: '0.85rem',
                        }}>
                          <span style={{ fontWeight: '600', color: 'var(--text)' }}>{p.nome}</span>
                          <span style={{ margin: '0 8px', color: 'var(--border-light)' }}>·</span>
                          <span style={{ fontWeight: '700', color: produto.cor }}>{p.preco}</span>
                          {p.destaque && (
                            <>
                              <span style={{ margin: '0 8px', color: 'var(--border-light)' }}>·</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{p.destaque}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            textAlign: 'center',
            marginTop: '48px',
            padding: '40px',
            background: 'white',
            borderRadius: '20px',
            border: '1px solid var(--border-light)',
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px' }}>
              Pronto para escolher?
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Veja todos os 37 produtos e kits com desconto na loja.
            </p>
            <Link href="/loja" style={{
              display: 'inline-block',
              padding: '14px 32px',
              background: 'var(--gold-gradient)',
              color: 'white',
              borderRadius: '50px',
              fontWeight: '700',
              fontSize: '1rem',
              textDecoration: 'none',
            }}>
              Ver todos os produtos →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
