import React, { useState } from 'react';
import { User, Building2, ChevronDown, ArrowRight, AlertCircle, UserCircle2 } from 'lucide-react';
import { STIFIN_OPTIONS, GOLONGAN_DARAH_OPTIONS } from '../constants/stifin';

export default function StepOneDataKeluarga({ formData, updateFormData, onNext }) {
  const {
    pribadi_instansi,
    nama_instansi_custom,
    nama_keluarga,
    nama_ayah,
    stifin_ayah,
    golongan_darah_ayah,
    nama_ibu,
    stifin_ibu,
    golongan_darah_ibu,
  } = formData;

  const [errors, setErrors] = useState({});
  const isInstansi = pribadi_instansi === 'Instansi';

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!nama_keluarga || !nama_keluarga.trim()) {
      newErrors.nama_keluarga = 'Nama Keluarga wajib diisi untuk dicetak pada piagam penghargaan';
    }
    if (isInstansi && (!nama_instansi_custom || !nama_instansi_custom.trim())) {
      newErrors.nama_instansi_custom = 'Nama Instansi / Lembaga wajib diisi untuk pendaftaran instansi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        {/* Step Header */}
        <header className="mb-6 pb-4 border-b border-slate-200/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF4081] block mb-1">
            Tahap 1 dari 3
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Profil Kemitraan &amp; Orang Tua
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
            Lengkapi data jalur kemitraan keluarga dan profil tes genetik STIFIn untuk penerbitan piagam resmi.
          </p>
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Kategori Pendaftaran */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 tracking-wide mb-2">
              Jalur Pendaftaran <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => {
                  updateFormData({ pribadi_instansi: 'Pribadi', nama_instansi_custom: '' });
                  if (errors.nama_instansi_custom) {
                    setErrors((prev) => ({ ...prev, nama_instansi_custom: null }));
                  }
                }}
                className={`py-2.5 px-4 rounded-lg border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !isInstansi
                    ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <User className={`w-4 h-4 ${!isInstansi ? 'text-white' : 'text-slate-400'}`} />
                <span>Pribadi / Keluarga</span>
              </button>

              <button
                type="button"
                onClick={() => updateFormData({ pribadi_instansi: 'Instansi' })}
                className={`py-2.5 px-4 rounded-lg border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isInstansi
                    ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Building2 className={`w-4 h-4 ${isInstansi ? 'text-white' : 'text-slate-400'}`} />
                <span>Instansi / Lembaga</span>
              </button>
            </div>

            {/* Input Nama Instansi jika memilih Instansi */}
            {isInstansi && (
              <div className="mt-3 max-w-md transition-all duration-200 ease-out">
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
                  autoFocus
                />
                {errors.nama_instansi_custom && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.nama_instansi_custom}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Nama Keluarga (Dicetak di Piagam) */}
          <div>
            <label htmlFor="family-name" className="block text-xs font-semibold text-slate-900 tracking-wide mb-1.5">
              Nama Keluarga yang Dicetak pada Piagam <span className="text-rose-500">*</span>
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
              className={`block w-full max-w-xl px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
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
                Nama ini yang akan dicetak di panel utama piagam resmi dengan akhiran <strong className="font-semibold text-slate-700">FAMILY</strong>.
              </span>
            )}
          </div>

          {/* Profil Orang Tua - Grid 2 Kolom Rapi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-1">
            {/* Profil Ayah */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200">
              <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-200/80">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <UserCircle2 className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Profil Ayah</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#1E3A8A] font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                  Kepala Keluarga
                </span>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="father-stifin" className="block text-xs font-medium text-slate-600 mb-1">
                      Hasil STIFIn
                    </label>
                    <div className="relative">
                      <select
                        id="father-stifin"
                        value={stifin_ayah || ''}
                        onChange={(e) => updateFormData({ stifin_ayah: e.target.value })}
                        className="block w-full appearance-none bg-white border border-slate-300 rounded-lg py-2 pl-3 pr-8 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all"
                      >
                        <option value="">Pilih STIFIn</option>
                        {STIFIN_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="father-blood" className="block text-xs font-medium text-slate-600 mb-1">
                      Gol. Darah
                    </label>
                    <div className="relative">
                      <select
                        id="father-blood"
                        value={golongan_darah_ayah || ''}
                        onChange={(e) => updateFormData({ golongan_darah_ayah: e.target.value })}
                        className="block w-full appearance-none bg-white border border-slate-300 rounded-lg py-2 pl-3 pr-8 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all"
                      >
                        <option value="">Pilih</option>
                        {GOLONGAN_DARAH_OPTIONS.map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profil Ibu */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200">
              <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-200/80">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <UserCircle2 className="w-4 h-4 text-[#FF4081]" />
                  <span>Profil Ibu</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#FF4081] font-semibold bg-pink-50 px-2 py-0.5 rounded border border-pink-200/60">
                  Ibu Keluarga
                </span>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="mother-stifin" className="block text-xs font-medium text-slate-600 mb-1">
                      Hasil STIFIn
                    </label>
                    <div className="relative">
                      <select
                        id="mother-stifin"
                        value={stifin_ibu || ''}
                        onChange={(e) => updateFormData({ stifin_ibu: e.target.value })}
                        className="block w-full appearance-none bg-white border border-slate-300 rounded-lg py-2 pl-3 pr-8 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all"
                      >
                        <option value="">Pilih STIFIn</option>
                        {STIFIN_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="mother-blood" className="block text-xs font-medium text-slate-600 mb-1">
                      Gol. Darah
                    </label>
                    <div className="relative">
                      <select
                        id="mother-blood"
                        value={golongan_darah_ibu || ''}
                        onChange={(e) => updateFormData({ golongan_darah_ibu: e.target.value })}
                        className="block w-full appearance-none bg-white border border-slate-300 rounded-lg py-2 pl-3 pr-8 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all"
                      >
                        <option value="">Pilih</option>
                        {GOLONGAN_DARAH_OPTIONS.map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
