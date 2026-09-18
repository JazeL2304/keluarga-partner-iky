import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Edit3, ArrowLeft, Send, Loader2, Baby, User, Building2 } from 'lucide-react';

export default function StepThreeKonfirmasi({ formData, onPrev, onEdit, onSubmit, isSubmitting }) {
  const {
    pribadi_instansi,
    nama_instansi_custom,
    nama_keluarga,
    nama_ayah,
    stifin_ayah,
    golongan_darah_ayah,
    nama_ibu,
    stifin_ibu,
    golongan_darah_ibu,
    jumlah_anak,
    anak,
  } = formData;

  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    const rawName = nama_keluarga || 'Keluarga Partner';
    const verifyTarget = `https://stifiniknowyou.com/sertifikat?keluarga=${encodeURIComponent(rawName)}`;
    QRCode.toDataURL(verifyTarget, {
      margin: 1,
      width: 140,
      color: {
        dark: '#1F1A1B',
        light: '#FFFFFF'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating preview QR:', err));
  }, [nama_keluarga]);

  const isInstansi = pribadi_instansi === 'Instansi';
  const anakList = Array.isArray(anak) ? anak : [];

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        {/* Step Header */}
        <header className="mb-7 pb-4 border-b border-[#EAE3D7]">
          <span className="text-xs font-serif italic text-[#C4A36B] tracking-wider block mb-1">
            Tahap III dari III
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1A1B] tracking-tight">
            Konfirmasi Kemitraan &amp; Pratinjau Piagam
          </h1>
          <p className="text-xs sm:text-sm text-[#8A827E] mt-1.5 max-w-xl leading-relaxed">
            Periksa kembali profil genetika keluarga Anda sebelum piagam resmi diterbitkan dan dicatat ke database resmi.
          </p>
        </header>

        {/* Part 1: Data Summary Registry Box */}
        <div className="bg-[#FAF8F5] border border-[#EAE3D7] rounded-xl p-5 sm:p-6 mb-7 shadow-warm-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D7]">
            <h2 className="font-serif text-base font-bold text-[#58121A] tracking-tight">
              Ringkasan Data Kemitraan
            </h2>
            <button
              type="button"
              onClick={onEdit}
              className="text-xs font-semibold text-[#58121A] hover:text-[#952230] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#C4A36B]" />
              <span>Koreksi Data</span>
            </button>
          </div>

          {/* Kategori & Nama Keluarga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#EAE3D7] text-xs">
            <div>
              <span className="text-[#8A827E] block mb-0.5">Jalur Kemitraan</span>
              <div className="font-semibold text-[#1F1A1B] text-sm flex items-center gap-1.5">
                {isInstansi ? (
                  <>
                    <Building2 className="w-4 h-4 text-[#C4A36B]" />
                    <span>Instansi: {nama_instansi_custom || '—'}</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 text-[#C4A36B]" />
                    <span>Pribadi / Keluarga</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <span className="text-[#8A827E] block mb-0.5">Nama Keluarga di Piagam</span>
              <div className="font-serif font-bold text-[#58121A] text-base">
                {nama_keluarga || '—'}
              </div>
            </div>
          </div>

          {/* Profil Orang Tua: Ayah & Ibu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ayah */}
            <div className="p-3.5 rounded-lg bg-white border border-[#EAE3D7] text-xs">
              <div className="font-serif font-bold text-[#58121A] mb-2 pb-1.5 border-b border-[#EAE3D7] flex items-center justify-between">
                <span>Profil Ayah</span>
                <span className="text-[10px] font-sans font-normal text-[#8A827E]">Kepala Keluarga</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#8A827E]">Nama:</span>
                  <span className="font-medium text-[#1F1A1B] text-right">{nama_ayah || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A827E]">STIFIn:</span>
                  <span className="font-semibold text-[#58121A] text-right">{stifin_ayah || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A827E]">Gol. Darah:</span>
                  <span className="font-mono text-[#1F1A1B] text-right">{golongan_darah_ayah || '—'}</span>
                </div>
              </div>
            </div>

            {/* Ibu */}
            <div className="p-3.5 rounded-lg bg-white border border-[#EAE3D7] text-xs">
              <div className="font-serif font-bold text-[#58121A] mb-2 pb-1.5 border-b border-[#EAE3D7] flex items-center justify-between">
                <span>Profil Ibu</span>
                <span className="text-[10px] font-sans font-normal text-[#8A827E]">Ibu Keluarga</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#8A827E]">Nama:</span>
                  <span className="font-medium text-[#1F1A1B] text-right">{nama_ibu || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A827E]">STIFIn:</span>
                  <span className="font-semibold text-[#58121A] text-right">{stifin_ibu || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A827E]">Gol. Darah:</span>
                  <span className="font-mono text-[#1F1A1B] text-right">{golongan_darah_ibu || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profil Anak-Anak */}
          <div>
            <div className="flex items-center justify-between mb-2.5 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#58121A]">
                <Baby className="w-3.5 h-3.5 text-[#C4A36B]" />
                <span>Profil Anak ({jumlah_anak || 0} Anak Terdata)</span>
              </div>
            </div>

            {anakList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {anakList.map((ch, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white border border-[#EAE3D7] text-xs shadow-warm-sm">
                    <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-[#EAE3D7]">
                      <span className="font-serif font-bold text-[#58121A]">Anak ke-{idx + 1}</span>
                      <span className="font-mono text-[10px] bg-[#FAF8F5] text-[#675F5B] px-1.5 py-0.5 rounded border border-[#EAE3D7]">
                        Gol. {ch.golongan_darah || '—'}
                      </span>
                    </div>
                    <div className="font-medium text-[#1F1A1B] truncate mb-0.5">
                      {ch.nama || `Anak ke-${idx + 1}`}
                    </div>
                    <div className="text-[11px] text-[#C4A36B] font-semibold">
                      {ch.stifin || 'STIFIn belum dipilih'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-white border border-[#EAE3D7] text-xs text-[#8A827E] text-center">
                Belum ada data anak yang didaftarkan.
              </div>
            )}
          </div>
        </div>

        {/* Part 2: Authentic Certificate Document Preview 1:1 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-base font-bold text-[#1F1A1B] tracking-tight">
              Pratinjau Piagam Apresiasi Resmi
            </h2>
            <span className="text-[11px] text-[#8A827E] font-serif italic">
              A4 Landscape · 1:1 Template Resmi Miss Hiday
            </span>
          </div>

          {/* Realistic Physical Certificate Canvas on Warm Mat */}
          <div className="bg-[#F3EFE7] border border-[#DED6CA] rounded-xl p-3 sm:p-5 shadow-warm">
            <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-lg shadow-warm-lg border border-[#DED6CA] select-none aspect-[1024/723]">
              {/* Background Template Master Resmi */}
              <img
                src="/certificate_template.png"
                alt="Piagam Apresiasi Well Identified Family I Know You"
                className="w-full h-full object-cover block pointer-events-none"
              />

              {/* Dynamic Family Name Overlay di Panel Merah Marun Kiri */}
              <div
                style={{ fontFamily: "'CertificateNameFont', 'Arial Narrow', sans-serif" }}
                className="absolute left-[13.7%] top-[52.8%] -translate-x-1/2 -translate-y-1/2 w-[24%] text-center pointer-events-none flex flex-col items-center justify-center select-none"
              >
                <span className="font-bold italic uppercase tracking-wider text-[#C4A36B] text-[11px] sm:text-[14px] md:text-[17px] lg:text-[19px] leading-[1.05] break-words">
                  {(() => {
                    const raw = nama_keluarga || 'Keluarga Partner';
                    return raw.toUpperCase().replace(/^KELUARGA\s+/i, '').replace(/\s+FAMILY$/i, '').trim() || 'KELUARGA';
                  })()}
                </span>
                <span className="font-bold italic uppercase tracking-wider text-[#C4A36B] text-[11px] sm:text-[14px] md:text-[17px] lg:text-[19px] leading-[1.05] mt-1">
                  FAMILY
                </span>
              </div>

              {/* Dynamic QR Code Verifikasi Keaslian di Panel Marun */}
              {qrDataUrl && (
                <div className="absolute left-[13.7%] top-[77.2%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none select-none">
                  <div className="p-0.5 sm:p-1 bg-white rounded shadow-xs border border-[#C4A36B]/40">
                    <img
                      src={qrDataUrl}
                      alt="QR Code Verifikasi"
                      className="w-7 h-7 sm:w-10 sm:h-10 md:w-13 md:h-13 block"
                    />
                  </div>
                  <span className="text-[5px] sm:text-[6.5px] md:text-[7.5px] font-bold tracking-wider text-[#C4A36B] uppercase mt-0.5 whitespace-nowrap">
                    Verifikasi Resmi
                  </span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#8A827E] text-center mt-3 font-serif italic">
              Piagam resmi Well Identified Family dengan stempel digital verifikasi QR Code.
            </p>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-6 border-t border-[#EAE3D7] flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          <button
            type="button"
            onClick={onPrev}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-[#DED6CA] bg-white hover:bg-[#FAF8F5] text-[#675F5B] font-medium text-xs sm:text-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Kembali</span>
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-7 py-3 rounded-lg bg-[#58121A] hover:bg-[#420D13] text-[#FAF8F5] font-medium text-sm transition-all shadow-warm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#C4A36B]" />
                <span>Menerbitkan Piagam Resmi...</span>
              </>
            ) : (
              <>
                <span>Terbitkan Piagam Sekarang</span>
                <Send className="w-4 h-4 ml-2 text-[#C4A36B]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
