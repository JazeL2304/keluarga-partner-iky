import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.join(__dirname, '../assets/certificate_template.png');
const fontPath = path.join(__dirname, '../assets/ArialNarrowBoldItalic.ttf');

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
  pdfDoc.registerFontkit(fontkit);
  
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

  // 2. Embed Font Asli (Arial Narrow Bold Italic identik 100% dengan desain asli)
  let fontCustom;
  if (fs.existsSync(fontPath)) {
    const fontBytes = fs.readFileSync(fontPath);
    fontCustom = await pdfDoc.embedFont(fontBytes);
  } else {
    fontCustom = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);
  }

  // 3. Warna Emas Asli Hasil Sampling Pixel (#C4A36B / RGB 196, 163, 108)
  const exactColor = rgb(196 / 255, 163 / 255, 108 / 255);

  const rawName = nama_keluarga || nama_kepala_keluarga || 'Keluarga Partner';
  const { line1, line2 } = formatFamilyName(rawName);

  // Titik tengah horizontal panel marun kiri (lebar panel ~230 pt)
  const panelCenterX = 115;
  let fontSize = 23;

  // Cek lebar baris 1 agar pas di dalam panel marun
  const line1Width = fontCustom.widthOfTextAtSize(line1, fontSize);
  if (line1Width > 185) {
    fontSize = Math.max(12, Math.floor(fontSize * (185 / line1Width)));
  }

  const measuredLine1Width = fontCustom.widthOfTextAtSize(line1, fontSize);
  const measuredLine2Width = fontCustom.widthOfTextAtSize(line2, fontSize);

  // Cetak Baris 1 (Nama Inti)
  page.drawText(line1, {
    x: panelCenterX - (measuredLine1Width / 2),
    y: 282,
    size: fontSize,
    font: fontCustom,
    color: exactColor,
  });

  // Cetak Baris 2 ("FAMILY")
  page.drawText(line2, {
    x: panelCenterX - (measuredLine2Width / 2),
    y: 282 - (fontSize * 1.25),
    size: fontSize,
    font: fontCustom,
    color: exactColor,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}


