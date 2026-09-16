# Sistem Pendataan & Otomatisasi Sertifikat Keluarga Partner I Know You

Sistem berbasis web untuk pendataan keluarga partner I Know You (STIFIn) yang secara otomatis menerbitkan piagam sertifikat resmi (PDF) secara instan tanpa approval manual saat submit.

---

## 🏛️ Arsitektur & Struktur Proyek

Proyek ini menggunakan struktur monorepo:

```
keluarga-partner-iky/
├── client/                      # Frontend: React (Vite) + Tailwind CSS + Lucide Icons
│   ├── src/
│   │   ├── components/          # Komponen multi-step wizard & preview sertifikat
│   │   ├── App.jsx              # Main application flow
│   │   ├── index.css            # Tailwind directives & global typography
│   │   └── main.jsx
│   ├── index.html               # Head metadata & Plus Jakarta Sans
│   ├── tailwind.config.js       # Palet warna resmi IKY & container styling
│   └── package.json
├── server/                      # Backend: Node.js + Express
│   ├── lib/
│   │   ├── supabase.js          # Supabase client (Service Role)
│   │   └── generatePdf.js       # Generator sertifikat PDF via pdf-lib
│   ├── routes/
│   │   └── keluarga.js          # REST API endpoint POST /api/keluarga
│   ├── schema.sql               # Skrip inisialisasi tabel Supabase & Storage Bucket
│   ├── index.js                 # Express server entry point
│   ├── .env.example             # Contoh environment variable
│   └── package.json
└── README.md                    # Dokumentasi panduan implementasi
```

---

## 🎨 Tech Stack & Branding

- **Frontend**: React (Vite), Tailwind CSS, React Hook Form, Lucide React, Canvas Confetti
- **Backend**: Node.js, Express, Multer
- **Database & Storage**: Supabase (PostgreSQL) + Supabase Storage Bucket `sertifikat`
- **PDF Engine**: `pdf-lib` (A4 Landscape, Vector Border, Typographic Hierarchy)
- **Branding Tokens**:
  - Primary Navy: `#1E3A8A`
  - Secondary Pink: `#FF4081` (Hover: `#E02868`)
  - Dark Slate: `#0F172A`
  - Typography: **Plus Jakarta Sans**

---

## ⚡ Panduan Setup Cepat

### 1. Prasyarat
- Node.js versi 18+ (Disarankan LTS atau v22+)
- Akun Supabase (project baru)

### 2. Setup Database & Storage Supabase (Step 1)
1. Buka dashboard project di [Supabase](https://supabase.com).
2. Masuk ke menu **SQL Editor**, buka file `server/schema.sql` di repo ini, copy dan jalankan (RUN):
   ```sql
   create table keluarga_partner (
     id uuid primary key default gen_random_uuid(),
     nama_kepala_keluarga text,
     jumlah_anggota integer,
     kontak text,
     alamat text,
     tanggal_submit timestamp default now(),
     nomor_sertifikat text,
     url_sertifikat text
   );
   ```
3. Buat bucket Storage bernama `sertifikat` dan aktifkan **Public bucket**.
4. Masuk ke **Project Settings -> API**, salin:
   - `Project URL`
   - `service_role key` (secret)

### 3. Konfigurasi Backend (`server/`)
1. Buka file `server/.env` dan isi kredensial Supabase:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-secret-key
   ```
2. Jalankan server:
   ```bash
   cd server
   npm install
   npm run dev
   ```
   Server akan berjalan di `http://localhost:5000`.

### 4. Konfigurasi Frontend (`client/`)
1. Buka terminal baru:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Frontend akan berjalan di `http://localhost:5173`.

---

## 📡 Dokumentasi Endpoint API

| Method | Endpoint | Deskripsi | Status |
|---|---|---|---|
| `GET` | `/api/health` | Status server & koneksi Supabase | Siap |
| `GET` | `/api/keluarga` | Daftar keluarga partner (debugging) | Siap |
| `POST` | `/api/keluarga` | Submit form pendataan keluarga | Siap (Step 2) |
