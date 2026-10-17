import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';

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
      setError('Silakan masukkan kata sandi');
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
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Header Bersih & Ringkas */}
        <div className="pt-8 pb-3 px-6 sm:px-8 text-center">
          <img
            src="/logo-iknowyou.png"
            alt="IKNOWYOU by Miss Hiday"
            className="h-10 mx-auto mb-4 object-contain select-none"
          />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Portal Supervisi Admin</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Masukkan kata sandi untuk mengakses rekap data mitra.
          </p>
        </div>

        {/* Login Form Body */}
        <div className="px-6 pb-8 sm:px-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-pass" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
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
                  className={`block w-full pl-9 pr-10 py-2.5 text-sm bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none transition-all [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${
                    error
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <p className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1E3A8A] hover:bg-[#162D6B] text-white font-semibold text-sm transition-all shadow-xs active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isVerifying ? 'Memverifikasi...' : 'Buka Dashboard'}</span>
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#FF4081] font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Halaman Utama</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
