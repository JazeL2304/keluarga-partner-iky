process.env.NODE_ENV = 'test';
import app from './index.js';
import http from 'http';

const server = http.createServer(app);

server.listen(5001, async () => {
  console.log('--- TEST RUNNER STEP 2 START ---');
  const baseUrl = 'http://localhost:5001';

  try {
    // 1. Test Health check
    console.log('Testing GET /api/health...');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    console.log('Health Response:', healthData);

    // 2. Test Validasi input kosong (harus 400)
    console.log('\nTesting POST /api/keluarga (Validasi input kosong)...');
    const invalidRes = await fetch(`${baseUrl}/api/keluarga`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama_kepala_keluarga: '' })
    });
    console.log('Status code validation test:', invalidRes.status);
    const invalidData = await invalidRes.json();
    console.log('Validation response:', invalidData);

    // 3. Test Submit Data Valid ke Supabase
    console.log('\nTesting POST /api/keluarga (Data Valid)...');
    const validPayload = {
      nama_kepala_keluarga: 'Ir. Hendra Pratama, M.T.',
      jumlah_anggota: 4,
      kontak: '081298765432 / hendra.pratama@example.com',
      alamat: 'Jl. Boulevard Raya Blok A4 No. 10, Jakarta Selatan'
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
    console.log('\nTesting GET /api/keluarga...');
    const listRes = await fetch(`${baseUrl}/api/keluarga`);
    const listData = await listRes.json();
    console.log('Total data tersimpan di Supabase:', listData.count);
    console.log('Data terakhir:', listData.data[0]);

    if (submitRes.status === 201 && submitData.success && submitData.data.nomor_sertifikat) {
      console.log('\n🎉 ALL STEP 2 TESTS PASSED!');
    } else {
      console.error('\n❌ TEST FAILED');
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
