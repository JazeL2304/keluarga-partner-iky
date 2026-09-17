process.env.NODE_ENV = 'test';
import app from './index.js';
import http from 'http';

const server = http.createServer(app);

server.listen(5002, async () => {
  console.log('=== TEST RUNNER STEP 2B: SKEMA ASLI (KELUARGA & ANAK) START ===');
  const baseUrl = 'http://localhost:5002';

  try {
    // 1. Test Health check
    console.log('\n[1] Testing GET /api/health...');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    console.log('Health Response:', healthData);

    // 2. Test Validasi input kosong (nama_keluarga kosong -> 400)
    console.log('\n[2] Testing POST /api/keluarga (Validasi nama_keluarga kosong)...');
    const invalidRes = await fetch(`${baseUrl}/api/keluarga`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama_keluarga: '' })
    });
    console.log('Status code validation test:', invalidRes.status);
    const invalidData = await invalidRes.json();
    console.log('Validation response:', invalidData);

    // 3. Test Submit Data Valid Kuesioner Asli (Relasional 1-to-many)
    console.log('\n[3] Testing POST /api/keluarga (Data Kuesioner Asli)...');
    const validPayload = {
      nama_keluarga: 'Keluarga Hendra Pratama',
      pribadi_instansi: 'Pribadi',
      nama_ayah: 'Hendra Pratama',
      stifin_ayah: 'Thinking Introvert',
      golongan_darah_ayah: 'O',
      nama_ibu: 'Siti Nurhaliza',
      stifin_ibu: 'Feeling Extrovert',
      golongan_darah_ibu: 'A',
      jumlah_anak: 2,
      anak: [
        {
          nama: 'Ahmad Dani',
          stifin: 'Sensing Extrovert',
          golongan_darah: 'O'
        },
        {
          nama: 'Aisyah Putri',
          stifin: 'Intuiting Introvert',
          golongan_darah: 'A'
        }
      ]
    };

    const submitRes = await fetch(`${baseUrl}/api/keluarga`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload)
    });

    console.log('Status code submit test:', submitRes.status);
    const submitData = await submitRes.json();
    console.log('Submit response:', JSON.stringify(submitData, null, 2));

    // 4. Test GET /api/keluarga
    console.log('\n[4] Testing GET /api/keluarga (Relasional 1-to-Many)...');
    const listRes = await fetch(`${baseUrl}/api/keluarga`);
    const listData = await listRes.json();
    console.log('Total keluarga tersimpan di Supabase:', listData.count);
    if (listData.data && listData.data.length > 0) {
      console.log('Keluarga terakhir beserta data anak:', JSON.stringify(listData.data[0], null, 2));
    }

    if (
      submitRes.status === 201 &&
      submitData.success &&
      submitData.data.nomor_sertifikat &&
      Array.isArray(submitData.data.anak) &&
      submitData.data.anak.length === 2
    ) {
      console.log('\n🎉 ALL STEP 2B TESTS PASSED SUCCESSFULLY!');
    } else {
      console.error('\n❌ STEP 2B TEST FAILED');
    }
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    server.close(() => {
      console.log('Test server closed.');
      process.exit(0);
    });
  }
});
