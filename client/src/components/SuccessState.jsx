import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, RotateCcw, Award, FileCheck2 } from 'lucide-react';

export default function SuccessState({ resultData, onReset }) {
  useEffect(() => {
    // Trigger celebratory confetti on mount
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1E3A8A', '#FF4081', '#10B981', '#F59E0B'],
      });
    } catch (e) {
      console.log('Confetti trigger skipped');
    }
  }, []);

  const certificateNumber = resultData?.nomor_sertifikat || 'IKY-0001';
  const headName = resultData?.nama_kepala_keluarga || 'Keluarga Partner';
  const downloadUrl = resultData?.url_sertifikat;

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-10">
      {/* Big Animated Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 ring-8 ring-emerald-50">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>

      <div className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs tracking-wider uppercase mb-3 border border-emerald-200">
        Registrasi Berhasil Disimpan
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-brand-slate tracking-tight mb-2">
        Selamat, Keluarga Partner Terdaftar!
      </h1>

      <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed mb-6">
        Data kemitraan untuk <strong className="text-brand-slate">{headName}</strong> telah berhasil disimpan secara permanen ke database resmi I Know You.
      </p>

      {/* Official Certificate Number Card */}
      <div className="w-full max-w-md bg-white border border-brand-border rounded-2xl p-6 shadow-sm mb-6 text-left">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-brand-pink" />
            <span className="text-xs font-bold text-brand-slate uppercase tracking-wider">
              Nomor Seri Sertifikat
            </span>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-brand-navy border border-blue-200">
            Resmi Terbit
          </span>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-200">
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-brand-navy tracking-wider">
            {certificateNumber}
          </div>
          <div className="text-[11px] text-brand-muted mt-1">
            Alokasi unik nomor sertifikat kemitraan I Know You
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-brand-muted">
          <span>Status Database:</span>
          <span className="font-semibold text-emerald-700 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Tersimpan di Supabase
          </span>
        </div>
      </div>

      {/* Download Certificate Section */}
      {downloadUrl ? (
        <div className="w-full max-w-md mb-6">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition-all transform active:scale-95 gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Berkas Sertifikat PDF</span>
          </a>
        </div>
      ) : (
        <div className="w-full max-w-md mb-6 p-4 rounded-xl bg-blue-50/80 border border-blue-100 text-xs text-brand-navy text-left flex items-start gap-3">
          <FileCheck2 className="w-5 h-5 text-brand-navy shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Integrasi PDF Sertifikat:</span>
            Penerbitan link unduh langsung akan aktif secara penuh pada tahapan integrasi PDF Storage (Step 5 &amp; 6).
          </div>
        </div>
      )}

      {/* Reset / Register Another Button */}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-brand-border bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-all gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Daftarkan Keluarga Lainnya</span>
      </button>
    </div>
  );
}
