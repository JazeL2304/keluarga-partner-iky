import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';
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

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [resultData, setResultData] = useState(null);

  const mainCardRef = useRef(null);
  const formAreaRef = useRef(null);

  // 1. Initial Page Load Entrance Animation (GSAP)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main Card Fade & Slide Up Entrance
      gsap.from(mainCardRef.current, {
        y: 30,
        autoAlpha: 0,
        scale: 0.985,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Desktop Sidebar Staggered Reveal
      gsap.from('.sidebar-brand, .sidebar-title, .stepper-item, .sidebar-support', {
        x: -16,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.15,
      });

      // Initial Form Elements Entrance
      gsap.from('.step-content', {
        y: 18,
        autoAlpha: 0,
        duration: 0.55,
        ease: 'power2.out',
        delay: 0.3,
      });
    });

    return () => ctx.revert();
  }, []);

  // 2. Smooth Transition Animation when changing steps
  useEffect(() => {
    if (formAreaRef.current) {
      gsap.fromTo(
        formAreaRef.current,
        { y: 14, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [step]);

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

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-brand-slate flex items-center justify-center p-2.5 sm:p-6 md:p-8 font-sans antialiased overflow-x-hidden">
      {/* Main Multi-Step Card with GSAP Ref */}
      <main
        ref={mainCardRef}
        className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[680px] lg:min-h-[720px] transition-all"
      >
        {/* Navigation Sidebar (Adaptive Mobile & Desktop) */}
        <SidebarRail
          currentStep={step}
          setStep={(s) => setStep(s)}
          isSubmitted={step === 4}
        />

        {/* Right Form Canvas */}
        <section
          ref={formAreaRef}
          className="flex-1 bg-white p-4 sm:p-8 lg:p-12 flex flex-col justify-between overflow-y-auto"
        >
          {submitError && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {step === 1 && (
            <StepOneDataKeluarga
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
            />
          )}

          {step === 2 && (
            <StepTwoKontakDomisili
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}

          {step === 3 && (
            <StepThreeKonfirmasi
              formData={formData}
              onPrev={handlePrev}
              onEdit={() => setStep(1)}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {step === 4 && (
            <SuccessState
              resultData={resultData}
              onReset={handleReset}
            />
          )}
        </section>
      </main>
    </div>
  );
}
