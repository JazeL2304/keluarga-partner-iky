import express from 'express';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

/**
 * Helper untuk format nomor sertifikat: IKY-0001, IKY-0002, dst.
 * @param {number} count 
 * @returns {string}
 */
function formatCertificateNumber(count) {
  const nextNum = (count || 0) + 1;
  return `IKY-${String(nextNum).padStart(4, '0')}`;
}

/**
 * GET /api/keluarga
 * Mengambil daftar keluarga partner (untuk verifikasi / debugging)
 */
router.get('/', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        success: false,
        message: 'Koneksi Supabase belum dikonfigurasi. Periksa file server/.env'
      });
    }

    const { data, error } = await supabase
      .from('keluarga_partner')
      .select('*')
      .order('tanggal_submit', { ascending: false });

    if (error) throw error;

    return res.json({
      success: true,
      data,
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error fetching keluarga:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Gagal mengambil data'
    });
  }
});

/**
 * POST /api/keluarga
 * Menerima submission form pendataan keluarga partner
 */
router.post('/', async (req, res) => {
  try {
    const { nama_kepala_keluarga, jumlah_anggota, kontak, alamat } = req.body;

    // 1. Validasi input dasar
    if (!nama_kepala_keluarga || typeof nama_kepala_keluarga !== 'string' || !nama_kepala_keluarga.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nama Kepala Keluarga wajib diisi'
      });
    }

    if (!kontak || typeof kontak !== 'string' || !kontak.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Kontak (No HP / Email) wajib diisi'
      });
    }

    const parsedJumlahAnggota = parseInt(jumlah_anggota, 10);
    if (isNaN(parsedJumlahAnggota) || parsedJumlahAnggota < 1) {
      return res.status(400).json({
        success: false,
        message: 'Jumlah anggota keluarga minimal 1 orang'
      });
    }

    // 2. Cek konfigurasi Supabase
    if (!supabase) {
      return res.status(503).json({
        success: false,
        message: 'Koneksi Supabase belum dikonfigurasi. Silakan lengkapi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di server/.env'
      });
    }

    // 3. Generate nomor sertifikat otomatis (format: IKY-000X)
    const { count, error: countError } = await supabase
      .from('keluarga_partner')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.warn('Gagal menghitung jumlah row, menggunakan default timestamp sequence:', countError.message);
    }

    const nomor_sertifikat = formatCertificateNumber(count || 0);

    // 4. Insert data awal ke database Supabase
    const payload = {
      nama_kepala_keluarga: nama_kepala_keluarga.trim(),
      jumlah_anggota: parsedJumlahAnggota,
      kontak: kontak.trim(),
      alamat: alamat ? alamat.trim() : '',
      nomor_sertifikat,
      url_sertifikat: null
    };

    const { data: insertedData, error: insertError } = await supabase
      .from('keluarga_partner')
      .insert([payload])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return res.status(201).json({
      success: true,
      message: 'Data keluarga partner berhasil disimpan',
      data: insertedData
    });
  } catch (error) {
    console.error('Error saat menyimpan keluarga partner:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server saat memproses data'
    });
  }
});

export default router;
