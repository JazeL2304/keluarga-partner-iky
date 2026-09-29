import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Edit3, ArrowLeft, Send, Loader2, Baby, User, Building2, UserCircle2 } from 'lucide-react';

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
    kesan_pesan,
  } = formData;

  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    const rawName = nama_keluarga || 'Keluarga Partner';
    const verifyTarget = `https://stifiniknowyou.com/sertifikat?keluarga=${encodeURIComponent(rawName)}`;
    QRCode.toDataURL(verifyTarget, {
      margin: 1,
      width: 140,
      color: {
        dark: '#1E3A8A',
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
        <header className="mb-6 pb-4 border-b border-slate-200/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF4081] block mb-1">
            Tahap 3 dari 3
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Konfirmasi Well Identified Family &amp; Pratinjau Piagam
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
            Periksa kembali profil genetika keluarga partner IKY sebelum piagam resmi diterbitkan dan dicatat ke database.
          </p>
        </header>

        {/* Part 1: Data Summary Registry Box */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 sm:p-6 mb-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Ringkasan Data Kemitraan
            </h2>
            <button
              type="button"
              onClick={onEdit}
              className="text-xs font-semibold text-[#1E3A8A] hover:text-[#FF4081] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Ubah Data</span>
            </button>
          </div>

          {/* Kategori & Nama Keluarga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">Jalur Kemitraan</span>
              <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                {isInstansi ? (
                  <>
                    <Building2 className="w-4 h-4 text-[#1E3A8A]" />
                    <span>Instansi: {nama_instansi_custom || '—'}</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 text-[#1E3A8A]" />
                    <span>Pribadi / Keluarga</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">Nama Keluarga Partner IKY</span>
              <span className="font-bold text-slate-900 text-sm block truncate">
                {nama_keluarga || '—'}
              </span>
            </div>
          </div>

          {/* Profil Ayah & Ibu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200/80 text-xs">
            {/* Profil Ayah */}
            <div className="p-3.5 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-100">
                <UserCircle2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span className="font-bold text-slate-900">Ayah</span>
              </div>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nama:</span>
                  <span className="font-medium text-slate-900 text-right">{nama_ayah || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">STIFIn:</span>
                  <span className="font-semibold text-[#1E3A8A] text-right">{stifin_ayah || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gol. Darah:</span>
                  <span className="font-mono text-slate-900 text-right">{golongan_darah_ayah || '—'}</span>
                </div>
              </div>
            </div>

            {/* Profil Ibu */}
            <div className="p-3.5 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-100">
                <UserCircle2 className="w-3.5 h-3.5 text-[#FF4081]" />
                <span className="font-bold text-slate-900">Ibu</span>
              </div>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nama:</span>
                  <span className="font-medium text-slate-900 text-right">{nama_ibu || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">STIFIn:</span>
                  <span className="font-semibold text-[#FF4081] text-right">{stifin_ibu || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gol. Darah:</span>
                  <span className="font-mono text-slate-900 text-right">{golongan_darah_ibu || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profil Anak-Anak */}
          <div>
            <div className="flex items-center justify-between mb-2.5 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Baby className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>Profil Anak ({jumlah_anak || 0} Anak Terdata)</span>
              </div>
            </div>

            {anakList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {anakList.map((ch, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white border border-slate-200 text-xs shadow-xs">
                    <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-100">
                      <span className="font-bold text-slate-800">Anak ke-{idx + 1}</span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        Gol. {ch.golongan_darah || '—'}
                      </span>
                    </div>
                    <div className="font-medium text-slate-900 truncate mb-0.5">
                      {ch.nama || `Anak ke-${idx + 1}`}
                    </div>
                    <div className="text-[11px] text-[#1E3A8A] font-semibold">
                      {ch.stifin || 'STIFIn belum dipilih'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-400 text-center">
                Belum ada data anak yang didaftarkan.
              </div>
            )}
          </div>

          {/* Kesan & Pesan Kemitraan (Feedback) */}
          {kesan_pesan && (
            <div className="pt-2 border-t border-slate-200/80">
              <span className="text-xs font-bold text-slate-800 block mb-1">
                Kesan &amp; Pesan Kemitraan:
              </span>
              <p className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 italic text-xs leading-relaxed">
                &ldquo;{kesan_pesan}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Part 2: Authentic Certificate Document Preview 1:1 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Pratinjau Piagam Apresiasi Resmi
            </h2>
            <span className="text-[11px] text-slate-500">
              Format A4 Landscape · Template Resmi Miss Hiday
            </span>
          </div>

          {/* Physical Certificate Canvas on Mat */}
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 sm:p-5 shadow-xs">
            <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-lg shadow-cert border border-slate-300/80 select-none aspect-[1024/723]">
              {/* Background Template Master Resmi */}
              <img
                src="/certificate_template.png"
                alt="Piagam Apresiasi Well Identified Family I Know You"
                className="w-full h-full object-cover block pointer-events-none"
              />

              {/* Dynamic Family Name Overlay di Panel Merah Marun Kiri (Font dan Warna Asli Sertifikat) */}
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
                <div className="absolute left-[13.7%] top-[78.2%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="p-0.5 sm:p-1 bg-white rounded shadow-sm border border-slate-200">
                    <img
                      src={qrDataUrl}
                      alt="QR Verification"
                      className="w-7 h-7 sm:w-11 sm:h-11 md:w-14 md:h-14 block"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Part 3: Confirmation Form Actions */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Kembali</span>
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-7 py-3 rounded-lg bg-[#1E3A8A] hover:bg-[#162D6B] text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Menerbitkan Piagam &amp; Menyimpan...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                <span>Terbitkan Piagam &amp; Simpan Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
