import React from 'react';
import { Edit3, ArrowLeft, Send, Loader2 } from 'lucide-react';

export default function StepThreeKonfirmasi({ formData, onPrev, onEdit, onSubmit, isSubmitting }) {
  const {
    nama_kepala_keluarga,
    jumlah_anggota,
    kategori_kemitraan,
    nama_pasangan,
    kontak_wa,
    kontak_email,
    alamat,
    provinsi,
    kota,
  } = formData;

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
            Konfirmasi Data &amp; Sertifikat
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
            Periksa ketepatan data Anda sebelum nomor registrasi resmi diterbitkan dan dicatat ke sistem.
          </p>
        </header>

        {/* Part 1: Data Summary Table */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Ringkasan Data Pendaftaran
            </h2>
            <button
              type="button"
              onClick={onEdit}
              className="text-xs font-semibold text-[#FF4081] hover:underline flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Ubah Data</span>
            </button>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-xs">
            <div>
              <dt className="text-slate-500">Nama Kepala Keluarga</dt>
              <dd className="font-semibold text-slate-900 text-sm mt-0.5">
                {nama_kepala_keluarga || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Jumlah Anggota</dt>
              <dd className="font-semibold text-slate-900 mt-0.5">
                {jumlah_anggota} Orang
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Kategori Kemitraan</dt>
              <dd className="font-medium text-slate-900 mt-0.5">
                {kategori_kemitraan}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Nomor WhatsApp</dt>
              <dd className="font-mono text-slate-900 mt-0.5">
                +62 {kontak_wa || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Alamat Email</dt>
              <dd className="text-slate-900 mt-0.5 break-all">
                {kontak_email || '—'}
              </dd>
            </div>
            {nama_pasangan && (
              <div>
                <dt className="text-slate-500">Nama Pasangan / Wakil</dt>
                <dd className="text-slate-900 mt-0.5">
                  {nama_pasangan}
                </dd>
              </div>
            )}
            <div className="sm:col-span-2 lg:col-span-3 pt-2 border-t border-slate-100">
              <dt className="text-slate-500">Alamat Domisili</dt>
              <dd className="text-slate-900 mt-0.5 leading-relaxed">
                {alamat ? `${alamat}, ${kota}, ${provinsi}` : '—'}
              </dd>
            </div>
          </dl>
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
          <div className="bg-[#FAF9F5] border border-slate-300 rounded-lg p-5 sm:p-8 text-center relative overflow-hidden shadow-sm">
            {/* Fine Double Rule Border */}
            <div className="border border-[#1E3A8A]/30 p-4 sm:p-6 rounded bg-white relative">
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
                PIAGAM KEMITRAAN
              </h3>
              
              <div className="text-[11px] font-mono text-slate-400 mb-4">
                Nomor: IKY-XXXX (Dialokasikan Otomatis)
              </div>

              <p className="font-serif italic text-xs sm:text-sm text-slate-600 mb-2">
                Dengan bangga diberikan kepada:
              </p>

              {/* Recipient Name in Prominent Serif with Pink underline accent */}
              <div className="my-2 sm:my-3">
                <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 inline-block border-b-2 border-[#FF4081] pb-1 px-4 sm:px-6">
                  {nama_kepala_keluarga || 'Nama Kepala Keluarga'}
                </span>
              </div>

              <p className="text-xs text-slate-600 max-w-md mx-auto mt-3 leading-relaxed">
                Sebagai Keluarga Partner resmi I Know You dalam komitmen bersama membangun kesadaran potensi genetik berbasis STIFIn.
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
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors disabled:opacity-50"
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
