-- ==============================================================================
-- Schema Database: Sistem Pendataan & Otomatisasi Sertifikat Keluarga Partner I Know You (v2 - Skema Asli)
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda.
-- ==============================================================================

-- 1. Buat Tabel keluarga
CREATE TABLE IF NOT EXISTS public.keluarga (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_keluarga TEXT NOT NULL,
  pribadi_instansi TEXT,
  nama_ayah TEXT,
  stifin_ayah TEXT,
  golongan_darah_ayah TEXT,
  nama_ibu TEXT,
  stifin_ibu TEXT,
  golongan_darah_ibu TEXT,
  no_wa TEXT,
  email TEXT,
  kesan_pesan TEXT,
  jumlah_anak INTEGER DEFAULT 0,
  tanggal_submit TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  nomor_sertifikat TEXT,
  url_sertifikat TEXT
);

-- Migrasi jika tabel keluarga sudah ada sebelumnya:
ALTER TABLE public.keluarga ADD COLUMN IF NOT EXISTS kesan_pesan TEXT;
ALTER TABLE public.keluarga ADD COLUMN IF NOT EXISTS no_wa TEXT;
ALTER TABLE public.keluarga ADD COLUMN IF NOT EXISTS email TEXT;


-- 2. Buat Tabel anak (Relasi 1-to-Many ke tabel keluarga)
CREATE TABLE IF NOT EXISTS public.anak (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keluarga_id UUID REFERENCES public.keluarga(id) ON DELETE CASCADE,
  nama TEXT,
  stifin TEXT,
  golongan_darah TEXT
);

-- Buat index foreign key untuk performa query relasional
CREATE INDEX IF NOT EXISTS idx_anak_keluarga_id ON public.anak(keluarga_id);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.keluarga ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anak ENABLE ROW LEVEL SECURITY;

-- Policy agar backend (service_role) & anon dapat membaca data jika diperlukan
CREATE POLICY "Allow public read keluarga"
  ON public.keluarga
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read anak"
  ON public.anak
  FOR SELECT
  TO public
  USING (true);

-- 2. Setup Storage Bucket 'sertifikat'
-- Buat bucket publik untuk menyimpan berkas PDF sertifikat
INSERT INTO storage.buckets (id, name, public)
VALUES ('sertifikat', 'sertifikat', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy akses publik untuk membaca PDF sertifikat dari bucket
CREATE POLICY "Public Access Sertifikat"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'sertifikat');

-- Policy agar backend service_role bisa upload file sertifikat
CREATE POLICY "Service Role Upload Sertifikat"
  ON storage.objects FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'sertifikat');
