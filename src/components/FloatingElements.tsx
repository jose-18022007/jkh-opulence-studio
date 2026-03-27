import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowUp } from 'lucide-react';

const FloatingElements = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* WhatsApp */}
      <motion.a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener"
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
        style={{ background: '#25D366', boxShadow: '0 8px 24px rgba(37,211,102,0.3)' }}
      >
        <MessageCircle size={26} className="text-white" />
      </motion.a>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.1 }}
            className="fixed bottom-24 right-8 z-40 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(8,8,15,0.8)', border: '1.5px solid rgba(198,165,92,0.4)' }}
          >
            <ArrowUp size={20} className="text-gold" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingElements;
