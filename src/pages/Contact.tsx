import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactSection from '@/components/ContactSection';

export const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="noise-overlay relative min-h-screen flex flex-col" style={{ background: '#08080F' }}>
      <Navbar />

      <main className="flex-grow pt-24 pb-10">
        <div className="max-w-[1200px] mx-auto px-6 relative z-10 pt-4">
          {/* Back navigation */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/50 hover:text-gold transition-colors font-inter text-xs uppercase tracking-[3px] mb-4 cursor-pointer bg-transparent border-none outline-none"
          >
            <ArrowLeft size={14} /> Back to Home
          </motion.button>
          
          <ContactSection />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
