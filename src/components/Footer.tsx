import { motion } from 'framer-motion';
import { Instagram, Facebook, Youtube, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface FooterProps {
  setSelectedRoom?: (room: string) => void;
}

const socialLinks = [
  { icon: Instagram, url: 'https://instagram.com' },
  { icon: Facebook, url: 'https://facebook.com' },
  { icon: Youtube, url: 'https://youtube.com' },
  { icon: MessageCircle, url: 'https://wa.me/919876543210' },
];

const quickLinks = [
  { label: 'Home', target: 'home' },
  { label: 'About Us', target: 'about' },
  { label: 'Our Designs', target: 'designs' },
  { label: 'Generate Design', target: 'generate' },
  { label: 'Contact Us', target: 'contact' },
];

const services = [
  { label: 'TV Unit Design', roomType: 'TV Unit' },
  { label: 'Kitchen Interior', roomType: 'Kitchen' },
  { label: 'Wardrobe Design', roomType: 'Bedroom' },
  { label: 'Ceiling Design', roomType: 'Living Room' },
  { label: 'Full Home Interior', roomType: 'Living Room' },
  { label: 'Commercial Interior', roomType: 'Office' },
];

const Footer = ({ setSelectedRoom }: FooterProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleScrollClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    if (targetId === 'contact') {
      navigate('/contact');
      return;
    }
    if (location.pathname !== '/') {
      navigate(`/#${targetId}`);
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleServiceClick = (e: React.MouseEvent, roomType: string) => {
    e.preventDefault();
    if (setSelectedRoom) {
      setSelectedRoom(roomType);
    }
    if (location.pathname !== '/') {
      navigate('/#generate');
    } else {
      const el = document.getElementById('generate');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="pt-20 md:pt-24 pb-10" style={{ background: '#050508', borderTop: '1px solid rgba(198,165,92,0.1)' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8"
        >
          {/* Col 1 */}
          <div>
            <div className="mb-1">
              <span className="font-playfair text-3xl font-bold gold-gradient-text">JKH</span>
            </div>
            <span className="font-inter text-[11px] uppercase tracking-[5px] text-white/40">Interior</span>
            <p className="font-inter text-sm text-white/35 leading-relaxed mt-4">AI-Powered Interior Design Solutions. Transforming homes across India with cutting-edge technology and expert craftsmanship.</p>
            <div className="flex gap-3 mt-5">
              {socialLinks.map((s, i) => (
                <motion.a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, borderColor: 'rgba(198,165,92,0.6)' }}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:border-gold hover:text-gold transition-all duration-300 cursor-pointer"
                >
                  <s.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>
          {/* Col 2 */}
          <div>
            <h4 className="font-inter text-[11px] uppercase tracking-[4px] text-white font-semibold mb-5">Quick Links</h4>
            {quickLinks.map((l, i) => (
              <motion.a
                key={l.label}
                href={`#${l.target}`}
                onClick={(e) => handleScrollClick(e, l.target)}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="block font-inter text-[15px] text-white/40 hover:text-gold transition-colors duration-300 mb-3 cursor-pointer"
              >
                {l.label}
              </motion.a>
            ))}
          </div>
          {/* Col 3 */}
          <div>
            <h4 className="font-inter text-[11px] uppercase tracking-[4px] text-white font-semibold mb-5">Our Services</h4>
            {services.map((l, i) => (
              <motion.a
                key={l.label}
                href="#generate"
                onClick={(e) => handleServiceClick(e, l.roomType)}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="block font-inter text-[15px] text-white/40 hover:text-gold transition-colors duration-300 mb-3 cursor-pointer"
              >
                {l.label}
              </motion.a>
            ))}
          </div>
          {/* Col 4 */}
          <div>
            <h4 className="font-inter text-[11px] uppercase tracking-[4px] text-white font-semibold mb-5">Contact</h4>
            {[
              { icon: Phone, text: '+91 98765 43210', href: 'tel:+919876543210' },
              { icon: Mail, text: 'info@jkhinterior.com', href: 'mailto:info@jkhinterior.com' },
              { icon: MapPin, text: 'Chennai, Tamil Nadu', href: 'https://maps.google.com/?q=JKH+Interior+Chennai' },
            ].map((c, i) => (
              <motion.a
                key={i}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-center gap-3 mb-3 hover:text-gold group cursor-pointer"
              >
                <c.icon size={14} className="text-gold shrink-0 transition-transform group-hover:scale-110" />
                <span className="font-inter text-[15px] text-white/40 group-hover:text-gold transition-colors">{c.text}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <span className="font-inter text-[13px] text-white/30">© 2026 JKH Interior. All rights reserved.</span>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/privacy-policy')}
                className="font-inter text-[13px] text-white/30 hover:text-gold transition-colors cursor-pointer bg-transparent border-none p-0 outline-none"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => navigate('/terms-of-service')}
                className="font-inter text-[13px] text-white/30 hover:text-gold transition-colors cursor-pointer bg-transparent border-none p-0 outline-none"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
