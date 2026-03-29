import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import SectionHeading from './SectionHeading';

const contactCards = [
  { icon: Phone, color: '', title: '+91 98765 43210', sub: 'Call us anytime' },
  { icon: Mail, color: '', title: 'info@jkhinterior.com', sub: 'Write to us' },
  { icon: MapPin, color: '', title: 'Chennai, Tamil Nadu', sub: 'Visit our studio' },
  { icon: MessageCircle, color: '#25D366', title: 'Chat on WhatsApp', sub: 'Instant response' },
  { icon: Clock, color: '', title: 'Mon — Sat, 9AM — 7PM', sub: 'Working hours' },
];

const formFieldVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: 0.2 + i * 0.08, ease: 'easeOut' as const },
  }),
};

const contactCardVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1 + i * 0.1, type: 'spring' as const, stiffness: 100, damping: 15 },
  }),
};

const ContactSection = () => (
  <section id="contact" className="py-20 md:py-36" style={{ background: '#08080F' }}>
    <div className="max-w-[1200px] mx-auto px-6">
      <SectionHeading white="Get In" gold="Touch" sub="Let's discuss your dream interior project" />
      <div className="mt-16 grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 15 }}
          className="glass-card p-8 md:p-10"
          style={{ borderRadius: 32 }}
        >
          <div className="space-y-5">
            {[
              { label: 'Your Name', type: 'text' },
              { label: 'Phone Number', type: 'tel' },
              { label: 'Email Address', type: 'email' },
            ].map((f, i) => (
              <motion.div
                key={f.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={formFieldVariants}
              >
                <label className="font-inter text-[11px] uppercase tracking-[4px] text-white/40 mb-2 block font-light">{f.label}</label>
                <input
                  type={f.type}
                  className="w-full bg-white/[0.04] border border-white/[0.08] px-5 py-4 text-white font-inter text-base outline-none focus:border-gold/50 focus:shadow-[0_0_20px_rgba(198,165,92,0.08)] transition-all duration-300"
                  style={{ borderRadius: 12 }}
                />
              </motion.div>
            ))}
            <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={formFieldVariants}>
              <label className="font-inter text-[11px] uppercase tracking-[4px] text-white/40 mb-2 block font-light">What Do You Need?</label>
              <select className="w-full bg-white/[0.04] border border-white/[0.08] px-5 py-4 text-white/70 font-inter text-base outline-none focus:border-gold/50 transition-all duration-300 appearance-none cursor-pointer" style={{ borderRadius: 12 }}>
                <option value="">Select a service</option>
                {['TV Unit Design', 'Kitchen Interior', 'Wardrobe Design', 'Ceiling Design', 'Full Home Interior', 'Commercial Interior', 'Other'].map(o => (
                  <option key={o} value={o} className="bg-dark-primary">{o}</option>
                ))}
              </select>
            </motion.div>
            <motion.div custom={4} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={formFieldVariants}>
              <label className="font-inter text-[11px] uppercase tracking-[4px] text-white/40 mb-2 block font-light">Your Message</label>
              <textarea rows={4} className="w-full bg-white/[0.04] border border-white/[0.08] px-5 py-4 text-white font-inter text-base outline-none focus:border-gold/50 focus:shadow-[0_0_20px_rgba(198,165,92,0.08)] transition-all duration-300 resize-none" style={{ borderRadius: 12 }} />
            </motion.div>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full btn-gold-pill py-4 font-inter text-base font-bold mt-2"
            >
              Send Message →
            </motion.button>
          </div>
        </motion.div>

        {/* Contact Cards */}
        <div className="space-y-4">
          {contactCards.map((c, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={contactCardVariants}
              whileHover={{ y: -2, borderColor: 'rgba(198,165,92,0.3)' }}
              className="glass-card p-6 flex items-center gap-4 cursor-pointer transition-all duration-300"
              style={{ borderRadius: 24 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 300 }}
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{ background: c.color || 'linear-gradient(135deg, #C6A55C, #FCF6BA, #B8941F)' }}
              >
                <c.icon size={20} className="text-dark-primary" />
              </motion.div>
              <div>
                <p className="font-inter text-[15px] text-white font-semibold">{c.title}</p>
                <p className="font-inter text-[13px] text-white/40">{c.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ContactSection;
