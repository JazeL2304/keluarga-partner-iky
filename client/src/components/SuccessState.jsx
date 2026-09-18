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
        particleCount: 50,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#58121A', '#C4A36B', '#DED6CA'],
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
        dark: '#1F1A1B',
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
    `Alhamdulillah, Piagam Apresiasi resmi Keluarga Partner I Know You untuk ${headName} telah terbit.\n\nUnduh berkas piagam di sini:\n${downloadUrl || ''}`
  );
  const waShareUrl = `https://wa.me/?text=${waMessage}`;

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-10 max-w-lg mx-auto">
      {/* Authentic Medal Seal Icon */}
      <div className="w-16 h-16 rounded-full bg-[#58121A] border-2 border-[#C4A36B] text-[#C4A36B] flex items-center justify-center mb-5 shadow-warm">
        <Award className="w-8 h-8 stroke-[1.75]" />
      </div>

      <span className="text-xs font-serif italic text-[#C4A36B] tracking-wider mb-1">
        Well Identified Family
      </span>

      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1A1B] tracking-tight mb-2">
        Piagam Apresiasi Diterbitkan
      </h1>

      <p className="text-xs sm:text-sm text-[#8A827E] max-w-md leading-relaxed mb-6">
        Data kemitraan untuk <strong className="font-semibold text-[#1F1A1B]">{headName}</strong> telah tercatat resmi dan piagam sertifikat telah terbit.
      </p>

      {/* Certificate Number Card with Prestige Detailing */}
      <div className="w-full bg-[#FAF8F5] border border-[#EAE3D7] rounded-xl p-5 mb-5 text-left shadow-warm-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EAE3D7]">
          <span className="text-xs font-serif font-semibold text-[#58121A]">
            Nomor Registrasi Kemitraan
          </span>
          <span className="text-[10px] font-medium text-[#C4A36B] bg-white px-2.5 py-0.5 rounded-full border border-[#C4A36B]/30">
            Resmi Terdaftar
          </span>
        </div>

        <div className="py-2 text-center">
          <div className="text-3xl font-mono font-bold text-[#58121A] tracking-wider">
            {certificateNumber}
          </div>
          <div className="text-[11px] text-[#8A827E] font-serif italic mt-1">
            Tercatat dalam basis data resmi I Know You
          </div>
        </div>
      </div>

      {/* Smartphone Scan QR Card */}
      {qrCodeUrl && (
        <div className="w-full bg-white border border-[#EAE3D7] rounded-xl p-4 mb-5 flex items-center gap-4 text-left shadow-warm-sm">
          <div className="p-1.5 bg-[#FAF8F5] rounded-lg border border-[#DED6CA] shrink-0">
            <img src={qrCodeUrl} alt="QR Code Piagam" className="w-20 h-20 block" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#58121A]">
              <Smartphone className="w-3.5 h-3.5 text-[#C4A36B]" />
              <span>Buka Langsung di Ponsel</span>
            </div>
            <p className="text-xs text-[#8A827E] mt-1 leading-relaxed">
              Arahkan kamera smartphone Anda ke QR code ini untuk menyimpan dokumen piagam langsung di HP Anda.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="w-full space-y-3 mb-5">
        {/* Primary Download Button */}
        {downloadUrl && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#58121A] hover:bg-[#420D13] text-[#FAF8F5] font-medium text-sm transition-all gap-2 shadow-warm active:scale-[0.99] cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#C4A36B]" />
            <span>Unduh Berkas Piagam (PDF)</span>
          </a>
        )}

        {/* Secondary Actions */}
        {downloadUrl && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-[#DED6CA] bg-white hover:bg-[#FAF8F5] text-[#1F1A1B] text-xs font-medium transition-all gap-1.5 cursor-pointer active:scale-[0.99]"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Link Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#8A827E]" />
                  <span>Salin Tautan Piagam</span>
                </>
              )}
            </button>

            <a
              href={waShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-[#DED6CA] bg-white hover:bg-[#FAF8F5] text-[#1F1A1B] text-xs font-medium transition-all gap-1.5 cursor-pointer active:scale-[0.99]"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C4A36B]" />
              <span>Bagikan ke WhatsApp</span>
            </a>
          </div>
        )}
      </div>

      {/* Reset Action */}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-[#8A827E] hover:text-[#58121A] transition-colors gap-1.5 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Daftarkan keluarga lainnya</span>
      </button>
    </div>
  );
}
