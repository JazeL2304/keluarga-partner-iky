import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';

const DEFAULT_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'adminiky2026';

export default function AdminAuthGate({ onSuccess, onBackToHome }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Silakan masukkan kata sandi administrator');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      if (password === DEFAULT_ADMIN_PASSWORD) {
        sessionStorage.setItem('iky_admin_auth', 'true');
        setIsVerifying(false);
        onSuccess();
      } else {
        setIsVerifying(false);
        setError('Kata sandi salah. Akses ditolak.');
      }
    }, 350);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#FAF8F5]">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#EAE3D7] shadow-warm-lg overflow-hidden animate-fadeIn">
        {/* Header Ribbon - Deep Maroon with Gold Badge */}
        <div className="bg-[#58121A] p-7 text-[#FAF8F5] text-center relative overflow-hidden border-b border-[#C4A36B]/30">
          <div className="w-12 h-12 rounded-full bg-[#420D13] border border-[#C4A36B]/50 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-5 h-5 text-[#C4A36B]" />
          </div>
          <span className="inline-block text-[10px] font-serif font-bold tracking-widest uppercase bg-[#C4A36B]/20 text-[#C4A36B] px-3 py-0.5 rounded-full mb-1.5 border border-[#C4A36B]/30">
            Internal I Know You
          </span>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#FAF8F5]">
            Portal Supervisi &amp; Rekap
          </h1>
          <p className="text-xs text-[#FAF8F5]/70 mt-1 font-sans">
            Sistem Arsip &amp; Penerbitan Piagam STIFIn
          </p>
        </div>

        {/* Login Form Body */}
        <div className="p-6 sm:p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-pass" className="block text-xs font-semibold text-[#1F1A1B] tracking-wide mb-1.5">
                Kata Sandi Administrator
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A827E]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="admin-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Masukkan kata sandi..."
                  className={`block w-full pl-10 pr-10 py-2.5 text-sm bg-white border rounded-lg text-[#1F1A1B] placeholder-[#B5AEAB] focus:outline-none transition-all ${
                    error
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                      : 'border-[#DED6CA] focus:border-[#58121A] focus:ring-1 focus:ring-[#58121A]'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8A827E] hover:text-[#1F1A1B] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <p className="mt-2 text-xs font-medium text-rose-700 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 px-4 rounded-lg bg-[#58121A] hover:bg-[#420D13] text-[#FAF8F5] font-medium text-sm transition-all shadow-warm active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#C4A36B]" />
              <span>{isVerifying ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-6 pt-4 border-t border-[#EAE3D7] flex items-center justify-between text-xs text-[#8A827E]">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1 hover:text-[#58121A] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Halaman Utama Partner</span>
            </button>

            <span className="text-[10px] text-[#8A827E] font-serif italic">IKNOWYOU by misshiday</span>
          </div>
        </div>
      </div>
    </div>
  );
}
