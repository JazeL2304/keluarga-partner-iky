import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { Award, Download, RotateCcw, Copy, CheckCheck, Share2, Smartphone } from 'lucide-react';

export default function SuccessState({ resultData, onReset }) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#1E3A8A', '#FF4081', '#10B981'],
      });
    } catch (e) {
      console.log('Confetti skipped');
    }
  }, []);

  const certificateNumber = resultData?.nomor_sertifikat || 'IKY-0001';
  const headName = resultData?.nama_keluarga || resultData?.nama_kepala_keluarga || 'Keluarga Partner';
  const downloadUrl = resultData?.url_sertifikat;

  useEffect(() => {
    const target = downloadUrl || `https://stifiniknowyou.com/sertifikat/${certificateNumber}`;
    QRCode.toDataURL(target, {
      margin: 1,
      width: 200,
      color: {
        dark: '#0F172A',
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
    `Alhamdulillah, Piagam Apresiasi resmi Well Identified Family I Know You untuk ${headName} telah terbit.\n\nUnduh berkas piagam di sini:\n${downloadUrl || ''}`
  );
  const waShareUrl = `https://wa.me/?text=${waMessage}`;

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-10 max-w-lg mx-auto">
      {/* Icon Award */}
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-5 shadow-xs">
        <Award className="w-8 h-8 stroke-[2]" />
      </div>

      <span className="text-xs font-semibold uppercase tracking-wider text-[#FF4081] mb-1">
        Well Identified Family
      </span>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
        Piagam Apresiasi Diterbitkan
      </h1>

      <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed max-w-sm">
        Data kemitraan Well Identified Family untuk <strong className="font-semibold text-slate-900">{headName}</strong> telah berhasil disimpan ke basis data resmi STIFIn I Know You.
      </p>

      {/* Meta Certificate Card */}
      <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 mb-6 text-left shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
          <span className="text-xs text-slate-500 font-medium">Nomor Registrasi:</span>
          <span className="font-mono text-xs font-bold text-slate-800">
            {certificateNumber}
          </span>
        </div>

        {/* Dynamic Smartphone QR Scan Box */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
          <div className="p-1 bg-white rounded border border-slate-200 shrink-0">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="QR Verifikasi Sertifikat"
                className="w-16 h-16 sm:w-20 sm:h-20 block"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                QR
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-0.5">
              <Smartphone className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>Verifikasi Berkas Digital</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Pindai dengan kamera smartphone untuk memverifikasi keaslian dan validitas piagam.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2.5">
        {downloadUrl ? (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-5 rounded-lg bg-[#1E3A8A] hover:bg-[#162D6B] text-white font-semibold text-sm transition-all shadow-xs active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Berkas Piagam (PDF)</span>
          </a>
        ) : (
          <button
            disabled
            className="w-full py-3 px-5 rounded-lg bg-slate-200 text-slate-400 font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Tautan Berkas Sedang Disiapkan...</span>
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {downloadUrl && (
            <a
              href={waShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Kirim ke WhatsApp</span>
            </a>
          )}

          {downloadUrl && (
            <button
              type="button"
              onClick={handleCopyLink}
              className={`w-full py-2.5 px-4 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                copied
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tautan Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Tautan Piagam</span>
                </>
              )}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="w-full py-2 px-4 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5 pt-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Daftarkan Keluarga Lain</span>
        </button>
      </div>
    </div>
  );
}
