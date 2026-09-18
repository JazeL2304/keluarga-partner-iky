import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';

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
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2A489D] to-[#FF4081] p-6 text-white text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <span className="inline-block text-[10px] font-bold tracking-widest uppercase bg-white/20 text-white px-2.5 py-0.5 rounded-full mb-1">
            Internal Staff Only
          </span>
          <h1 className="text-xl font-bold tracking-tight">Supervisi &amp; Rekap Mitra</h1>
          <p className="text-xs text-white/80 mt-1">
            Sistem Otomasi Sertifikasi STIFIn I Know You
          </p>
        </div>

        {/* Login Form Body */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-pass" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Kata Sandi Internal
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
                  placeholder="Masukkan password admin..."
                  className={`block w-full pl-9 pr-10 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
                    error
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
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
              className="w-full py-2.5 px-4 rounded-lg bg-[#1E3A8A] hover:bg-[#162D6B] text-white font-medium text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isVerifying ? 'Memverifikasi...' : 'Buka Dashboard Rekap'}</span>
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1 hover:text-[#FF4081] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Halaman Utama Partner</span>
            </button>

            <span className="text-[10px] text-slate-400 font-mono">v1.0-secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
