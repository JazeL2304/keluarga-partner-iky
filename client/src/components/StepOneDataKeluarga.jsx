import React from 'react';
import { User, Building2, UserCircle2, ChevronDown, ArrowRight } from 'lucide-react';
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

  const isInstansi = pribadi_instansi === 'Instansi';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nama_keluarga || !nama_keluarga.trim()) {
      alert('Silakan isi Nama Keluarga (untuk dicetak pada sertifikat)');
      return;
    }
    if (isInstansi && (!nama_instansi_custom || !nama_instansi_custom.trim())) {
      alert('Silakan masukkan nama instansi');
      return;
    }
    onNext();
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        {/* Step Header */}
        <header className="mb-8">
          <div className="text-xs font-semibold text-[#FF4081] uppercase tracking-wider mb-1.5">
            Langkah 1 • Identitas &amp; Profil Orang Tua
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kuesioner Well Identified Family
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
            Lengkapi profil kemitraan dan data genetika orang tua berbasis tes STIFIn.
          </p>
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Kategori Pendaftaran (Pribadi vs Instansi) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Kategori Pendaftaran <span className="text-[#FF4081]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => updateFormData({ pribadi_instansi: 'Pribadi', nama_instansi_custom: '' })}
                className={`py-2.5 px-4 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  !isInstansi
                    ? 'border-[#FF4081] bg-pink-50/60 text-slate-900 font-semibold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4 text-[#FF4081]" />
                <span>Pribadi</span>
              </button>

              <button
                type="button"
                onClick={() => updateFormData({ pribadi_instansi: 'Instansi' })}
                className={`py-2.5 px-4 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  isInstansi
                    ? 'border-[#FF4081] bg-pink-50/60 text-slate-900 font-semibold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#FF4081]" />
                <span>Instansi</span>
              </button>
            </div>

            {/* Input Nama Instansi Manual jika memilih Instansi */}
            {isInstansi && (
              <div className="mt-3">
                <label htmlFor="instansi-name" className="block text-xs font-medium text-slate-600 mb-1.5">
                  Nama Instansi / Lembaga <span className="text-[#FF4081]">*</span>
                </label>
                <input
                  id="instansi-name"
                  type="text"
                  required={isInstansi}
                  value={nama_instansi_custom || ''}
                  onChange={(e) => updateFormData({ nama_instansi_custom: e.target.value })}
                  placeholder="Contoh: Yayasan Mutiara Bangsa / PT Sinergi Edukasi"
                  className="block w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-colors"
                />
              </div>
            )}
          </div>

          {/* Section 2: Nama Keluarga (Dicetak di Sertifikat) */}
          <div>
            <label htmlFor="family-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Nama Keluarga <span className="text-[#FF4081]">*</span>
            </label>
            <input
              id="family-name"
              type="text"
              required
              value={nama_keluarga}
              onChange={(e) => updateFormData({ nama_keluarga: e.target.value })}
              placeholder="Contoh: Keluarga Hendra Pratama"
              className="block w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-colors"
            />
            <span className="block text-[11px] text-slate-400 mt-1">
              Nama keluarga ini yang akan dicetak pada piagam sertifikat kemitraan resmi.
            </span>
          </div>

          {/* Section 3: Profil Genetika Ayah */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-700">
              <UserCircle2 className="w-4 h-4 text-[#1E3A8A]" />
              <span>Profil Genetika Ayah</span>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="father-name" className="block text-xs font-medium text-slate-600 mb-1.5">
                  Nama Lengkap Ayah
                </label>
                <input
                  id="father-name"
                  type="text"
                  value={nama_ayah || ''}
                  onChange={(e) => updateFormData({ nama_ayah: e.target.value })}
                  placeholder="Nama lengkap Ayah"
                  className="block w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="father-stifin" className="block text-xs font-medium text-slate-600 mb-1.5">
                    Hasil Tes STIFIn Ayah
                  </label>
                  <div className="relative">
                    <select
                      id="father-stifin"
                      value={stifin_ayah || ''}
                      onChange={(e) => updateFormData({ stifin_ayah: e.target.value })}
                      className="block w-full appearance-none bg-white border border-slate-300 rounded-lg py-2.5 pl-3.5 pr-10 text-sm text-slate-900 font-medium focus:outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-colors"
                    >
                      <option value="">Pilih Hasil STIFIn</option>
                      {STIFIN_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="father-blood" className="block text-xs font-medium text-slate-600 mb-1.5">
                    Golongan Darah Ayah
                  </label>
                  <div className="relative">
                    <select
                      id="father-blood"
                      value={golongan_darah_ayah || ''}
                      onChange={(e) => updateFormData({ golongan_darah_ayah: e.target.value })}
                      className="block w-full appearance-none bg-white border border-slate-300 rounded-lg py-2.5 pl-3.5 pr-10 text-sm text-slate-900 font-medium focus:outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-colors"
                    >
                      <option value="">Pilih Golongan Darah</option>
                      {GOLONGAN_DARAH_OPTIONS.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Profil Genetika Ibu */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-700">
              <UserCircle2 className="w-4 h-4 text-[#FF4081]" />
              <span>Profil Genetika Ibu</span>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="mother-name" className="block text-xs font-medium text-slate-600 mb-1.5">
                  Nama Lengkap Ibu
                </label>
                <input
                  id="mother-name"
                  type="text"
                  value={nama_ibu || ''}
                  onChange={(e) => updateFormData({ nama_ibu: e.target.value })}
                  placeholder="Nama lengkap Ibu"
                  className="block w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="mother-stifin" className="block text-xs font-medium text-slate-600 mb-1.5">
                    Hasil Tes STIFIn Ibu
                  </label>
                  <div className="relative">
                    <select
                      id="mother-stifin"
                      value={stifin_ibu || ''}
                      onChange={(e) => updateFormData({ stifin_ibu: e.target.value })}
                      className="block w-full appearance-none bg-white border border-slate-300 rounded-lg py-2.5 pl-3.5 pr-10 text-sm text-slate-900 font-medium focus:outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-colors"
                    >
                      <option value="">Pilih Hasil STIFIn</option>
                      {STIFIN_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="mother-blood" className="block text-xs font-medium text-slate-600 mb-1.5">
                    Golongan Darah Ibu
                  </label>
                  <div className="relative">
                    <select
                      id="mother-blood"
                      value={golongan_darah_ibu || ''}
                      onChange={(e) => updateFormData({ golongan_darah_ibu: e.target.value })}
                      className="block w-full appearance-none bg-white border border-slate-300 rounded-lg py-2.5 pl-3.5 pr-10 text-sm text-slate-900 font-medium focus:outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-colors"
                    >
                      <option value="">Pilih Golongan Darah</option>
                      {GOLONGAN_DARAH_OPTIONS.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                      <ChevronDown className="w-4 h-4" />
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
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#FF4081] hover:bg-[#E02868] text-white font-medium text-sm transition-all shadow-sm active:scale-[0.99]"
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
