import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import LoadingScreen from './components/LoadingScreen';
import SidebarRail from './components/SidebarRail';
import StepOneDataKeluarga from './components/StepOneDataKeluarga';
import StepTwoProfilAnak from './components/StepTwoProfilAnak';
import StepThreeKonfirmasi from './components/StepThreeKonfirmasi';
import SuccessState from './components/SuccessState';
import AdminRekapView from './components/AdminRekapView';
import AdminAuthGate from './components/AdminAuthGate';
import ErrorBoundary from './components/ErrorBoundary';
import { AlertCircle, ShieldCheck } from 'lucide-react';

const INITIAL_FORM_DATA = {
  pribadi_instansi: 'Pribadi',
  nama_instansi_custom: '',
  status_pernikahan: 'Menikah',
  jumlah_anggota_keluarga: 2,
  nama_keluarga: '',
  no_wa: '',
  email: '',
  nama_ayah: '',
  stifin_ayah: '',
  golongan_darah_ayah: '',
  nama_ibu: '',
  stifin_ibu: '',
  golongan_darah_ibu: '',
  jumlah_anak: 0,
  anak: [],
  kesan_pesan: '',
};



function PortalContainer({
  step,
  setStep,
  formData,
  updateFormData,
  onNext,
  onPrev,
  onReset,
  onSubmit,
  isSubmitting,
  submitError,
  resultData,
  isAdminAuthed,
}) {
  const mainCardRef = useRef(null);

  useEffect(() => {
    if (mainCardRef.current) {
      gsap.fromTo(
        mainCardRef.current,
        {
          opacity: 0,
          scale: 0.94,
          y: 35,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-start pt-4 pb-36 sm:pt-6 sm:pb-48 px-3 sm:px-6 md:px-8 font-sans antialiased">
      <main
        ref={mainCardRef}
        className="w-full max-w-5xl bg-white rounded-2xl border border-slate-200/90 shadow-portal overflow-visible flex flex-col lg:flex-row relative"
      >
        {/* Sidebar Stepper - Brand Navy Panel */}
        <SidebarRail
          currentStep={step}
          setStep={(s) => setStep(s)}
          isSubmitted={step === 4}
        />

        {/* Right Form Canvas */}
        <section className="flex-1 bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between rounded-b-2xl lg:rounded-bl-none lg:rounded-r-2xl">
          <ErrorBoundary>
            {submitError && (
              <div className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {step === 1 && (
              <StepOneDataKeluarga
                formData={formData}
                updateFormData={updateFormData}
                onNext={onNext}
                isAdminAuthed={isAdminAuthed}
              />
            )}

            {step === 2 && (
              <StepTwoProfilAnak
                formData={formData}
                updateFormData={updateFormData}
                onNext={onNext}
                onPrev={onPrev}
              />
            )}

            {step === 3 && (
              <StepThreeKonfirmasi
                formData={formData}
                onPrev={onPrev}
                onEdit={() => setStep(1)}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
              />
            )}

            {step === 4 && (
              <SuccessState
                resultData={resultData}
                onReset={onReset}
              />
            )}
          </ErrorBoundary>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  const getIsAdmin = () => {
    return (
      window.location.pathname === '/admin' ||
      window.location.hash.toLowerCase().includes('admin') ||
      window.location.search.toLowerCase().includes('admin')
    );
  };

  const [isLoading, setIsLoading] = useState(!getIsAdmin());
  const [isAdminRoute, setIsAdminRoute] = useState(getIsAdmin);
  const [isAdminAuthed, setIsAdminAuthed] = useState(() => {
    return sessionStorage.getItem('iky_admin_auth') === 'true';
  });

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    const next = logoClicks + 1;
    if (next >= 3) {
      sessionStorage.removeItem('wif_marriage_locked');
      setFormData((prev) => ({ ...prev, status_pernikahan: 'Menikah' }));
      setLogoClicks(0);
      window.location.reload();
    } else {
      setLogoClicks(next);
      setTimeout(() => setLogoClicks(0), 1500);
    }
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(getIsAdmin());
      setIsAdminAuthed(sessionStorage.getItem('iky_admin_auth') === 'true');
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    scrollToTop();
  }, [step]);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setIsAdminRoute(path === '/admin');
  };

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = () => {
    setSubmitError(null);
    setStep((prev) => Math.min(prev + 1, 3));
    scrollToTop();
  };

  const handlePrev = () => {
    setSubmitError(null);
    setStep((prev) => Math.max(prev - 1, 1));
    scrollToTop();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const instansiLabel = formData.pribadi_instansi === 'Instansi' && formData.nama_instansi_custom?.trim()
        ? `Instansi: ${formData.nama_instansi_custom.trim()}`
        : 'Pribadi';

      const payload = {
        nama_keluarga: formData.nama_keluarga,
        pribadi_instansi: instansiLabel,
        status_pernikahan: formData.status_pernikahan || 'Menikah',
        jumlah_anggota_keluarga: Number(formData.jumlah_anggota_keluarga || 2),
        no_wa: formData.no_wa ? formData.no_wa.trim() : null,
        email: formData.email ? formData.email.trim() : null,
        nama_ayah: formData.nama_ayah,
        stifin_ayah: formData.stifin_ayah,
        golongan_darah_ayah: formData.golongan_darah_ayah,
        nama_ibu: formData.nama_ibu,
        stifin_ibu: formData.stifin_ibu,
        golongan_darah_ibu: formData.golongan_darah_ibu,
        kesan_pesan: formData.kesan_pesan ? formData.kesan_pesan.trim() : null,
        jumlah_anak: Number(formData.jumlah_anak || 0),
        anak: Array.isArray(formData.anak) ? formData.anak : [],
      };

      const res = await axios.post('/api/keluarga', payload);

      if (res.data && res.data.success) {
        setResultData(res.data.data);
        setStep(4);
        scrollToTop();
      } else {
        throw new Error(res.data?.message || 'Terjadi kesalahan saat memproses data.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      const msg = err.response?.data?.message || err.message || 'Gagal menghubungi server.';
      setSubmitError(msg);
      scrollToTop();
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleReset = () => {
    setFormData({
      pribadi_instansi: 'Pribadi',
      nama_instansi_custom: '',
      status_pernikahan: 'Menikah',
      jumlah_anggota_keluarga: 2,
      nama_keluarga: '',
      no_wa: '',
      email: '',
      nama_ayah: '',
      stifin_ayah: '',
      golongan_darah_ayah: '',
      nama_ibu: '',
      stifin_ibu: '',
      golongan_darah_ibu: '',
      jumlah_anak: 0,
      anak: [],
      kesan_pesan: '',
    });
    setResultData(null);
    setSubmitError(null);
    setStep(1);
  };

  if (isLoading) {
    return <LoadingScreen onFinish={() => setIsLoading(false)} />;
  }

  // RUTE INTERNAL ADMIN (/admin atau #admin)
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-[#FF4081]/20">
        {!isAdminAuthed ? (
          <AdminAuthGate
            onSuccess={() => setIsAdminAuthed(true)}
            onBackToHome={() => navigateTo('/')}
          />
        ) : (
          <AdminRekapView
            onBackToForm={() => navigateTo('/')}
            onLogout={() => {
              sessionStorage.removeItem('iky_admin_auth');
              setIsAdminAuthed(false);
            }}
          />
        )}
      </div>
    );
  }

  // RUTE PUBLIK UTAMA (/) - MURNI UNTUK USER PARTNER
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-[#FF4081]/20">
      {/* Universal Top App Header untuk Mitra Partner */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-2.5 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3.5 sm:gap-4">
          {/* Logo resmi IKNOWYOU by Miss Hiday */}
          <div className="flex items-center cursor-pointer select-none" onClick={handleLogoClick} title="IKNOWYOU (Ketuk 3x untuk reset uji coba)">
            <img
              src="/logo-iknowyou.png"
              alt="IKNOWYOU by Miss Hiday"
              className="h-8 sm:h-9 w-auto object-contain pointer-events-none"
            />
          </div>

          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />

          {/* Well Identified Family "Nama Keluarga Partner IKY" */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm tracking-tight text-slate-900 leading-tight">
                Well Identified Family
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 block leading-none mt-0.5">
              Keluarga Partner IKY
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500 hidden sm:block font-medium">
            Formulir Resmi
          </div>
          <button
            type="button"
            onClick={() => navigateTo('/admin')}
            className="text-[11px] sm:text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg border border-slate-200/80 transition-all flex items-center gap-1.5 cursor-pointer font-medium shadow-2xs"
            title="Akses Portal Rekap Admin"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Admin</span>
          </button>
        </div>
      </header>

      {/* Main Partner Form Canvas */}
      <div className="flex-1 flex flex-col">
        <PortalContainer
          step={step}
          setStep={setStep}
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onPrev={handlePrev}
          onReset={handleReset}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
          resultData={resultData}
          isAdminAuthed={isAdminAuthed}
        />
      </div>
    </div>
  );
}
