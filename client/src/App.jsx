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
import { AlertCircle, ShieldCheck } from 'lucide-react';

const INITIAL_FORM_DATA = {
  pribadi_instansi: 'Pribadi',
  nama_instansi_custom: '',
  nama_keluarga: 'Keluarga Hendra Pratama',
  nama_ayah: 'Hendra Pratama',
  stifin_ayah: 'Thinking Introvert',
  golongan_darah_ayah: 'O',
  nama_ibu: 'Siti Nurhaliza',
  stifin_ibu: 'Feeling Extrovert',
  golongan_darah_ibu: 'A',
  jumlah_anak: 2,
  anak: [
    { nama: 'Ahmad Dani Pratama', stifin: 'Sensing Extrovert', golongan_darah: 'O' },
    { nama: 'Aisyah Putri Pratama', stifin: 'Intuiting Introvert', golongan_darah: 'A' },
  ],
};

// Komponen Pembungkus Form Portal dengan Animasi Pop-Up Sekali di Awal
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
}) {
  const mainCardRef = useRef(null);

  // Animasi pop-up berjalan TEPAT saat komponen portal pertama kali muncul (Mount)
  useEffect(() => {
    if (mainCardRef.current) {
      gsap.fromTo(
        mainCardRef.current,
        {
          opacity: 0,
          scale: 0.90,
          y: 45,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.65,
          ease: 'back.out(1.4)', // Efek pop-up membal interaktif yang dinamis & fresh
        }
      );
    }
  }, []); // Hanya 1x saat portal muncul

  return (
    <div className="flex-1 flex items-center justify-center p-3 sm:p-6 md:p-8 font-sans antialiased overflow-x-hidden">
      <main
        ref={mainCardRef}
        className="w-full max-w-5xl bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[640px] lg:min-h-[680px]"
      >
        {/* Sidebar Stepper */}
        <SidebarRail
          currentStep={step}
          setStep={(s) => setStep(s)}
          isSubmitted={step === 4}
        />

        {/* Right Form Canvas */}
        <section className="flex-1 bg-white p-5 sm:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto">
          {submitError && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {step === 1 && (
            <StepOneDataKeluarga
              formData={formData}
              updateFormData={updateFormData}
              onNext={onNext}
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
        </section>
      </main>
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAdminAuthed, setIsAdminAuthed] = useState(() => {
    return sessionStorage.getItem('iky_admin_auth') === 'true';
  });

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      setIsAdminAuthed(sessionStorage.getItem('iky_admin_auth') === 'true');
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = () => {
    setSubmitError(null);
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setSubmitError(null);
    setStep((prev) => Math.max(prev - 1, 1));
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
        nama_ayah: formData.nama_ayah,
        stifin_ayah: formData.stifin_ayah,
        golongan_darah_ayah: formData.golongan_darah_ayah,
        nama_ibu: formData.nama_ibu,
        stifin_ibu: formData.stifin_ibu,
        golongan_darah_ibu: formData.golongan_darah_ibu,
        jumlah_anak: Number(formData.jumlah_anak || 0),
        anak: Array.isArray(formData.anak) ? formData.anak : [],
      };

      const res = await axios.post('/api/keluarga', payload);

      if (res.data && res.data.success) {
        setResultData(res.data.data);
        setStep(4); // 4 = Success screen
      } else {
        throw new Error(res.data?.message || 'Terjadi kesalahan saat memproses data.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      const msg = err.response?.data?.message || err.message || 'Gagal menghubungi server.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      pribadi_instansi: 'Pribadi',
      nama_instansi_custom: '',
      nama_keluarga: '',
      nama_ayah: '',
      stifin_ayah: '',
      golongan_darah_ayah: '',
      nama_ibu: '',
      stifin_ibu: '',
      golongan_darah_ibu: '',
      jumlah_anak: 0,
      anak: [],
    });
    setResultData(null);
    setSubmitError(null);
    setStep(1);
  };

  // 1. Fase Pertama: Loading Screen 2 Detik murni
  if (isLoading) {
    return <LoadingScreen onFinish={() => setIsLoading(false)} />;
  }

  // 2. RUTE INTERNAL ADMIN (/admin) dengan Proteksi Password
  if (currentPath === '/admin') {
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

  // 3. RUTE PUBLIK UTAMA (/) - MURNI UNTUK USER PARTNER
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-[#FF4081]/20">
      {/* Universal Top App Header untuk Mitra Partner */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 px-4 py-2.5 sm:px-8 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1E3A8A] to-[#FF4081] flex items-center justify-center text-white font-bold text-xs shadow-xs tracking-wider">
            IKY
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-slate-900 block leading-tight">
              Keluarga Partner <span className="text-[#FF4081]">I Know You</span>
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:block leading-none">
              Sistem Otomatisasi Sertifikasi &amp; Pemetaan Genetika STIFIn
            </span>
          </div>
        </div>

        {/* Badge Status Resmi Mitra */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Portal Resmi Mitra</span>
          </span>
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
        />
      </div>
    </div>
  );
}
