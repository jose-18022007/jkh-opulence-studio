import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="noise-overlay relative min-h-screen flex flex-col" style={{ background: '#08080F' }}>
      <Navbar />

      <main className="flex-grow pt-28 pb-20 max-w-[800px] mx-auto px-6 relative z-10">
        {/* Back navigation */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/50 hover:text-gold transition-colors font-inter text-xs uppercase tracking-[3px] mb-8 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Home
        </motion.button>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 text-gold mb-3">
            <Shield size={24} />
            <span className="font-inter text-[11px] uppercase tracking-[4px] font-light">Security & Trust</span>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-extrabold gold-gradient-text leading-tight">
            Privacy Policy
          </h1>
          <p className="font-inter text-[13px] text-white/40 mt-3 uppercase tracking-[2px]">
            Last Updated: June 2026
          </p>
        </motion.div>

        {/* Policy Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card-gold p-8 md:p-10 space-y-8 text-white/70 font-inter text-sm md:text-[15px] leading-relaxed"
          style={{ borderRadius: 28 }}
        >
          <div>
            <h2 className="text-white font-semibold text-lg font-playfair mb-3">1. Introduction</h2>
            <p>
              Welcome to JKH Opulence Studio. We value your privacy and trust above all. This Privacy Policy describes how we collect, process, and protect your details when you use our mobile and web application. JKH Opulence Studio is designed as a frontend-only application, prioritizing device-level execution and security.
            </p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg font-playfair mb-3">2. Data Collection & Files</h2>
            <p>
              Because our app is structured to be client-side only, we do not operate a centralized backend server. 
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-white/60">
              <li>
                <strong>Local Images:</strong> Uploaded room images and generated designs are stored directly on your device using native local storage (Capacitor SQLite & Filesystem) and browser IndexedDB. We do not have database access to these files.
              </li>
              <li>
                <strong>AI Generation:</strong> Room images sent for AI transformation are processed via Pollinations AI. These endpoints temporarily fetch media URLs for design generation.
              </li>
              <li>
                <strong>Contact Form:</strong> Any message, phone number, name, or inquiry sent through the contact form is directly routed to our team inbox via Web3Forms API.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg font-playfair mb-3">3. Permissions Required</h2>
            <p>
              To offer a complete, interactive interior design experience on iOS, JKH Opulence Studio requires access to the following native components:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-white/60">
              <li>
                <strong>Camera:</strong> Required to capture real-time room photos for AI redesign.
              </li>
              <li>
                <strong>Photo Library / Gallery:</strong> Required to select pre-saved room layouts and save completed design transformations directly to your iOS camera roll.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg font-playfair mb-3">4. Security</h2>
            <p>
              We implement platform-standard encryption protocols. Your native designs reside locally inside secure container storage sandbox provided by iOS. We recommend setting app locks or device passwords to protect your stored layouts.
            </p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg font-playfair mb-3">5. Contact Info</h2>
            <p>
              If you have queries about your local data footprint or our privacy practices, contact us at:
              <br />
              <a href="mailto:info@jkhinterior.com" className="text-gold hover:underline mt-1 inline-block">info@jkhinterior.com</a>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
