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
    <div className="noise-overlay">
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
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
      <FloatingElements />
    </div>
  );
};

export default Index;
