-- Migration: Dioxi v2 - Store Products, Blog Posts, Leads
-- Run this in Supabase SQL Editor

-- 1. Store Products (37 produtos da loja clo2br.com.br)
CREATE TABLE IF NOT EXISTS store_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  items_description TEXT,
  price_cents INTEGER NOT NULL,
  price_display TEXT NOT NULL,
  installments TEXT,
  discount_percent NUMERIC(5,2),
  commission_percent NUMERIC(5,2),
  external_url TEXT NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read store_products" ON store_products FOR SELECT USING (true);
CREATE POLICY "Admin manage store_products" ON store_products FOR ALL USING (auth.jwt() ->> 'email' = 'baltarejo@gmail.com');

-- 2. Blog Posts (Universidade Dioxi)
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  cover_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  study_references JSONB,
  reading_time_minutes INTEGER,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published blog_posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admin manage blog_posts" ON blog_posts FOR ALL USING (auth.jwt() ->> 'email' = 'baltarejo@gmail.com');

-- 3. Leads (captura de email + cupom)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  coupon_code TEXT UNIQUE NOT NULL,
  coupon_used BOOLEAN DEFAULT FALSE,
  source TEXT DEFAULT 'popup',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read leads" ON leads FOR SELECT USING (auth.jwt() ->> 'email' = 'baltarejo@gmail.com');
