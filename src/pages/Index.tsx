import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SocialProof from '@/components/SocialProof';
import HowItWorks from '@/components/HowItWorks';
import DesignCategories from '@/components/DesignCategories';
import BeforeAfter from '@/components/BeforeAfter';
import DesignGallery from '@/components/DesignGallery';
import AIGenerator from '@/components/AIGenerator';
import Testimonials from '@/components/Testimonials';
import Statistics from '@/components/Statistics';
import AboutSection from '@/components/AboutSection';
import CTASection from '@/components/CTASection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import FloatingElements from '@/components/FloatingElements';
import LoadingScreen from '@/components/LoadingScreen';

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="noise-overlay relative">
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      {/* Flowing gold line alongside content */}
      <div
        className="hidden lg:block fixed left-[calc(50%-640px)] top-0 bottom-0 w-px z-30 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(198,165,92,0.08) 10%, rgba(198,165,92,0.15) 30%, rgba(198,165,92,0.08) 50%, rgba(198,165,92,0.15) 70%, rgba(198,165,92,0.08) 90%, transparent 100%)',
        }}
      />
      <div
        className="hidden lg:block fixed right-[calc(50%-640px)] top-0 bottom-0 w-px z-30 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(198,165,92,0.06) 15%, rgba(198,165,92,0.12) 40%, rgba(198,165,92,0.06) 60%, rgba(198,165,92,0.12) 80%, transparent 100%)',
        }}
      />

      {/* Ambient floating orbs scattered throughout the page */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[15%] left-[5%] w-[400px] h-[400px] rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.04) 0%, transparent 70%)', filter: 'blur(120px)' }} />
        <div className="absolute top-[35%] right-[8%] w-[350px] h-[350px] rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(217,169,56,0.035) 0%, transparent 70%)', filter: 'blur(110px)', animationDelay: '3s' }} />
        <div className="absolute top-[55%] left-[15%] w-[450px] h-[450px] rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(232,213,163,0.03) 0%, transparent 70%)', filter: 'blur(130px)', animationDelay: '1.5s' }} />
        <div className="absolute top-[75%] right-[12%] w-[380px] h-[380px] rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.04) 0%, transparent 70%)', filter: 'blur(100px)', animationDelay: '4s' }} />
        <div className="absolute top-[90%] left-[40%] w-[300px] h-[300px] rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(184,148,31,0.03) 0%, transparent 70%)', filter: 'blur(110px)', animationDelay: '2.5s' }} />
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <SocialProof />
        <HowItWorks />
        <div className="gold-divider" />
        <DesignCategories />
        <BeforeAfter />
        <DesignGallery />
        <div className="gold-divider" />
        <AIGenerator />
        <Testimonials />
        <Statistics />
        <AboutSection />
        <CTASection />
        <ContactSection />
        <Footer />
      </div>
      <FloatingElements />
    </div>
  );
};

export default Index;
