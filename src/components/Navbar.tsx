import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navLinks = ['Home', 'How It Works', 'Designs', 'Generate', 'My Designs', 'Contact'];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = (link: string) => {
    setMobileOpen(false);
    
    if (link === 'My Designs') {
      navigate('/my-designs');
      return;
    }

    if (link === 'Contact') {
      navigate('/contact');
      return;
    }

    const targetId = link.toLowerCase().replace(/ /g, '-');
    if (location.pathname !== '/') {
      navigate(`/#${targetId}`);
    } else {
      const el = document.getElementById(targetId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 flex items-center transition-all duration-500"
        style={{
          backgroundColor: scrolled ? 'rgba(8,8,15,0.9)' : 'rgba(8,8,15,0.7)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(198,165,92,0.1)',
        }}
      >
        {/* Bottom shimmer line */}
        <div className="absolute bottom-0 left-0 right-0 h-px gold-gradient-bg opacity-50" />

        <div className="w-full max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="font-playfair text-2xl md:text-[28px] font-bold gold-gradient-text">JKH</span>
            <span className="w-px h-6 gold-gradient-bg opacity-50" />
            <span className="font-inter text-[11px] uppercase tracking-[4px] text-white/70">Interior</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <button
                key={link}
                onClick={() => handleLinkClick(link)}
                className="font-inter text-[11px] uppercase tracking-[3px] text-white/60 hover:text-white transition-colors duration-300 cursor-pointer font-light"
              >
                {link}
              </button>
            ))}
          </div>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleLinkClick('Generate')}
              className="hidden md:block btn-gold-pill text-sm px-7 py-2.5 font-inter"
            >
              Start Designing
            </motion.button>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-gold cursor-pointer"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8"
            style={{ background: 'rgba(8,8,15,0.95)', backdropFilter: 'blur(24px)' }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-6 text-white/70 cursor-pointer"
            >
              <X size={32} />
            </button>
            {navLinks.map((link, i) => (
              <motion.button
                key={link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleLinkClick(link)}
                className="font-playfair text-3xl text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                {link}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => handleLinkClick('Generate')}
              className="btn-gold-pill px-10 py-3 font-inter text-base mt-4"
            >
              Start Designing
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
