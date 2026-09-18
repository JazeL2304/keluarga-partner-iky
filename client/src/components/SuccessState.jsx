import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { Check, Download, RotateCcw, FileText, Copy, CheckCheck, Share2, QrCode as QrIcon, Smartphone } from 'lucide-react';

export default function SuccessState({ resultData, onReset }) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#1E3A8A', '#FF4081', '#C4A36B'],
      });
    } catch (e) {
      console.log('Confetti trigger skipped');
    }
  }, []);

  const certificateNumber = resultData?.nomor_sertifikat || 'IKY-0001';
  const headName = resultData?.nama_keluarga || resultData?.nama_kepala_keluarga || 'Keluarga Partner';
  const downloadUrl = resultData?.url_sertifikat;

  // Generate QR Code data URL whenever downloadUrl is available
  useEffect(() => {
    const target = downloadUrl || `https://stifiniknowyou.com/sertifikat/${certificateNumber}`;
    QRCode.toDataURL(target, {
      margin: 1,
      width: 200,
      color: {
        dark: '#1E293B',
        light: '#FFFFFF'
      }
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Error generating QR code in success screen:', err));
  }, [downloadUrl, certificateNumber]);

  const handleCopyLink = async () => {
    if (!downloadUrl) return;
    try {
      await navigator.clipboard.writeText(downloadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const waMessage = encodeURIComponent(
    `Halo, alhamdulillah Piagam Apresiasi resmi Keluarga Partner I Know You untuk ${headName} telah terbit!\n\nLihat dan unduh berkas piagam di sini:\n${downloadUrl || ''}`
  );
  const waShareUrl = `https://wa.me/?text=${waMessage}`;

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-10 max-w-lg mx-auto">
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4">
        <Check className="w-7 h-7 stroke-[2.5]" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
        Pendaftaran Berhasil Disimpan
      </h1>

      <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-6">
        Data kemitraan untuk <strong className="font-semibold text-slate-800">{headName}</strong> telah tercatat resmi dan piagam sertifikat kemitraan telah diterbitkan.
      </p>

      {/* Certificate Number Card */}
      <div className="w-full bg-white border border-slate-200 rounded-xl p-5 mb-5 text-left shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Nomor Seri Sertifikat
          </span>
          <span className="text-[11px] font-semibold text-[#FF4081] bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
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

      {/* QR Code Scan Card for Smartphone */}
      {qrCodeUrl && (
        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 flex items-center gap-4 text-left">
          <div className="p-1.5 bg-white rounded-lg border border-slate-200 shadow-xs shrink-0">
            <img src={qrCodeUrl} alt="QR Code Piagam" className="w-20 h-20 block" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Smartphone className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>Pindai Lewat Ponsel</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Arahkan kamera smartphone Anda ke QR code ini untuk langsung membuka dan menyimpan berkas piagam di HP.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="w-full space-y-3 mb-5">
        {/* Primary Download Button */}
        {downloadUrl ? (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#FF4081] hover:bg-[#E02868] text-white font-medium text-sm transition-all gap-2 shadow-sm active:scale-[0.99] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Berkas Piagam (PDF)</span>
          </a>
        ) : (
          <div className="w-full p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left flex items-start gap-2.5">
            <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 block mb-0.5">Berkas PDF:</span>
              Sedang diproses oleh sistem.
            </div>
          </div>
        )}

        {/* Secondary Actions: Salin Link & Share WhatsApp */}
        {downloadUrl && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all gap-1.5 cursor-pointer active:scale-[0.99]"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Link Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Link Piagam</span>
                </>
              )}
            </button>

            <a
              href={waShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-all gap-1.5 cursor-pointer active:scale-[0.99]"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kirim ke WhatsApp</span>
            </a>
          </div>
        )}
      </div>

      {/* Tertiary Action: Register another family */}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-slate-600 hover:text-[#FF4081] transition-colors gap-1.5 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Daftarkan keluarga lainnya</span>
      </button>
    </div>
  );
}
