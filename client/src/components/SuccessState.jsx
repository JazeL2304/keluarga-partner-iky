import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Check, Download, RotateCcw, FileText } from 'lucide-react';

export default function SuccessState({ resultData, onReset }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#1E3A8A', '#FF4081', '#334155'],
      });
    } catch (e) {
      console.log('Confetti trigger skipped');
    }
  }, []);

  const certificateNumber = resultData?.nomor_sertifikat || 'IKY-0001';
  const headName = resultData?.nama_kepala_keluarga || 'Keluarga Partner';
  const downloadUrl = resultData?.url_sertifikat;

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-10 max-w-lg mx-auto">
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-5">
        <Check className="w-7 h-7 stroke-[2.5]" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
        Pendaftaran Berhasil Disimpan
      </h1>

      <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-6">
        Data kemitraan untuk <strong className="font-semibold text-slate-800">{headName}</strong> telah tercatat resmi dan piagam sertifikat kemitraan telah diterbitkan.
      </p>

      {/* Certificate Number Card */}
      <div className="w-full bg-white border border-slate-200 rounded-lg p-5 mb-6 text-left shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Nomor Seri Sertifikat
          </span>
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
            Resmi Terdaftar
          </span>
        </div>

        <div className="py-2 text-center">
          <div className="text-3xl font-mono font-bold text-[#1E3A8A] tracking-wider">
            {certificateNumber}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Nomor registrasi unik mitra I Know You
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Status Database</span>
          <span className="font-medium text-slate-700">Tersimpan di Supabase</span>
        </div>
      </div>

      {/* Certificate Download Action */}
      {downloadUrl ? (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#1E3A8A] hover:bg-[#152a65] text-white font-medium text-sm transition-colors mb-4 gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Unduh Berkas Sertifikat (PDF)</span>
        </a>
      ) : (
        <div className="w-full mb-5 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left flex items-start gap-2.5">
          <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800 block mb-0.5">Integrasi Berkas PDF:</span>
            Penerbitan link unduh langsung akan aktif secara penuh pada integrasi PDF Storage (Step 5 &amp; 6).
          </div>
        </div>
      )}

      {/* Secondary Action */}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors gap-1.5"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Daftarkan keluarga lainnya</span>
      </button>
    </div>
  );
}
