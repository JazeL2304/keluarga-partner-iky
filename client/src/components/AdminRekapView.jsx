import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Users,
  Building2,
  User,
  Baby,
  Search,
  Download,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

export default function AdminRekapView({ onBackToForm, onLogout }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'Pribadi' | 'Instansi'
  const [expandedRowId, setExpandedRowId] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/keluarga');
      if (res.data && res.data.success) {
        setData(res.data.data || []);
      } else {
        throw new Error(res.data?.message || 'Gagal memuat rekap data.');
      }
    } catch (err) {
      console.error('Error fetching rekap:', err);
      setError(err.response?.data?.message || err.message || 'Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    const totalKeluarga = data.length;
    let totalAnak = 0;
    let totalPribadi = 0;
    let totalInstansi = 0;

    data.forEach((item) => {
      const anakCount = Array.isArray(item.anak) ? item.anak.length : (item.jumlah_anak || 0);
      totalAnak += anakCount;

      const isInstansi = (item.pribadi_instansi || '').toLowerCase().includes('instansi');
      if (isInstansi) {
        totalInstansi += 1;
      } else {
        totalPribadi += 1;
      }
    });

    return { totalKeluarga, totalAnak, totalPribadi, totalInstansi };
  }, [data]);

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const isInstansi = (item.pribadi_instansi || '').toLowerCase().includes('instansi');
      if (categoryFilter === 'Pribadi' && isInstansi) return false;
      if (categoryFilter === 'Instansi' && !isInstansi) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchKeluarga = (item.nama_keluarga || '').toLowerCase().includes(q);
      const matchNo = (item.nomor_sertifikat || '').toLowerCase().includes(q);
      const matchAyah = (item.nama_ayah || '').toLowerCase().includes(q);
      const matchIbu = (item.nama_ibu || '').toLowerCase().includes(q);
      const matchInstansi = (item.pribadi_instansi || '').toLowerCase().includes(q);

      return matchKeluarga || matchNo || matchAyah || matchIbu || matchInstansi;
    });
  }, [data, searchQuery, categoryFilter]);

  const toggleRow = (id) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 md:px-8 bg-[#FAF8F5] min-h-screen">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE3D7]">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onBackToForm}
            className="p-2 rounded-lg border border-[#DED6CA] bg-white hover:bg-[#FAF8F5] text-[#58121A] transition-colors shadow-warm-sm cursor-pointer"
            title="Kembali ke Formulir Pendaftaran"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-serif font-bold uppercase tracking-wider text-[#58121A] bg-[#58121A]/10 px-2.5 py-0.5 rounded-full border border-[#58121A]/20">
                <ShieldCheck className="w-3 h-3 text-[#C4A36B]" />
                <span>Supervisi Internal</span>
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1A1B] tracking-tight mt-1">
              Buku Besar Registrasi Kemitraan
            </h1>
            <p className="text-xs sm:text-sm text-[#8A827E] mt-0.5">
              Data terpusat pendaftaran kemitraan keluarga STIFIn &amp; penerbitan berkas piagam resmi.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={fetchData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-[#DED6CA] bg-white hover:bg-[#FAF8F5] text-[#1F1A1B] transition-all shadow-warm-sm active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#C4A36B]' : 'text-[#8A827E]'}`} />
            <span>{isLoading ? 'Memuat...' : 'Perbarui Data'}</span>
          </button>

          <button
            type="button"
            onClick={onBackToForm}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#58121A] hover:bg-[#420D13] text-[#FAF8F5] transition-all shadow-warm active:scale-95 cursor-pointer"
            title="Buka Halaman Formulir Pendaftaran Mitra"
          >
            <User className="w-3.5 h-3.5 text-[#C4A36B]" />
            <span>Portal Partner</span>
          </button>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-rose-50 text-[#675F5B] hover:text-rose-700 border border-[#DED6CA] hover:border-rose-300 transition-all shadow-warm-sm active:scale-95 cursor-pointer"
              title="Kunci sesi admin dan keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
        {/* Card 1 */}
        <div className="p-4 rounded-xl bg-white border border-[#EAE3D7] shadow-warm-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-[#FAF8F5] border border-[#DED6CA] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-[#58121A]" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#8A827E]">Total Mitra</div>
            <div className="font-serif text-2xl font-bold text-[#58121A] leading-tight mt-0.5">
              {isLoading ? '...' : stats.totalKeluarga}
            </div>
            <div className="text-[10px] text-[#8A827E]">Keluarga terdaftar</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-xl bg-white border border-[#EAE3D7] shadow-warm-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-[#FAF8F5] border border-[#DED6CA] flex items-center justify-center shrink-0">
            <Baby className="w-5 h-5 text-[#C4A36B]" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#8A827E]">Total Anak</div>
            <div className="font-serif text-2xl font-bold text-[#58121A] leading-tight mt-0.5">
              {isLoading ? '...' : stats.totalAnak}
            </div>
            <div className="text-[10px] text-[#8A827E]">Anak teridentifikasi</div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-xl bg-white border border-[#EAE3D7] shadow-warm-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-[#FAF8F5] border border-[#DED6CA] flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-[#58121A]" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#8A827E]">Pribadi</div>
            <div className="font-serif text-2xl font-bold text-[#58121A] leading-tight mt-0.5">
              {isLoading ? '...' : stats.totalPribadi}
            </div>
            <div className="text-[10px] text-[#8A827E]">Jalur Mandiri</div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-xl bg-white border border-[#EAE3D7] shadow-warm-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-[#FAF8F5] border border-[#DED6CA] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-[#C4A36B]" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#8A827E]">Instansi</div>
            <div className="font-serif text-2xl font-bold text-[#58121A] leading-tight mt-0.5">
              {isLoading ? '...' : stats.totalInstansi}
            </div>
            <div className="text-[10px] text-[#8A827E]">Lembaga / Yayasan</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white border border-[#EAE3D7] rounded-xl p-3.5 sm:p-4 shadow-warm-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8A827E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama keluarga, nomor seri, orang tua..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#DED6CA] rounded-lg text-[#1F1A1B] placeholder-[#B5AEAB] focus:outline-none focus:bg-white focus:border-[#58121A] focus:ring-1 focus:ring-[#58121A] transition-all"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              categoryFilter === 'ALL'
                ? 'bg-[#58121A] text-[#FAF8F5] shadow-warm-sm'
                : 'bg-[#FAF8F5] text-[#675F5B] hover:bg-[#F3EFE7] border border-[#EAE3D7]'
            }`}
          >
            Semua ({data.length})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('Pribadi')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              categoryFilter === 'Pribadi'
                ? 'bg-[#58121A] text-[#FAF8F5] shadow-warm-sm'
                : 'bg-[#FAF8F5] text-[#675F5B] hover:bg-[#F3EFE7] border border-[#EAE3D7]'
            }`}
          >
            Pribadi ({stats.totalPribadi})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('Instansi')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              categoryFilter === 'Instansi'
                ? 'bg-[#58121A] text-[#FAF8F5] shadow-warm-sm'
                : 'bg-[#FAF8F5] text-[#675F5B] hover:bg-[#F3EFE7] border border-[#EAE3D7]'
            }`}
          >
            Instansi ({stats.totalInstansi})
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchData}
            className="font-bold underline hover:text-red-950 text-xs cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white border border-[#EAE3D7] rounded-xl shadow-warm-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#8A827E] gap-3">
            <RefreshCw className="w-7 h-7 animate-spin text-[#C4A36B]" />
            <p className="text-xs font-medium font-serif">Memuat data pendaftaran resmi...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-16 text-center px-4">
            <FileText className="w-9 h-9 text-[#DED6CA] mx-auto mb-2" />
            <p className="text-sm font-serif font-bold text-[#58121A]">Tidak ada data yang cocok</p>
            <p className="text-xs text-[#8A827E] mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `Tidak ditemukan hasil untuk "${searchQuery}".`
                : 'Belum ada data pendaftaran keluarga di sistem.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EAE3D7] text-[11px] font-serif font-bold text-[#58121A] tracking-wider uppercase">
                  <th className="py-3 px-4">No. Seri</th>
                  <th className="py-3 px-4">Mitra Keluarga</th>
                  <th className="py-3 px-4">Profil Ayah &amp; Ibu</th>
                  <th className="py-3 px-4 text-center">Anak</th>
                  <th className="py-3 px-4">Tanggal Terbit</th>
                  <th className="py-3 px-4 text-right">Berkas Piagam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D7] text-xs text-[#1F1A1B]">
                {filteredData.map((row) => {
                  const isExpanded = expandedRowId === row.id;
                  const isInstansi = (row.pribadi_instansi || '').toLowerCase().includes('instansi');
                  const anakList = Array.isArray(row.anak) ? row.anak : [];

                  return (
                    <React.Fragment key={row.id}>
                      <tr className={`hover:bg-[#FAF8F5]/60 transition-colors ${isExpanded ? 'bg-[#FAF8F5]/80' : ''}`}>
                        {/* No. Registrasi */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#58121A] whitespace-nowrap">
                          <span className="inline-block px-2.5 py-0.5 rounded bg-[#FAF8F5] border border-[#DED6CA] text-[11px]">
                            {row.nomor_sertifikat || '—'}
                          </span>
                        </td>

                        {/* Nama Keluarga & Kategori */}
                        <td className="py-3.5 px-4">
                          <div className="font-serif font-bold text-[#1F1A1B] text-sm">
                            {row.nama_keluarga}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-[#8A827E] font-sans">
                              {isInstansi ? row.pribadi_instansi : 'Jalur Pribadi'}
                            </span>
                          </div>
                        </td>

                        {/* Profil Ortu */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="text-[11px] text-[#675F5B] flex items-center gap-1.5">
                              <span className="font-serif font-bold text-[#58121A]">Ayah:</span>
                              <span>{row.nama_ayah || '—'}</span>
                              {row.stifin_ayah && (
                                <span className="bg-[#FAF8F5] text-[#58121A] text-[10px] font-medium px-1.5 py-0.2 rounded border border-[#EAE3D7]">
                                  {row.stifin_ayah} ({row.golongan_darah_ayah || '?'})
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#675F5B] flex items-center gap-1.5">
                              <span className="font-serif font-bold text-[#58121A]">Ibu:</span>
                              <span>{row.nama_ibu || '—'}</span>
                              {row.stifin_ibu && (
                                <span className="bg-[#FAF8F5] text-[#58121A] text-[10px] font-medium px-1.5 py-0.2 rounded border border-[#EAE3D7]">
                                  {row.stifin_ibu} ({row.golongan_darah_ibu || '?'})
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Anak Count & Expand button */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => toggleRow(row.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FAF8F5] hover:bg-[#F3EFE7] text-[#58121A] font-medium text-[11px] border border-[#EAE3D7] transition-colors cursor-pointer"
                          >
                            <Baby className="w-3 h-3 text-[#C4A36B]" />
                            <span>{anakList.length || row.jumlah_anak || 0} Anak</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3 text-[#8A827E]" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-[#8A827E]" />
                            )}
                          </button>
                        </td>

                        {/* Tanggal */}
                        <td className="py-3.5 px-4 text-[#8A827E] whitespace-nowrap text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-[#C4A36B]" />
                            <span>{formatDate(row.tanggal_submit)}</span>
                          </div>
                        </td>

                        {/* Actions (Unduh & Buka) */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`/api/keluarga/${row.id}/pdf`}
                              download={`Sertifikat-${row.nomor_sertifikat}.pdf`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#DED6CA] bg-white hover:bg-[#FAF8F5] text-[#58121A] font-semibold text-[11px] shadow-warm-sm transition-all active:scale-95"
                              title="Unduh Berkas PDF Resmi"
                            >
                              <Download className="w-3 h-3 text-[#C4A36B]" />
                              <span>Unduh</span>
                            </a>
                            {row.url_sertifikat && (
                              <a
                                href={row.url_sertifikat}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EFE7] text-[#C4A36B] hover:text-[#58121A] font-semibold text-[11px] border border-[#C4A36B]/30 shadow-warm-sm transition-all active:scale-95"
                                title="Buka Piagam di Tab Baru"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Buka</span>
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Anak Drawer Row */}
                      {isExpanded && (
                        <tr className="bg-[#FAF8F5]/80">
                          <td colSpan={6} className="px-6 py-4 border-y border-[#EAE3D7]">
                            <div className="space-y-2">
                              <div className="text-[11px] font-serif font-bold text-[#58121A] flex items-center gap-1.5">
                                <Baby className="w-3.5 h-3.5 text-[#C4A36B]" />
                                <span>Rincian Profil Genetika Anak ({anakList.length} Anak):</span>
                              </div>

                              {anakList.length === 0 ? (
                                <p className="text-xs text-[#8A827E] italic">
                                  Tidak ada rincian data anak yang diinputkan.
                                </p>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                                  {anakList.map((a, idx) => (
                                    <div
                                      key={a.id || idx}
                                      className="p-3 rounded-lg bg-white border border-[#EAE3D7] shadow-warm-sm"
                                    >
                                      <div className="font-serif font-bold text-[#1F1A1B] text-xs">
                                        {idx + 1}. {a.nama || 'Tanpa Nama'}
                                      </div>
                                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#675F5B]">
                                        <span className="font-semibold text-[#58121A] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#EAE3D7]">
                                          {a.stifin || 'Belum Tes'}
                                        </span>
                                        {a.golongan_darah && (
                                          <span className="font-mono text-[#8A827E] bg-[#FAF8F5] px-1.5 py-0.5 rounded">
                                            Gol. {a.golongan_darah}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
