import React from 'react';
import { User, Award, ShieldCheck, ArrowRight } from 'lucide-react';

export default function StepOneDataKeluarga({ formData, updateFormData, onNext }) {
  const { nama_kepala_keluarga, jumlah_anggota, kategori_kemitraan, nama_pasangan, auto_cert } = formData;

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
    <div className="flex-1 flex flex-col justify-between step-content">
      <div>
        {/* Top Horizontal Progress Bar */}
        <header className="mb-6 sm:mb-8">
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4 sm:mb-6">
            <div className="bg-brand-pink h-full rounded-full w-1/3 transition-all duration-500 ease-out" />
          </div>

          <div className="inline-block px-2.5 py-1 rounded-full bg-pink-50 text-brand-pink font-bold text-[11px] tracking-wider uppercase mb-2 border border-pink-100">
            Langkah 1 dari 3
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-slate tracking-tight">
            Data Kepala &amp; Anggota Keluarga
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1.5 sm:mt-2 max-w-2xl leading-relaxed">
            Pastikan penulisan nama lengkap dan gelar akurat karena akan langsung dicetak pada piagam sertifikat kemitraan digital resmi I Know You.
          </p>
        </header>

        {/* Form Body Fields */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Row 1: Nama Lengkap Kepala Keluarga */}
          <div>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <label htmlFor="head-name" className="text-xs sm:text-sm font-bold text-brand-slate">
                Nama Lengkap Kepala Keluarga <span className="text-brand-pink">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">(Wajib diisi)</span>
            </div>
            <div className="relative rounded-xl shadow-sm">
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
                className="block w-full pl-10 pr-4 py-3 sm:py-2.5 text-sm bg-white border border-brand-border rounded-xl text-brand-slate placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all min-h-[44px]"
              />
            </div>
            <p className="mt-1.5 text-xs text-brand-muted">
              Nama ini yang akan menjadi nama utama pada sertifikat partner I Know You.
            </p>
          </div>

          {/* Row 2: Dua Kolom (Jumlah Anggota & Kategori Kemitraan) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Column 1: Stepper Counter */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-brand-slate mb-1.5 sm:mb-2">
                Jumlah Anggota Keluarga <span className="text-brand-pink">*</span>
              </label>
              <div className="flex items-center border border-brand-border rounded-xl bg-white p-1 h-[48px] sm:h-[44px] max-w-full">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-12 sm:w-10 h-full rounded-lg bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg sm:text-base transition-colors touch-manipulation min-w-[44px]"
                  aria-label="Kurangi jumlah anggota"
                >
                  −
                </button>
                <div className="flex-1 text-center font-semibold text-sm text-brand-slate">
                  {jumlah_anggota} Orang
                </div>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-12 sm:w-10 h-full rounded-lg bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg sm:text-base transition-colors touch-manipulation min-w-[44px]"
                  aria-label="Tambah jumlah anggota"
                >
                  +
                </button>
              </div>
              <span className="block mt-1.5 text-xs text-brand-muted">
                Termasuk kepala keluarga &amp; tanggungan
              </span>
            </div>

            {/* Column 2: Status Kemitraan Select Dropdown */}
            <div>
              <label htmlFor="partnership-category" className="block text-xs sm:text-sm font-bold text-brand-slate mb-1.5 sm:mb-2">
                Kategori / Status Kemitraan <span className="text-brand-pink">*</span>
              </label>
              <select
                id="partnership-category"
                value={kategori_kemitraan}
                onChange={(e) => updateFormData({ kategori_kemitraan: e.target.value })}
                className="block w-full bg-white border border-brand-border rounded-xl py-3 sm:py-2.5 px-3.5 text-sm text-brand-slate font-medium focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all min-h-[44px]"
              >
                <option value="Partner Mandiri (Pribadi)">Partner Mandiri (Pribadi)</option>
                <option value="Partner Komunitas / Rayon">Partner Komunitas / Rayon</option>
                <option value="Partner Korporat & Afiliasi">Partner Korporat &amp; Afiliasi</option>
                <option value="Partner Kehormatan IKY">Partner Kehormatan IKY</option>
              </select>
              <span className="block mt-1.5 text-xs text-brand-muted">
                Paket kemitraan dan fasilitas sertifikasi
              </span>
            </div>
          </div>

          {/* Row 3: Nama Pasangan / Wakil Pendamping */}
          <div>
            <label htmlFor="spouse-name" className="block text-xs sm:text-sm font-bold text-brand-slate mb-1.5 sm:mb-2">
              Nama Pasangan / Wakil Pendamping <span className="text-xs text-slate-400 font-normal">(Opsional)</span>
            </label>
            <input
              id="spouse-name"
              type="text"
              value={nama_pasangan}
              onChange={(e) => updateFormData({ nama_pasangan: e.target.value })}
              placeholder="Contoh: Siti Nurhaliza"
              className="block w-full px-3.5 py-3 sm:py-2.5 text-sm bg-white border border-brand-border rounded-xl text-brand-slate placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all min-h-[44px]"
            />
          </div>

          {/* Row 4: Interactive Toggle Card */}
          <div className="border border-brand-border rounded-2xl p-4 sm:p-5 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start space-x-3 sm:space-x-3.5">
              <div className="p-2 sm:p-2.5 rounded-xl bg-pink-100 text-brand-pink shrink-0 mt-0.5">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-brand-slate leading-snug">
                  Generate Sertifikat Otomatis Setelah Submit
                </h3>
                <p className="text-[11px] sm:text-xs text-brand-muted mt-1 leading-relaxed">
                  Sistem langsung membuat berkas PDF resmi dan membuka akses unduh seketika.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 touch-manipulation">
              <input
                type="checkbox"
                checked={auto_cert}
                onChange={(e) => updateFormData({ auto_cert: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink shadow-inner" />
            </label>
          </div>

          {/* Row 5: Callout Tip Banner */}
          <div className="rounded-2xl bg-[#EFF6FF] border border-blue-100 p-3.5 sm:p-4 flex items-start space-x-3">
            <div className="text-brand-navy shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-brand-navy" />
            </div>
            <div className="text-xs leading-relaxed text-slate-700">
              <span className="font-bold text-brand-navy block mb-0.5">
                Informasi Penomoran Sertifikat:
              </span>
              Nomor registrasi unik berformat{' '}
              <code className="bg-blue-100/80 text-brand-navy px-1.5 py-0.5 rounded font-mono font-bold">
                IKY-000X
              </code>{' '}
              akan dialokasikan otomatis oleh sistem di Langkah 3.
            </div>
          </div>

          {/* Navigation Buttons: Responsive full-width on mobile */}
          <div className="pt-5 sm:pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 sm:py-3 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white font-semibold text-sm shadow-md shadow-pink-500/25 transition-all transform active:scale-98 min-h-[44px]"
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
