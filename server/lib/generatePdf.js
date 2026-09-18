import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.join(__dirname, '../assets/certificate_template.png');

/**
 * Format nama keluarga ke format resmi piagam (contoh: "BOY HAMZAH FAMILY")
 * @param {string} rawName 
 * @returns {{ line1: string, line2: string }}
 */
function formatFamilyName(rawName) {
  if (!rawName || !rawName.trim()) {
    return { line1: 'KELUARGA PARTNER', line2: 'FAMILY' };
  }

  const cleaned = rawName
    .toUpperCase()
    .replace(/^KELUARGA\s+/i, '')
    .replace(/\s+FAMILY$/i, '')
    .trim();

  return {
    line1: cleaned || 'KELUARGA PARTNER',
    line2: 'FAMILY'
  };
}

/**
 * Menghasilkan buffer dokumen PDF Piagam Apresiasi Well Identified Family I Know You
 * @param {Object} data
 * @param {string} data.nama_keluarga
 * @param {string} [data.nama_kepala_keluarga]
 * @returns {Promise<Uint8Array>} PDF byte buffer
 */
export async function generateCertificatePdf({ nama_keluarga, nama_kepala_keluarga }) {
  const pdfDoc = await PDFDocument.create();
  
  // Format sertifikat lanskap: A4 (842 x 595 pt)
  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  // 1. Embed background template image asli resmi (1024 x 723 px disesuaikan ke A4 Landscape)
  if (fs.existsSync(templatePath)) {
    const templateBytes = fs.readFileSync(templatePath);
    const templateImage = await pdfDoc.embedPng(templateBytes);
    page.drawImage(templateImage, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  // 2. Embed Font Resmi (Helvetica-BoldOblique untuk efek miring tebal khas piagam)
  const fontBoldOblique = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

  // 3. Render Nama Keluarga di panel marun kiri persis di posisi template asli
  // Warna Emas Piagam (#D4AF37)
  const goldColor = rgb(212 / 255, 175 / 255, 55 / 255);

  const rawName = nama_keluarga || nama_kepala_keluarga || 'Keluarga Partner';
  const { line1, line2 } = formatFamilyName(rawName);

  // Titik tengah horizontal panel marun kiri (lebar panel ~230 pt)
  const panelCenterX = 115;
  let fontSize = 21;

  // Cek lebar baris 1 agar tidak meluber dari panel marun (maks 185 pt)
  const line1Width = fontBoldOblique.widthOfTextAtSize(line1, fontSize);
  if (line1Width > 185) {
    fontSize = Math.max(12, Math.floor(fontSize * (185 / line1Width)));
  }

  const measuredLine1Width = fontBoldOblique.widthOfTextAtSize(line1, fontSize);
  const measuredLine2Width = fontBoldOblique.widthOfTextAtSize(line2, fontSize);

  // Cetak Baris 1 (Nama Inti)
  page.drawText(line1, {
    x: panelCenterX - (measuredLine1Width / 2),
    y: 280,
    size: fontSize,
    font: fontBoldOblique,
    color: goldColor,
  });

  // Cetak Baris 2 ("FAMILY")
  page.drawText(line2, {
    x: panelCenterX - (measuredLine2Width / 2),
    y: 280 - (fontSize * 1.35),
    size: fontSize,
    font: fontBoldOblique,
    color: goldColor,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

