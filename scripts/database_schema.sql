-- =======================================================================
-- SKEMA DATABASE & KONFIGURASI PENGATURAN (SUPABASE SQL)
-- Kelompok Tani Banyu Urip Tanggumong - Web Pemasaran Melon Honey
-- =======================================================================

-- 1. Tabel settings (Menyimpan nomor WA, profil tentang kami, dan patokan harga varian melon katalog)
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Nilai Default untuk Pengaturan dan Patokan Harga Varian Melon
INSERT INTO settings (key, value)
VALUES 
  ('wa_number', '6287812345678'),
  ('tentang_kami', 'Kelompok Tani Banyu Urip adalah pelopor budidaya melon premium berbasis teknologi irigasi tetes pintar di Desa Tanggumong, Sampang, Madura.'),
  ('price_honey_globe', '20.000'),
  ('price_golden_apollo', '22.000')
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value;

-- 3. Kebijakan Akses (RLS Policies - Supabase)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Publik dapat membaca (SELECT) data pengaturan website
CREATE POLICY "Public can view settings" 
ON settings FOR SELECT 
USING (true);

-- Authenticated/Admin dapat mengubah (INSERT/UPDATE/DELETE) data pengaturan
CREATE POLICY "Authenticated users can manage settings" 
ON settings FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
