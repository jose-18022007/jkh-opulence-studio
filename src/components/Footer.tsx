import { motion } from 'framer-motion';
import { Instagram, Facebook, Youtube, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="pt-16 md:pt-20 pb-8" style={{ background: '#050508', borderTop: '1px solid rgba(198,165,92,0.1)' }}>
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
            {[Instagram, Facebook, Youtube, MessageCircle].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.15, borderColor: 'rgba(198,165,92,0.6)' }}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:border-gold hover:text-gold transition-all duration-300 cursor-pointer"
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>
        {/* Col 2 */}
        <div>
          <h4 className="font-inter text-sm uppercase tracking-[2px] text-white font-semibold mb-5">Quick Links</h4>
          {['Home', 'About Us', 'Our Designs', 'Generate Design', 'Contact Us'].map((l, i) => (
            <motion.a
              key={l}
              href="#"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="block font-inter text-[15px] text-white/40 hover:text-gold transition-colors duration-300 mb-3 cursor-pointer"
            >
              {l}
            </motion.a>
          ))}
        </div>
        {/* Col 3 */}
        <div>
          <h4 className="font-inter text-sm uppercase tracking-[2px] text-white font-semibold mb-5">Our Services</h4>
          {['TV Unit Design', 'Kitchen Interior', 'Wardrobe Design', 'Ceiling Design', 'Full Home Interior', 'Commercial Interior'].map((l, i) => (
            <motion.a
              key={l}
              href="#"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="block font-inter text-[15px] text-white/40 hover:text-gold transition-colors duration-300 mb-3 cursor-pointer"
            >
              {l}
            </motion.a>
          ))}
        </div>
        {/* Col 4 */}
        <div>
          <h4 className="font-inter text-sm uppercase tracking-[2px] text-white font-semibold mb-5">Contact</h4>
          {[
            { icon: Phone, text: '+91 98765 43210' },
            { icon: Mail, text: 'info@jkhinterior.com' },
            { icon: MapPin, text: 'Chennai, Tamil Nadu' },
          ].map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex items-center gap-3 mb-3"
            >
              <c.icon size={14} className="text-gold shrink-0" />
              <span className="font-inter text-[15px] text-white/40">{c.text}</span>
            </motion.div>
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
          <span className="font-inter text-[13px] text-white/30">© 2025 JKH Interior. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="font-inter text-[13px] text-white/30 hover:text-gold transition-colors cursor-pointer">Privacy Policy</a>
            <a href="#" className="font-inter text-[13px] text-white/30 hover:text-gold transition-colors cursor-pointer">Terms of Service</a>
          </div>
        </div>
      </motion.div>
    </div>
  </footer>
);

export default Footer;
