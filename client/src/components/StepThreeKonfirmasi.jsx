import React from 'react';
import { CheckCircle2, FileText, Edit3, ArrowLeft, Send, Loader2 } from 'lucide-react';

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
        {/* Top Horizontal Progress Bar */}
        <header className="mb-8">
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-6">
            <div className="bg-brand-pink h-full rounded-full w-full transition-all duration-500 ease-out" />
          </div>

          <div className="inline-block px-2.5 py-1 rounded-full bg-pink-50 text-brand-pink font-bold text-[11px] tracking-wider uppercase mb-2">
            Langkah 3 Dari 3
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-slate tracking-tight">
            Konfirmasi Data &amp; Penerbitan Sertifikat
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-2 max-w-2xl leading-relaxed">
            Periksa kembali ringkasan data Anda sebelum data disimpan ke database resmi dan sertifikat kemitraan diterbitkan.
          </p>
        </header>

        {/* Ready Status Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-emerald-900 leading-tight">
                Data Lengkap &amp; Siap Diterbitkan!
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Sistem database dan penomoran otomatis telah siap mengalokasikan sertifikat untuk keluarga Anda.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-brand-navy text-white tracking-wide shrink-0">
            Penomoran: Format IKY-XXXX
          </span>
        </div>

        {/* Data Summary Bento Card */}
        <div className="bg-white border border-brand-border rounded-2xl p-5 sm:p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-navy" />
              <h3 className="text-xs sm:text-sm font-bold text-brand-slate">
                Ringkasan Data Pendaftaran
              </h3>
            </div>
            <button
              type="button"
              onClick={onEdit}
              className="text-xs font-semibold text-brand-pink hover:text-brand-pink-hover flex items-center gap-1 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Ubah Data</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-xs">
            <div>
              <span className="text-brand-muted block font-medium">Nama Kepala Keluarga</span>
              <span className="text-brand-slate font-bold text-sm mt-0.5 block">
                {nama_kepala_keluarga || '-'}
              </span>
            </div>
            <div>
              <span className="text-brand-muted block font-medium">Jumlah Anggota</span>
              <span className="text-slate-800 font-semibold mt-0.5 block">
                {jumlah_anggota} Orang (Termasuk Tanggungan)
              </span>
            </div>
            <div>
              <span className="text-brand-muted block font-medium">Kategori Kemitraan</span>
              <span className="inline-flex items-center px-2.5 py-0.5 mt-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-brand-navy border border-blue-100">
                {kategori_kemitraan}
              </span>
            </div>
            <div>
              <span className="text-brand-muted block font-medium">Nomor WhatsApp</span>
              <span className="text-slate-800 font-medium mt-0.5 block font-mono">
                +62 {kontak_wa || '-'}
              </span>
            </div>
            <div>
              <span className="text-brand-muted block font-medium">Alamat Email</span>
              <span className="text-slate-800 font-medium mt-0.5 block">
                {kontak_email || '-'}
              </span>
            </div>
            {nama_pasangan && (
              <div>
                <span className="text-brand-muted block font-medium">Nama Pasangan</span>
                <span className="text-slate-800 font-medium mt-0.5 block">
                  {nama_pasangan}
                </span>
              </div>
            )}
            <div className="sm:col-span-2 lg:col-span-3">
              <span className="text-brand-muted block font-medium">Alamat Domisili</span>
              <span className="text-slate-800 font-medium mt-0.5 block">
                {alamat ? `${alamat}, ${kota}, ${provinsi}` : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Certificate Miniature / Live Preview */}
        <div className="border border-brand-border rounded-2xl p-5 bg-slate-50/70 mb-8">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-navy" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Pratinjau Dokumen Sertifikat Resmi
              </span>
            </div>
            <span className="text-[11px] font-semibold text-brand-muted bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">
              Format: A4 Landscape Vector PDF
            </span>
          </div>

          {/* Certificate Card Canvas */}
          <div className="relative bg-white rounded-xl p-6 sm:p-8 border-2 border-brand-navy/30 shadow-cert text-center overflow-hidden">
            {/* Inner Gold/Pink Border */}
            <div className="border border-brand-pink/60 rounded-lg p-5 sm:p-6 bg-gradient-to-b from-white via-blue-50/10 to-white">
              <div className="inline-flex items-center justify-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-brand-navy text-white flex items-center justify-center font-extrabold text-[10px] tracking-tight">
                  IKY
                </div>
                <span className="text-xs font-extrabold tracking-[0.2em] text-brand-navy uppercase">
                  I Know You Indonesia
                </span>
              </div>

              <div className="text-[10px] tracking-wider text-brand-pink uppercase font-bold mb-3">
                Platform Pengembangan Diri Berbasis STIFIn
              </div>

              <h4 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-1">
                SERTIFIKAT KEMITRAAN RESMI
              </h4>
              <p className="text-[11px] text-brand-muted mb-4 font-mono">
                No. Registrasi: IKY-XXXX (Auto-Generate)
              </p>

              <p className="text-xs text-slate-500 italic mb-2">
                Piagam ini diberikan dengan bangga sebagai apresiasi kemitraan kepada:
              </p>

              <div className="my-3">
                <span className="text-lg sm:text-2xl font-bold text-brand-navy inline-block border-b-2 border-brand-pink pb-1 px-4">
                  {nama_kepala_keluarga || 'Nama Kepala Keluarga'}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
                Atas komitmen dan kontribusi aktif sebagai Keluarga Partner I Know You dalam mendukung
                pengembangan potensi genetik keluarga.
              </p>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="text-left">
                  <span className="block font-medium">Diterbitkan pada:</span>
                  <span className="font-semibold text-slate-800">{todayFormatted}</span>
                </div>
                <div className="text-right">
                  <span className="block font-medium">I Know You Indonesia</span>
                  <span className="font-bold text-brand-navy">Authorized Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrev}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-brand-border bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Kembali</span>
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition-all transform active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Menyimpan ke Sistem...</span>
              </>
            ) : (
              <>
                <span>Kirim &amp; Daftarkan Sekarang</span>
                <Send className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
