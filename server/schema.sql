-- ==============================================================================
-- Schema Database: Sistem Pendataan & Otomatisasi Sertifikat Keluarga Partner I Know You
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda.
-- ==============================================================================

-- 1. Buat Tabel keluarga_partner
CREATE TABLE IF NOT EXISTS public.keluarga_partner (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_kepala_keluarga TEXT NOT NULL,
  jumlah_anggota INTEGER NOT NULL DEFAULT 1,
  kontak TEXT NOT NULL,
  alamat TEXT,
  tanggal_submit TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  nomor_sertifikat TEXT,
  url_sertifikat TEXT
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.keluarga_partner ENABLE ROW LEVEL SECURITY;

-- Policy agar backend (service_role) dapat mengelola data secara penuh,
-- dan anon/publik dapat membaca jika diperlukan.
CREATE POLICY "Allow public read access"
  ON public.keluarga_partner
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
