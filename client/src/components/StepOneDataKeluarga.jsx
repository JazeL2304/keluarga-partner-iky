import React from 'react';
import { User, Users, ChevronDown, ArrowRight } from 'lucide-react';

export default function StepOneDataKeluarga({ formData, updateFormData, onNext }) {
  const { nama_kepala_keluarga, jumlah_anggota, kategori_kemitraan, nama_pasangan } = formData;

  const handleIncrement = () => {
    updateFormData({ jumlah_anggota: (jumlah_anggota || 1) + 1 });
  };

  const handleDecrement = () => {
    if (jumlah_anggota > 1) {
      updateFormData({ jumlah_anggota: jumlah_anggota - 1 });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nama_kepala_keluarga || !nama_kepala_keluarga.trim()) {
      alert('Silakan isi Nama Lengkap Kepala Keluarga');
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
            Langkah 1 • Identitas Mitra
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Data Kepala &amp; Anggota Keluarga
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
            Nama kepala keluarga akan tercetak langsung pada piagam sertifikat kemitraan resmi I Know You.
          </p>
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Field: Nama Lengkap Kepala Keluarga */}
          <div>
            <label htmlFor="head-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Nama Lengkap Kepala Keluarga <span className="text-[#FF4081]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="head-name"
                type="text"
                required
                value={nama_kepala_keluarga}
                onChange={(e) => updateFormData({ nama_kepala_keluarga: e.target.value })}
                placeholder="Contoh: Hendra Pratama, S.T."
                className="block w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-colors"
              />
            </div>
          </div>

          {/* Grid: Jumlah Anggota & Kategori Kemitraan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Counter: Jumlah Anggota */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Jumlah Anggota Keluarga <span className="text-[#FF4081]">*</span>
              </label>
              <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden h-[42px]">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-12 h-full bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-semibold text-base transition-colors border-r border-slate-200 flex items-center justify-center select-none"
                  aria-label="Kurangi"
                >
                  −
                </button>
                <div className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-800">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{jumlah_anggota} Orang</span>
                </div>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-12 h-full bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-semibold text-base transition-colors border-l border-slate-200 flex items-center justify-center select-none"
                  aria-label="Tambah"
                >
                  +
                </button>
              </div>
            </div>

            {/* Select: Kategori Kemitraan */}
            <div>
              <label htmlFor="partnership-category" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Kategori Kemitraan <span className="text-[#FF4081]">*</span>
              </label>
              <div className="relative">
                <select
                  id="partnership-category"
                  value={kategori_kemitraan}
                  onChange={(e) => updateFormData({ kategori_kemitraan: e.target.value })}
                  className="block w-full appearance-none bg-white border border-slate-300 rounded-lg py-2.5 pl-3.5 pr-10 text-sm text-slate-900 font-medium focus:outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-colors"
                >
                  <option value="Partner Mandiri (Pribadi)">Partner Mandiri (Pribadi)</option>
                  <option value="Partner Komunitas / Rayon">Partner Komunitas / Rayon</option>
                  <option value="Partner Korporat & Afiliasi">Partner Korporat &amp; Afiliasi</option>
                  <option value="Partner Kehormatan IKY">Partner Kehormatan IKY</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Field: Nama Pasangan (Opsional) */}
          <div>
            <label htmlFor="spouse-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Nama Pasangan / Wakil Pendamping <span className="text-slate-400 font-normal lowercase">(opsional)</span>
            </label>
            <input
              id="spouse-name"
              type="text"
              value={nama_pasangan}
              onChange={(e) => updateFormData({ nama_pasangan: e.target.value })}
              placeholder="Contoh: Siti Nurhaliza"
              className="block w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-colors"
            />
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#FF4081] hover:bg-[#E02868] text-white font-medium text-sm transition-all shadow-sm active:scale-[0.99]"
            >
              <span>Lanjutkan ke Kontak &amp; Domisili</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
