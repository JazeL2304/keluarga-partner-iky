import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import {
  User,
  Building2,
  ArrowRight,
  AlertCircle,
  UserCircle2,
  MessageSquareQuote,
  Phone,
  Mail,
  HeartHandshake,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Users,
  Plus,
  Minus,
} from 'lucide-react';
import { STIFIN_OPTIONS, GOLONGAN_DARAH_OPTIONS } from '../constants/stifin';
import CustomSelect from './CustomSelect';

export default function StepOneDataKeluarga({ formData, updateFormData, onNext, isAdminAuthed }) {
  const {
    pribadi_instansi,
    nama_instansi_custom,
    status_pernikahan,
    jumlah_anggota_keluarga,
    nama_keluarga,
    no_wa,
    email,
    nama_ayah,
    stifin_ayah,
    golongan_darah_ayah,
    nama_ibu,
    stifin_ibu,
    golongan_darah_ibu,
    kesan_pesan,
  } = formData;

  const [errors, setErrors] = useState({});
  const isInstansi = pribadi_instansi === 'Instansi';

  const counterNumRef = useRef(null);

  const handleStepperChange = (delta) => {
    const current = Math.max(2, parseInt(jumlah_anggota_keluarga, 10) || 2);
    const nextVal = current + delta;
    if (nextVal < 2 || nextVal > 20) return;

    if (counterNumRef.current) {
      if (delta > 0) {
        gsap.fromTo(
          counterNumRef.current,
          { scale: 1.45, color: '#FF4081', y: -2 },
          { scale: 1, color: '#0f172a', y: 0, duration: 0.3, ease: 'back.out(2)' }
        );
      } else {
        gsap.fromTo(
          counterNumRef.current,
          { scale: 0.75, color: '#e11d48', y: 2 },
          { scale: 1, color: '#0f172a', y: 0, duration: 0.25, ease: 'power2.out' }
        );
      }
    }

    const calculatedAnakCount = Math.max(0, nextVal - 2);
    updateFormData({
      jumlah_anggota_keluarga: nextVal,
      jumlah_anak: calculatedAnakCount,
    });
    if (errors.jumlah_anggota_keluarga) {
      setErrors((prev) => ({ ...prev, jumlah_anggota_keluarga: null }));
    }
  };

  // Kunci browser publik jika memilih Belum Menikah (Admin kebal / bisa reset)
  const isLockedOut = !isAdminAuthed && (
    sessionStorage.getItem('wif_marriage_locked') === 'true' ||
    status_pernikahan === 'Belum Menikah'
  );
  const isBelumMenikah = status_pernikahan === 'Belum Menikah' || isLockedOut;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!nama_keluarga || !nama_keluarga.trim()) {
      newErrors.nama_keluarga = 'Nama Keluarga wajib diisi untuk dicetak pada piagam penghargaan';
    }
    if (!jumlah_anggota_keluarga || Number(jumlah_anggota_keluarga) < 2) {
      newErrors.jumlah_anggota_keluarga = 'Total anggota keluarga minimal 2 orang (Ayah & Ibu)';
    }
    if (isInstansi && (!nama_instansi_custom || !nama_instansi_custom.trim())) {
      newErrors.nama_instansi_custom = 'Nama Instansi / Lembaga wajib diisi untuk pendaftaran instansi';
    }
    if (!no_wa || !no_wa.trim()) {
      newErrors.no_wa = 'Nomor WhatsApp responden wajib diisi untuk koordinasi & konfirmasi';
    } else if (!/^[0-9+\s\-()]{8,20}$/.test(no_wa.trim())) {
      newErrors.no_wa = 'Format nomor WhatsApp tidak valid (contoh: 081234567890)';
    }
    if (email && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Format email tidak valid (contoh: keluarga@gmail.com)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch {
        window.scrollTo(0, 0);
      }
      return;
    }

    const finalTotal = Math.max(2, Number(jumlah_anggota_keluarga) || 2);
    const calculatedAnak = Math.max(0, finalTotal - 2);
    updateFormData({
      jumlah_anggota_keluarga: finalTotal,
      jumlah_anak: calculatedAnak,
    });

    setErrors({});
    onNext();
  };

  // LAYAR KHUSUS JIKA BELUM MENIKAH / BELUM BERKELUARGA
  if (isBelumMenikah) {
    return (
      <div className="flex-1 flex flex-col justify-between py-2">
        <div className="space-y-6">
          {/* Header Apresiasi */}
          <div className="text-center max-w-lg mx-auto pt-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#FF4081] shadow-sm">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4081] block mb-1">
              Program Well Identified Family
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Terima Kasih Atas Partisipasi Anda
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Program <strong>Well Identified Family</strong> saat ini dirancang khusus sebagai apresiasi dan pendataan bagi mitra <strong>IKNOWYOU</strong> yang telah berkeluarga.
            </p>
          </div>

          {/* Kartu Informasi & Apresiasi Dedikasi */}
          <div className="max-w-lg mx-auto bg-slate-50/80 border border-slate-200/90 rounded-2xl p-5 sm:p-6 text-xs text-slate-600 space-y-3.5 shadow-2xs">
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 font-semibold block text-sm">Dedikasi Rekan Mitra Sangat Berharga</strong>
                <p className="mt-1 leading-relaxed text-slate-500">
                  Bagi rekan mitra yang belum berkeluarga, kami sangat menghargai kontribusi dan sinergi Anda. Nantikan program pendataan potensi personal, workshop, dan rekognisi individual STIFIn berikutnya.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Status: Khusus Mitra Berkeluarga</span>
              <span className="font-semibold text-slate-600">I Know You by Miss Hiday</span>
            </div>
          </div>

          {/* Akses Khusus Tim Internal / Admin Tester */}
          {isAdminAuthed && (
            <div className="max-w-lg mx-auto p-4 rounded-xl bg-blue-50/90 border border-blue-200 text-blue-900 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Mode Internal: Anda dapat beralih kembali untuk menguji skenario berkeluarga.</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem('wif_marriage_locked');
                    updateFormData({ status_pernikahan: 'Menikah' });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-blue-900 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset ke Menikah</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem('iky_admin_auth');
                    window.location.reload();
                  }}
                  className="px-2.5 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg border border-slate-200 transition-colors text-xs font-medium cursor-pointer"
                  title="Matikan mode internal dan lihat tampilan publik murni"
                >
                  Keluar Admin
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
          Butuh koordinasi kemitraan? Hubungi manajemen IKNOWYOU melalui narahubung resmi.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        {/* Step Header */}
        <header className="mb-6 pb-4 border-b border-slate-200/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF4081] block mb-1">
            Tahap 1 dari 3
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Well Identified Family
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
            Formulir kemitraan keluarga partner IKY &amp; profil genetika STIFIn orang tua.
          </p>
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 0: Status Pernikahan / Berkeluarga (Screening) */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-900 tracking-wide">
                Status Pernikahan / Berkeluarga <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                Kualifikasi Kemitraan
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Program apresiasi ini khusus diperuntukkan bagi rekan mitra yang telah membangun unit keluarga.
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => {
                  updateFormData({ status_pernikahan: 'Menikah' });
                }}
                className={`py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  status_pernikahan === 'Menikah'
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <HeartHandshake className={`w-4 h-4 ${status_pernikahan === 'Menikah' ? 'text-pink-300' : 'text-[#FF4081]'}`} />
                <span>Sudah Menikah</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isAdminAuthed) {
                    sessionStorage.setItem('wif_marriage_locked', 'true');
                  }
                  updateFormData({ status_pernikahan: 'Belum Menikah' });
                }}
                className="py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Belum Menikah</span>
              </button>
            </div>
          </div>

          {/* Section 1: Kategori Pendaftaran dengan Animasi Slider */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 tracking-wide mb-2">
              Jalur Pendaftaran <span className="text-rose-500">*</span>
            </label>

            {/* Smooth Animated Segmented Control Track */}
            <div className="relative p-1 bg-slate-100 rounded-xl border border-slate-200 max-w-sm flex items-center select-none shadow-2xs">
              {/* Sliding Background Active Pill Indicator */}
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#1E3A8A] rounded-lg shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  !isInstansi ? 'left-1' : 'left-[calc(50%+2px)]'
                }`}
              />

              {/* Option 1: Pribadi */}
              <button
                type="button"
                onClick={() => {
                  updateFormData({ pribadi_instansi: 'Pribadi', nama_instansi_custom: '' });
                  if (errors.nama_instansi_custom) {
                    setErrors((prev) => ({ ...prev, nama_instansi_custom: null }));
                  }
                }}
                className={`relative z-10 flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                  !isInstansi ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className={`w-4 h-4 transition-transform duration-200 ${!isInstansi ? 'scale-105' : ''}`} />
                <span>Pribadi / Keluarga</span>
              </button>

              {/* Option 2: Instansi */}
              <button
                type="button"
                onClick={() => updateFormData({ pribadi_instansi: 'Instansi' })}
                className={`relative z-10 flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                  isInstansi ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className={`w-4 h-4 transition-transform duration-200 ${isInstansi ? 'scale-105' : ''}`} />
                <span>Instansi / Lembaga</span>
              </button>
            </div>

            {/* Input Nama Instansi jika memilih Instansi dengan Smooth Expand */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                isInstansi ? 'max-h-36 opacity-100 mt-3.5' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
              }`}
            >
              <div className="max-w-md">
                <label htmlFor="instansi-name" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Nama Lembaga / Yayasan <span className="text-rose-500">*</span>
                </label>
                <input
                  id="instansi-name"
                  type="text"
                  value={nama_instansi_custom || ''}
                  onChange={(e) => {
                    updateFormData({ nama_instansi_custom: e.target.value });
                    if (errors.nama_instansi_custom) {
                      setErrors((prev) => ({ ...prev, nama_instansi_custom: null }));
                    }
                  }}
                  placeholder="Contoh: Yayasan Mutiara Bangsa / STIFIn Jakarta"
                  className={`block w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                    errors.nama_instansi_custom
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                      : 'border-slate-300 focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]'
                  }`}
                />
                {errors.nama_instansi_custom && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.nama_instansi_custom}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Nama Keluarga & Total Jumlah Anggota Keluarga */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-4">
            <div>
              <label htmlFor="family-name" className="block text-xs font-semibold text-slate-900 tracking-wide mb-1.5">
                Nama Keluarga Partner IKY <span className="text-rose-500">*</span>
              </label>
              <input
                id="family-name"
                type="text"
                value={nama_keluarga}
                onChange={(e) => {
                  updateFormData({ nama_keluarga: e.target.value });
                  if (errors.nama_keluarga) {
                    setErrors((prev) => ({ ...prev, nama_keluarga: null }));
                  }
                }}
                placeholder="Contoh: Keluarga Hendra Pratama"
                className={`block w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                  errors.nama_keluarga
                    ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                    : 'border-slate-300 focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]'
                }`}
              />
              {errors.nama_keluarga ? (
                <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.nama_keluarga}</span>
                </p>
              ) : (
                <span className="block text-[11px] text-slate-500 mt-1">
                  Nama ini dicetak di piagam resmi dengan akhiran <strong className="font-semibold text-slate-700">FAMILY</strong>.
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 tracking-wide mb-1.5">
                Total Anggota (Jiwa) <span className="text-rose-500">*</span>
              </label>

              {/* Stepper Klik +/- (Dengan Animasi Pop GSAP seperti di Page Anak) */}
              <div className="flex items-center h-[42px] bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
                {/* Tombol Minus */}
                <button
                  type="button"
                  disabled={(jumlah_anggota_keluarga || 2) <= 2}
                  onClick={() => handleStepperChange(-1)}
                  className="w-10 h-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border-r border-slate-200 transition-all active:scale-90 cursor-pointer select-none"
                  title="Kurangi 1 Anggota"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {/* Display Nilai dengan Animasi Pop */}
                <div className="flex-1 flex items-center justify-center gap-1.5 px-2 select-none">
                  <Users className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  <span
                    ref={counterNumRef}
                    className="font-bold text-slate-900 text-sm inline-block"
                  >
                    {jumlah_anggota_keluarga || 2}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Jiwa</span>
                </div>

                {/* Tombol Plus */}
                <button
                  type="button"
                  disabled={(jumlah_anggota_keluarga || 2) >= 20}
                  onClick={() => handleStepperChange(1)}
                  className="w-10 h-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border-l border-slate-200 transition-all active:scale-90 cursor-pointer select-none"
                  title="Tambah 1 Anggota"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="block text-[11px] text-slate-500 mt-1">
                {(() => {
                  const total = jumlah_anggota_keluarga || 2;
                  const anak = Math.max(0, total - 2);
                  return `Ayah + Ibu${anak > 0 ? ` + ${anak} Anak` : ''} (${total} Jiwa)`;
                })()}
              </span>
            </div>
          </div>

          {/* Section: Kontak Responden (WhatsApp & Email) */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200">
            <div className="flex items-center gap-2 pb-3 mb-3.5 border-b border-slate-200/80">
              <Phone className="w-4 h-4 text-[#1E3A8A]" />
              <div>
                <span className="text-sm font-bold text-slate-900 block leading-tight">
                  Kontak Responden / Penanggung Jawab
                </span>
                <span className="text-[11px] text-slate-500">
                  Informasi untuk koordinasi kemitraan dan pengiriman informasi berkas
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp */}
              <div>
                <label htmlFor="resp-wa" className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>No. WhatsApp (Aktif) <span className="text-rose-500">*</span></span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="resp-wa"
                    type="tel"
                    value={no_wa || ''}
                    onChange={(e) => {
                      updateFormData({ no_wa: e.target.value });
                      if (errors.no_wa) {
                        setErrors((prev) => ({ ...prev, no_wa: null }));
                      }
                    }}
                    placeholder="Contoh: 081234567890"
                    className={`block w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                      errors.no_wa
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                        : 'border-slate-300 focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]'
                    }`}
                  />
                </div>
                {errors.no_wa ? (
                  <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.no_wa}</span>
                  </p>
                ) : (
                  <span className="block text-[11px] text-slate-500 mt-1">
                    Nomor aktif yang terhubung dengan WhatsApp untuk koordinasi panitia.
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="resp-email" className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Email Responden
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="resp-email"
                    type="email"
                    value={email || ''}
                    onChange={(e) => {
                      updateFormData({ email: e.target.value });
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: null }));
                      }
                    }}
                    placeholder="Contoh: keluarga@gmail.com"
                    className={`block w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                      errors.email
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                        : 'border-slate-300 focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]'
                    }`}
                  />
                </div>
                {errors.email ? (
                  <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                ) : (
                  <span className="block text-[11px] text-slate-500 mt-1">
                    Opsional: Untuk pengiriman arsip dan pemberitahuan agenda IKY.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profil Orang Tua - Grid 2 Kolom Rapi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-1 mb-6">
            {/* Profil Ayah */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200">
              <div className="flex items-center gap-2 pb-3 mb-3.5 border-b border-slate-200/80">
                <UserCircle2 className="w-4 h-4 text-[#1E3A8A]" />
                <span className="text-sm font-bold text-slate-900">Profil Ayah</span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label htmlFor="father-name" className="block text-xs font-medium text-slate-600 mb-1">
                    Nama Lengkap Ayah
                  </label>
                  <input
                    id="father-name"
                    type="text"
                    value={nama_ayah || ''}
                    onChange={(e) => updateFormData({ nama_ayah: e.target.value })}
                    placeholder="Nama lengkap Ayah"
                    className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all"
                  />
                </div>

                <div className="grid grid-cols-[1fr_90px] gap-2.5 sm:gap-3">
                  <div>
                    <label htmlFor="father-stifin" className="block text-xs font-medium text-slate-600 mb-1">
                      Hasil STIFIn
                    </label>
                    <CustomSelect
                      id="father-stifin"
                      value={stifin_ayah || ''}
                      onChange={(val) => updateFormData({ stifin_ayah: val })}
                      options={STIFIN_OPTIONS}
                      placeholder="Pilih STIFIn"
                    />
                  </div>

                  <div>
                    <label htmlFor="father-blood" className="block text-xs font-medium text-slate-600 mb-1">
                      Gol. Darah
                    </label>
                    <CustomSelect
                      id="father-blood"
                      value={golongan_darah_ayah || ''}
                      onChange={(val) => updateFormData({ golongan_darah_ayah: val })}
                      options={GOLONGAN_DARAH_OPTIONS}
                      placeholder="Pilih"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Profil Ibu */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200">
              <div className="flex items-center gap-2 pb-3 mb-3.5 border-b border-slate-200/80">
                <UserCircle2 className="w-4 h-4 text-[#FF4081]" />
                <span className="text-sm font-bold text-slate-900">Profil Ibu</span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label htmlFor="mother-name" className="block text-xs font-medium text-slate-600 mb-1">
                    Nama Lengkap Ibu
                  </label>
                  <input
                    id="mother-name"
                    type="text"
                    value={nama_ibu || ''}
                    onChange={(e) => updateFormData({ nama_ibu: e.target.value })}
                    placeholder="Nama lengkap Ibu"
                    className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all"
                  />
                </div>

                <div className="grid grid-cols-[1fr_90px] gap-2.5 sm:gap-3">
                  <div>
                    <label htmlFor="mother-stifin" className="block text-xs font-medium text-slate-600 mb-1">
                      Hasil STIFIn
                    </label>
                    <CustomSelect
                      id="mother-stifin"
                      value={stifin_ibu || ''}
                      onChange={(val) => updateFormData({ stifin_ibu: val })}
                      options={STIFIN_OPTIONS}
                      placeholder="Pilih STIFIn"
                    />
                  </div>

                  <div>
                    <label htmlFor="mother-blood" className="block text-xs font-medium text-slate-600 mb-1">
                      Gol. Darah
                    </label>
                    <CustomSelect
                      id="mother-blood"
                      value={golongan_darah_ibu || ''}
                      onChange={(val) => updateFormData({ golongan_darah_ibu: val })}
                      options={GOLONGAN_DARAH_OPTIONS}
                      placeholder="Pilih"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Feedback / Kesan & Pesan Kemitraan (Di Bawah Profil Genetika Orang Tua) */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200">
            <div className="flex items-center gap-2 pb-3 mb-3.5 border-b border-slate-200/80">
              <MessageSquareQuote className="w-4 h-4 text-[#1E3A8A]" />
              <div>
                <span className="text-sm font-bold text-slate-900 block leading-tight">
                  Kesan &amp; Pesan Kemitraan (Feedback)
                </span>
                <span className="text-[11px] text-slate-500">
                  Kuesioner kemitraan keluarga partner IKY
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="kesan-pesan" className="block text-xs font-medium text-slate-600 mb-1.5">
                Kesan &amp; Pesan untuk I Know You
              </label>
              <textarea
                id="kesan-pesan"
                rows={3}
                value={kesan_pesan || ''}
                onChange={(e) => updateFormData({ kesan_pesan: e.target.value })}
                placeholder="Bagikan kesan, pesan, atau pengalaman Anda setelah mengenali fitrah genetik STIFIn keluarga..."
                className="block w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all resize-y"
              />
              <span className="block text-[11px] text-slate-400 mt-1">
                Masukan Anda sangat berharga bagi peningkatan layanan edukasi &amp; tes STIFIn I Know You.
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 rounded-lg bg-[#FF4081] hover:bg-[#E02868] text-white font-medium text-sm transition-all shadow-xs active:scale-[0.99] cursor-pointer"
            >
              <span>Lanjutkan ke Profil Genetika Anak</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
