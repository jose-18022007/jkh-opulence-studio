import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowUp } from 'lucide-react';

const FloatingElements = () => {
  const [showTop, setShowTop] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* WhatsApp */}
      <div className="fixed bottom-8 right-8 z-40 flex items-center gap-3">
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="px-4 py-2 rounded-full font-inter text-[12px] font-medium text-white whitespace-nowrap"
              style={{ background: 'rgba(8,8,15,0.9)', border: '1px solid rgba(198,165,92,0.2)', backdropFilter: 'blur(12px)' }}
            >
              Chat with us
            </motion.div>
          )}
        </AnimatePresence>
        <motion.a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setShowTooltip(true)}
          onHoverEnd={() => setShowTooltip(false)}
          className="w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer animate-pulse-gold"
          style={{ background: '#25D366', boxShadow: '0 8px 24px rgba(37,211,102,0.3)' }}
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={26} className="text-white" />
        </motion.a>
      </div>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-[104px] right-8 z-40 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
            aria-label="Scroll to top"
            style={{ background: 'rgba(8,8,15,0.85)', border: '1.5px solid rgba(198,165,92,0.3)', backdropFilter: 'blur(12px)' }}
          >
            <ArrowUp size={20} className="text-gold" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingElements;
