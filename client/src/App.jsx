import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import LoadingScreen from './components/LoadingScreen';
import SidebarRail from './components/SidebarRail';
import StepOneDataKeluarga from './components/StepOneDataKeluarga';
import StepTwoKontakDomisili from './components/StepTwoKontakDomisili';
import StepThreeKonfirmasi from './components/StepThreeKonfirmasi';
import SuccessState from './components/SuccessState';
import { AlertCircle } from 'lucide-react';

const INITIAL_FORM_DATA = {
  nama_kepala_keluarga: 'Hendra Pratama, S.T.',
  jumlah_anggota: 4,
  kategori_kemitraan: 'Partner Mandiri (Pribadi)',
  nama_pasangan: 'Siti Nurhaliza',
  auto_cert: true,
  kontak_wa: '812-3456-7890',
  kontak_email: 'hendra.pratama@email.com',
  alamat: 'Jl. Melati Raya No. 45, RT 03 / RW 07, Kel. Sukamaju, Kec. Cilodong',
  provinsi: 'Jawa Barat',
  kota: 'Kota Depok',
};

// Komponen Pembungkus Form Portal dengan Animasi Pop-Up Sekali di Awal
function PortalContainer({ step, setStep, formData, updateFormData, onNext, onPrev, onReset, onSubmit, isSubmitting, submitError, resultData }) {
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-3 sm:p-6 md:p-8 font-sans antialiased overflow-x-hidden">
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
            <StepTwoKontakDomisili
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
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [resultData, setResultData] = useState(null);

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
      const fullContact = formData.kontak_wa
        ? `+62 ${formData.kontak_wa} / ${formData.kontak_email}`
        : formData.kontak_email;

      const fullAddress = formData.alamat
        ? `${formData.alamat}, ${formData.kota}, ${formData.provinsi}`
        : '';

      const payload = {
        nama_kepala_keluarga: formData.nama_kepala_keluarga,
        jumlah_anggota: Number(formData.jumlah_anggota),
        kontak: fullContact,
        alamat: fullAddress,
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
      nama_kepala_keluarga: '',
      jumlah_anggota: 1,
      kategori_kemitraan: 'Partner Mandiri (Pribadi)',
      nama_pasangan: '',
      auto_cert: true,
      kontak_wa: '',
      kontak_email: '',
      alamat: '',
      provinsi: 'Jawa Barat',
      kota: 'Kota Depok',
    });
    setResultData(null);
    setSubmitError(null);
    setStep(1);
  };

  // 1. Fase Pertama: Loading Screen 2 Detik murni
  if (isLoading) {
    return <LoadingScreen onFinish={() => setIsLoading(false)} />;
  }

  // 2. Fase Kedua: Begitu loading kelar, langsung pop-up portalnya, seterusnya stabil
  return (
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
  );
}
