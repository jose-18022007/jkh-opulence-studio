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

      {/* Continuous vertical gold connector line with diamond dots at section transitions */}
      <div className="hidden lg:block fixed left-[calc(50%-640px)] top-0 bottom-0 z-30 pointer-events-none">
        <div className="absolute inset-0 w-px" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(198,165,92,0.08) 5%, rgba(198,165,92,0.08) 95%, transparent 100%)' }} />
        {/* Diamond dots at section transitions */}
        {[12, 24, 36, 48, 60, 72, 84].map(pct => (
          <div
            key={pct}
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: `${pct}%`,
              width: 6,
              height: 6,
              background: '#C6A55C',
              transform: 'translateX(-50%) rotate(45deg)',
              opacity: 0.3,
              boxShadow: '0 0 8px rgba(198,165,92,0.3)',
            }}
          />
        ))}
      </div>
      <div
        className="hidden lg:block fixed right-[calc(50%-640px)] top-0 bottom-0 w-px z-30 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(198,165,92,0.06) 15%, rgba(198,165,92,0.06) 85%, transparent 100%)',
        }}
      />

      {/* Ambient floating orbs with pulsing scale */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[3%] w-[500px] h-[500px] rounded-full animate-orb-pulse" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.05) 0%, transparent 70%)', filter: 'blur(120px)' }} />
        <div className="absolute top-[25%] right-[5%] w-[400px] h-[400px] rounded-full animate-orb-pulse" style={{ background: 'radial-gradient(circle, rgba(217,169,56,0.04) 0%, transparent 70%)', filter: 'blur(110px)', animationDelay: '2s' }} />
        <div className="absolute top-[45%] left-[20%] w-[550px] h-[550px] rounded-full animate-orb-pulse" style={{ background: 'radial-gradient(circle, rgba(252,246,186,0.03) 0%, transparent 70%)', filter: 'blur(140px)', animationDelay: '1s' }} />
        <div className="absolute top-[60%] right-[10%] w-[450px] h-[450px] rounded-full animate-orb-pulse" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.04) 0%, transparent 70%)', filter: 'blur(120px)', animationDelay: '3s' }} />
        <div className="absolute top-[80%] left-[35%] w-[380px] h-[380px] rounded-full animate-orb-pulse" style={{ background: 'radial-gradient(circle, rgba(184,148,31,0.04) 0%, transparent 70%)', filter: 'blur(110px)', animationDelay: '4s' }} />
        <div className="absolute top-[5%] left-[50%] w-[300px] h-[300px] rounded-full animate-orb-pulse" style={{ background: 'radial-gradient(circle, rgba(232,213,163,0.03) 0%, transparent 70%)', filter: 'blur(100px)', animationDelay: '5s' }} />
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
