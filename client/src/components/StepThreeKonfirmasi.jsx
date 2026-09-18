import React from 'react';
import { Edit3, ArrowLeft, Send, Loader2, UserCircle2, Baby, Building2, User } from 'lucide-react';

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

  const isInstansi = pribadi_instansi === 'Instansi';
  const anakList = Array.isArray(anak) ? anak : [];

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        {/* Step Header */}
        <header className="mb-8">
          <div className="text-xs font-semibold text-[#FF4081] uppercase tracking-wider mb-1.5">
            Langkah 3 • Verifikasi &amp; Penerbitan
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Konfirmasi Data &amp; Pratinjau Sertifikat
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
            Periksa ketepatan profil genetika keluarga Anda sebelum nomor registrasi resmi diterbitkan dan dicatat ke sistem.
          </p>
        </header>

        {/* Part 1: Data Summary Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 mb-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Ringkasan Data Kemitraan Keluarga
            </h2>
            <button
              type="button"
              onClick={onEdit}
              className="text-xs font-semibold text-[#FF4081] hover:underline flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Ubah Data</span>
            </button>
          </div>

          {/* Kategori & Nama Keluarga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100 text-xs">
            <div>
              <span className="text-slate-500 block">Kategori Pendaftaran</span>
              <div className="font-semibold text-slate-900 text-sm mt-0.5 flex items-center gap-1.5">
                {isInstansi ? (
                  <>
                    <Building2 className="w-4 h-4 text-[#FF4081]" />
                    <span>Instansi: {nama_instansi_custom || '—'}</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 text-[#FF4081]" />
                    <span>Pribadi</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <span className="text-slate-500 block">Nama Keluarga (Dicetak di Piagam)</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                {nama_keluarga || '—'}
              </div>
            </div>
          </div>

          {/* Profil Orang Tua: Ayah & Ibu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ayah */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#1E3A8A] mb-2 pb-1.5 border-b border-slate-200">
                <UserCircle2 className="w-4 h-4" />
                <span>Profil Ayah</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama:</span>
                  <span className="font-semibold text-slate-900 text-right">{nama_ayah || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">STIFIn:</span>
                  <span className="font-medium text-[#1E3A8A] text-right">{stifin_ayah || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gol. Darah:</span>
                  <span className="font-mono font-semibold text-slate-900 text-right">{golongan_darah_ayah || '—'}</span>
                </div>
              </div>
            </div>

            {/* Ibu */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#FF4081] mb-2 pb-1.5 border-b border-slate-200">
                <UserCircle2 className="w-4 h-4" />
                <span>Profil Ibu</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama:</span>
                  <span className="font-semibold text-slate-900 text-right">{nama_ibu || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">STIFIn:</span>
                  <span className="font-medium text-[#FF4081] text-right">{stifin_ibu || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gol. Darah:</span>
                  <span className="font-mono font-semibold text-slate-900 text-right">{golongan_darah_ibu || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profil Anak-Anak */}
          <div>
            <div className="flex items-center justify-between mb-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Baby className="w-4 h-4 text-[#FF4081]" />
                <span>Profil Genetika Anak ({jumlah_anak || 0} Anak)</span>
              </div>
            </div>

            {anakList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {anakList.map((ch, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white border border-slate-200 text-xs shadow-2xs">
                    <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-100">
                      <span className="font-bold text-[#1E3A8A]">Anak ke-{idx + 1}</span>
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">
                        Gol. {ch.golongan_darah || '—'}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900 truncate mb-1">
                      {ch.nama || `Anak ke-${idx + 1}`}
                    </div>
                    <div className="text-[11px] text-[#FF4081] font-medium">
                      {ch.stifin || 'STIFIn belum dipilih'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                Belum ada data anak yang didaftarkan (Jumlah Anak: 0).
              </div>
            )}
          </div>
        </div>

        {/* Part 2: Authentic Certificate Document Preview 1:1 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Pratinjau Piagam Apresiasi Resmi
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">
              Dokumen A4 Landscape (1:1 Template Resmi)
            </span>
          </div>

          {/* Realistic Physical Certificate Canvas using Clean Official Template */}
          <div className="bg-slate-100/80 border border-slate-300 rounded-xl p-3 sm:p-5 shadow-sm">
            <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-lg shadow-md border border-slate-300 select-none aspect-[1024/723]">
              {/* Background Template Master Resmi */}
              <img
                src="/certificate_template.png"
                alt="Piagam Apresiasi Well Identified Family I Know You"
                className="w-full h-full object-cover block pointer-events-none"
              />

              {/* Dynamic Family Name Overlay di Panel Merah Marun Kiri */}
              <div className="absolute left-[13.7%] top-[52.8%] -translate-x-1/2 -translate-y-1/2 w-[24%] text-center pointer-events-none flex flex-col items-center justify-center">
                <span className="font-black italic uppercase tracking-wide text-[#D4AF37] text-[10px] sm:text-[13px] md:text-[16px] lg:text-[18px] leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] break-words">
                  {(() => {
                    const raw = nama_keluarga || 'Keluarga Partner';
                    return raw.toUpperCase().replace(/^KELUARGA\s+/i, '').replace(/\s+FAMILY$/i, '').trim() || 'KELUARGA';
                  })()}
                </span>
                <span className="font-black italic uppercase tracking-widest text-[#D4AF37] text-[10px] sm:text-[13px] md:text-[16px] lg:text-[18px] leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] mt-0.5">
                  FAMILY
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center mt-2.5">
              Desain piagam resmi Well Identified Family I Know You dengan cetak nama keluarga otomatis.
            </p>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          <button
            type="button"
            onClick={onPrev}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Kembali</span>
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#FF4081] hover:bg-[#E02868] text-white font-medium text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Menyimpan ke Sistem...</span>
              </>
            ) : (
              <>
                <span>Terbitkan Sertifikat Sekarang</span>
                <Send className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

