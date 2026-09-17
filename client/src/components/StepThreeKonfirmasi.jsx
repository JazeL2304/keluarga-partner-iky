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

        {/* Part 2: Authentic Certificate Document Preview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Pratinjau Sertifikat Resmi
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">
              Dokumen A4 Landscape (PDF)
            </span>
          </div>

          {/* Realistic Physical Certificate Canvas */}
          <div className="bg-[#FAF9F5] border border-slate-300 rounded-xl p-5 sm:p-8 text-center relative overflow-hidden shadow-sm">
            {/* Fine Double Rule Border */}
            <div className="border border-[#1E3A8A]/30 p-4 sm:p-6 rounded-lg bg-white relative">
              {/* Header Crest */}
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="w-6 h-6 rounded bg-[#1E3A8A] text-white text-[10px] font-bold flex items-center justify-center tracking-wider">
                  IKY
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#1E3A8A]">
                  I Know You Indonesia
                </span>
              </div>

              <div className="text-[10px] text-[#FF4081] uppercase tracking-widest font-semibold mb-3">
                Platform Pengembangan Diri Berbasis STIFIn
              </div>

              {/* Title in Authentic Serif */}
              <h3 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-[0.15em] text-[#1E3A8A] mb-1">
                PIAGAM KEMITRAAN KELUARGA
              </h3>
              
              <div className="text-[11px] font-mono text-slate-400 mb-4">
                Nomor: IKY-XXXX (Dialokasikan Otomatis)
              </div>

              <p className="font-serif italic text-xs sm:text-sm text-slate-600 mb-2">
                Dengan bangga dianugerahkan kepada:
              </p>

              {/* Recipient Name in Prominent Serif with Pink underline accent */}
              <div className="my-2 sm:my-3">
                <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 inline-block border-b-2 border-[#FF4081] pb-1 px-4 sm:px-6">
                  {nama_keluarga || 'Keluarga Mitra IKY'}
                </span>
              </div>

              <p className="text-xs text-slate-600 max-w-md mx-auto mt-3 leading-relaxed">
                Sebagai Keluarga Partner resmi I Know You dalam komitmen bersama membangun kesadaran potensi genetik keluarga berbasis STIFIn.
              </p>

              {/* Document Sign-off */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <div className="text-left">
                  <span className="block text-[10px] uppercase text-slate-400">Tanggal Terbit</span>
                  <span className="font-medium text-slate-700">{todayFormatted}</span>
                </div>
                
                {/* Official Circular Stamp */}
                <div className="border-2 border-[#1E3A8A]/40 rounded-full w-12 h-12 flex flex-col items-center justify-center text-[7px] font-bold text-[#1E3A8A] leading-tight select-none opacity-85">
                  <span className="text-[#FF4081]">IKY</span>
                  <span className="text-[6px] tracking-tighter">VERIFIED</span>
                </div>

                <div className="text-right">
                  <span className="block text-[10px] uppercase text-slate-400">Pengesahan</span>
                  <span className="font-semibold text-[#1E3A8A]">I Know You Indonesia</span>
                </div>
              </div>
            </div>
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

