import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Menghasilkan buffer dokumen PDF Sertifikat Kemitraan Keluarga Partner I Know You
 * @param {Object} data
 * @param {string} data.nama_keluarga
 * @param {string} [data.nama_kepala_keluarga]
 * @param {string} data.nomor_sertifikat
 * @param {string} data.tanggal_submit
 * @returns {Promise<Uint8Array>} PDF byte buffer
 */
export async function generateCertificatePdf({ nama_keluarga, nama_kepala_keluarga, nomor_sertifikat, tanggal_submit }) {
  const pdfDoc = await PDFDocument.create();
  
  // Format sertifikat lanskap: A4 (841.89 x 595.28 pt)
  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Palette warna branding
  const navyColor = rgb(30 / 255, 58 / 255, 138 / 255); // #1E3A8A
  const pinkColor = rgb(255 / 255, 64 / 255, 129 / 255); // #FF4081
  const slateColor = rgb(15 / 255, 23 / 255, 42 / 255);  // #0F172A
  const mutedColor = rgb(100 / 255, 116 / 255, 139 / 255); // #64748B

  // 1. Frame border dekoratif luar & dalam
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderWidth: 3,
    borderColor: navyColor,
    color: rgb(1, 1, 1),
  });

  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderWidth: 1,
    borderColor: pinkColor,
  });

  // Aksen sudut dekoratif
  const cornerSize = 25;
  page.drawRectangle({ x: 28, y: height - 28 - cornerSize, width: cornerSize, height: cornerSize, color: navyColor });
  page.drawRectangle({ x: width - 28 - cornerSize, y: height - 28 - cornerSize, width: cornerSize, height: cornerSize, color: navyColor });
  page.drawRectangle({ x: 28, y: 28, width: cornerSize, height: cornerSize, color: navyColor });
  page.drawRectangle({ x: width - 28 - cornerSize, y: 28, width: cornerSize, height: cornerSize, color: navyColor });

  // 2. Header & Logo Placeholder
  page.drawText('I KNOW YOU', {
    x: width / 2 - (fontBold.widthOfTextAtSize('I KNOW YOU', 26) / 2),
    y: height - 85,
    size: 26,
    font: fontBold,
    color: navyColor,
  });

  page.drawText('PLATFORM PENGEMBANGAN DIRI & KELUARGA BERBASIS STIFIn', {
    x: width / 2 - (fontBold.widthOfTextAtSize('PLATFORM PENGEMBANGAN DIRI & KELUARGA BERBASIS STIFIn', 9) / 2),
    y: height - 105,
    size: 9,
    font: fontBold,
    color: pinkColor,
  });

  // Garis pemisah header
  page.drawLine({
    start: { x: width / 2 - 150, y: height - 120 },
    end: { x: width / 2 + 150, y: height - 120 },
    thickness: 1.5,
    color: pinkColor,
  });

  // 3. Judul Sertifikat
  const titleText = 'PIAGAM KEMITRAAN KELUARGA';
  page.drawText(titleText, {
    x: width / 2 - (fontBold.widthOfTextAtSize(titleText, 22) / 2),
    y: height - 160,
    size: 22,
    font: fontBold,
    color: slateColor,
  });

  // Nomor Sertifikat
  const nomorText = `Nomor: ${nomor_sertifikat || 'IKY-0001'}`;
  page.drawText(nomorText, {
    x: width / 2 - (fontRegular.widthOfTextAtSize(nomorText, 11) / 2),
    y: height - 180,
    size: 11,
    font: fontRegular,
    color: mutedColor,
  });

  // Subtitle
  const subText = 'Dengan bangga piagam ini dianugerahkan sebagai apresiasi kemitraan resmi kepada:';
  page.drawText(subText, {
    x: width / 2 - (fontOblique.widthOfTextAtSize(subText, 12) / 2),
    y: height - 230,
    size: 12,
    font: fontOblique,
    color: slateColor,
  });

  // 4. Nama Keluarga (Paling Menonjol)
  const namaPenerima = nama_keluarga || nama_kepala_keluarga || 'Keluarga Mitra IKY';
  page.drawText(namaPenerima, {
    x: width / 2 - (fontBold.widthOfTextAtSize(namaPenerima, 28) / 2),
    y: height - 280,
    size: 28,
    font: fontBold,
    color: navyColor,
  });

  // Garis penegas di bawah nama
  const namaWidth = fontBold.widthOfTextAtSize(namaPenerima, 28);
  page.drawLine({
    start: { x: width / 2 - (namaWidth / 2) - 20, y: height - 290 },
    end: { x: width / 2 + (namaWidth / 2) + 20, y: height - 290 },
    thickness: 2,
    color: pinkColor,
  });

  // Keterangan Kemitraan
  const descText = 'Atas komitmen dan kontribusi aktif sebagai Keluarga Partner I Know You dalam mendukung pengembangan potensi genetik keluarga.';
  page.drawText(descText, {
    x: width / 2 - (fontRegular.widthOfTextAtSize(descText, 11) / 2),
    y: height - 325,
    size: 11,
    font: fontRegular,
    color: slateColor,
  });

  // 5. Informasi Tanggal & Tanda Tangan
  const formattedDate = tanggal_submit 
    ? new Date(tanggal_submit).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  // Sisi Kiri: Tanggal Terbit & Validasi
  page.drawText(`Diterbitkan pada: ${formattedDate}`, {
    x: 80,
    y: 120,
    size: 10,
    font: fontRegular,
    color: slateColor,
  });
  page.drawText('Status: Terverifikasi Digital Resmi', {
    x: 80,
    y: 105,
    size: 9,
    font: fontBold,
    color: pinkColor,
  });

  // Sisi Kanan: Tanda Tangan Manajemen
  const ttdJabatan = 'Manajemen I Know You Indonesia';
  page.drawText(ttdJabatan, {
    x: width - 80 - fontRegular.widthOfTextAtSize(ttdJabatan, 11),
    y: 135,
    size: 11,
    font: fontRegular,
    color: slateColor,
  });

  // Garis tanda tangan digital
  page.drawLine({
    start: { x: width - 260, y: 80 },
    end: { x: width - 80, y: 80 },
    thickness: 1,
    color: mutedColor,
  });

  const ttdNama = 'Authorized Signature';
  page.drawText(ttdNama, {
    x: width - 80 - fontBold.widthOfTextAtSize(ttdNama, 10),
    y: 65,
    size: 10,
    font: fontBold,
    color: navyColor,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
