'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { createClient } from '@/lib/supabase-browser';
import { PRODUCTS } from '@/lib/products';

export default function MinhaAreaLayout({ children }) {
  const supabase = createClient();
  const router = useRouter();
  const [userCategories, setUserCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccess() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: userProducts } = await supabase
        .from('user_products')
        .select('product_id')
        .eq('user_id', user.id)
        .eq('active', true);

      const categories = new Set();
      (userProducts || []).forEach(up => {
        const product = PRODUCTS.find(p => p.id === up.product_id);
        if (product) categories.add(product.category);
      });

      setUserCategories([...categories]);
      setLoading(false);
    }

    loadAccess();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="minha-area-layout">
        <Sidebar userCategories={userCategories} />
        <main className="minha-area-content">
          {children}
        </main>
      </div>
    </>
  );
}
