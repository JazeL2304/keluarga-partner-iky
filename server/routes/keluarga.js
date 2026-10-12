import express from 'express';
import { supabase } from '../lib/supabase.js';
import { generateCertificatePdf } from '../lib/generatePdf.js';

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
 * Mengambil daftar keluarga partner beserta data anak (relasi 1-to-many)
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
      .from('keluarga')
      .select('*, anak(*)')
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
 * GET /api/keluarga/:id/pdf
 * Mengunduh langsung berkas PDF sertifikat resmi berdasarkan ID keluarga
 */
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;

    if (!supabase) {
      return res.status(503).json({ success: false, message: 'Supabase belum dikonfigurasi' });
    }

    const { data: keluarga, error } = await supabase
      .from('keluarga')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !keluarga) {
      return res.status(404).json({ success: false, message: 'Data keluarga tidak ditemukan' });
    }

    const publicUrl = keluarga.url_sertifikat || (process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL}/storage/v1/object/public/sertifikat/${keluarga.nomor_sertifikat || 'IKY'}.pdf` : undefined);
    const pdfBuffer = await generateCertificatePdf({
      nama_keluarga: keluarga.nama_keluarga,
      nomor_sertifikat: keluarga.nomor_sertifikat,
      verification_url: publicUrl,
    });

    const safeFilename = `Sertifikat-${(keluarga.nomor_sertifikat || 'IKY').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    return res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error('Error streaming PDF certificate:', error);
    return res.status(500).json({ success: false, message: 'Gagal membuat file PDF sertifikat' });
  }
});

/**
 * POST /api/keluarga
 * Menerima submission kuesioner asli "Well Identified Family I Know You":
 * 1. Insert ke tabel keluarga
 * 2. Ambil id keluarga
 * 3. Insert batch ke tabel anak dengan keluarga_id
 * 4. Generate nomor sertifikat unik
 * 5. Generate berkas PDF sertifikat via pdf-lib
 * 6. Upload PDF ke Supabase Storage (bucket 'sertifikat') & update url_sertifikat
 */
router.post('/', async (req, res) => {
  try {
    const {
      nama_keluarga,
      pribadi_instansi,
      no_wa,
      email,
      nama_ayah,
      stifin_ayah,
      golongan_darah_ayah,
      nama_ibu,
      stifin_ibu,
      golongan_darah_ibu,
      kesan_pesan,
      jumlah_anak,
      anak
    } = req.body;

    // 1. Validasi input wajib
    if (!nama_keluarga || typeof nama_keluarga !== 'string' || !nama_keluarga.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nama Keluarga wajib diisi (digunakan untuk penerbitan sertifikat)'
      });
    }

    const parsedJumlahAnak = Math.max(0, parseInt(jumlah_anak, 10) || 0);

    // 2. Cek konfigurasi Supabase
    if (!supabase) {
      return res.status(503).json({
        success: false,
        message: 'Koneksi Supabase belum dikonfigurasi. Periksa SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di server/.env'
      });
    }

    // 3. Generate nomor sertifikat unik (format: IKY-000X)
    const { count, error: countError } = await supabase
      .from('keluarga')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.warn('Gagal menghitung jumlah row keluarga:', countError.message);
    }

    const nomor_sertifikat = formatCertificateNumber(count || 0);

    // 4. Step 1: Insert 1 row ke tabel keluarga
    const keluargaPayload = {
      nama_keluarga: nama_keluarga.trim(),
      pribadi_instansi: pribadi_instansi ? String(pribadi_instansi).trim() : null,
      no_wa: no_wa ? String(no_wa).trim() : null,
      email: email ? String(email).trim() : null,
      nama_ayah: nama_ayah ? String(nama_ayah).trim() : null,
      stifin_ayah: stifin_ayah ? String(stifin_ayah).trim() : null,
      golongan_darah_ayah: golongan_darah_ayah ? String(golongan_darah_ayah).trim() : null,
      nama_ibu: nama_ibu ? String(nama_ibu).trim() : null,
      stifin_ibu: stifin_ibu ? String(stifin_ibu).trim() : null,
      golongan_darah_ibu: golongan_darah_ibu ? String(golongan_darah_ibu).trim() : null,
      kesan_pesan: kesan_pesan ? String(kesan_pesan).trim() : null,
      jumlah_anak: parsedJumlahAnak,
      nomor_sertifikat,
      url_sertifikat: null
    };

    let insertedKeluarga;
    let currentPayload = { ...keluargaPayload };
    let lastError = null;

    // Coba insert dengan payload lengkap, dan otomatis strip kolom jika belum dimigrasi di Supabase
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data: insertedData, error: err } = await supabase
        .from('keluarga')
        .insert([currentPayload])
        .select()
        .single();

      if (!err) {
        insertedKeluarga = insertedData;
        lastError = null;
        break;
      }

      lastError = err;
      // Deteksi jika error karena kolom tidak ditemukan di schema cache (PostgREST code PGRST204 / 42703)
      const missingColMatch = err.message?.match(/Could not find the '(\w+)' column/);
      if (missingColMatch && missingColMatch[1] && currentPayload[missingColMatch[1]] !== undefined) {
        const col = missingColMatch[1];
        console.warn(`[Supabase Schema Fallback] Kolom '${col}' belum ada di database, menyimpan tanpa kolom '${col}'...`);
        delete currentPayload[col];
      } else {
        break;
      }
    }

    if (lastError || !insertedKeluarga) {
      throw lastError || new Error('Gagal menyimpan data keluarga ke database Supabase');
    }



    // 5. Step 2 & 3: Ambil ID keluarga baru dan insert data anak jika ada
    let insertedAnak = [];
    if (Array.isArray(anak) && anak.length > 0) {
      const anakPayload = anak.map((a) => ({
        keluarga_id: insertedKeluarga.id,
        nama: a.nama ? String(a.nama).trim() : '',
        stifin: a.stifin ? String(a.stifin).trim() : null,
        golongan_darah: a.golongan_darah ? String(a.golongan_darah).trim() : null
      }));

      const { data: anakData, error: anakError } = await supabase
        .from('anak')
        .insert(anakPayload)
        .select();

      if (anakError) {
        console.error('Peringatan: Gagal menyimpan data anak:', anakError);
      } else {
        insertedAnak = anakData || [];
      }
    }

    let finalCertificateUrl = `/api/keluarga/${insertedKeluarga.id}/pdf`;
    const fileName = `${insertedKeluarga.nomor_sertifikat}.pdf`;
    let targetVerificationUrl = finalCertificateUrl;

    if (process.env.SUPABASE_URL) {
      targetVerificationUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/sertifikat/${fileName}`;
    }

    try {
      const pdfBuffer = await generateCertificatePdf({
        nama_keluarga: insertedKeluarga.nama_keluarga,
        nomor_sertifikat: insertedKeluarga.nomor_sertifikat,
        verification_url: targetVerificationUrl,
      });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('sertifikat')
        .upload(fileName, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('sertifikat')
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          finalCertificateUrl = publicUrlData.publicUrl;
        }
      } else if (uploadError) {
        console.warn('Storage upload note:', uploadError.message);
      }

      // Update url_sertifikat pada row keluarga di database
      await supabase
        .from('keluarga')
        .update({ url_sertifikat: finalCertificateUrl })
        .eq('id', insertedKeluarga.id);

      insertedKeluarga.url_sertifikat = finalCertificateUrl;
    } catch (pdfErr) {
      console.error('Gagal generate/upload PDF sertifikat:', pdfErr);
    }

    // 7. Return response sukses relasional
    return res.status(201).json({
      success: true,
      message: 'Data keluarga, profil genetika, dan sertifikat berhasil diproses',
      data: {
        ...insertedKeluarga,
        url_sertifikat: finalCertificateUrl,
        anak: insertedAnak
      }
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

