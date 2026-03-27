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

const ContactSection = () => (
  <section id="contact" className="py-20 md:py-36" style={{ background: '#08080F' }}>
    <div className="max-w-[1200px] mx-auto px-6">
      <SectionHeading white="Get In" gold="Touch" sub="Let's discuss your dream interior project" />
      <div className="mt-16 grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-3xl p-8 md:p-10"
        >
          <div className="space-y-5">
            {[
              { label: 'Your Name', type: 'text' },
              { label: 'Phone Number', type: 'tel' },
              { label: 'Email Address', type: 'email' },
            ].map(f => (
              <div key={f.label}>
                <label className="font-inter text-[12px] uppercase tracking-[2px] text-white/40 mb-2 block">{f.label}</label>
                <input
                  type={f.type}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4 text-white font-inter text-base outline-none focus:border-gold/50 focus:shadow-[0_0_20px_rgba(198,165,92,0.08)] transition-all duration-300"
                />
              </div>
            ))}
            <div>
              <label className="font-inter text-[12px] uppercase tracking-[2px] text-white/40 mb-2 block">What Do You Need?</label>
              <select className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4 text-white/70 font-inter text-base outline-none focus:border-gold/50 transition-all duration-300 appearance-none cursor-pointer">
                <option value="">Select a service</option>
                {['TV Unit Design', 'Kitchen Interior', 'Wardrobe Design', 'Ceiling Design', 'Full Home Interior', 'Commercial Interior', 'Other'].map(o => (
                  <option key={o} value={o} className="bg-dark-primary">{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-inter text-[12px] uppercase tracking-[2px] text-white/40 mb-2 block">Your Message</label>
              <textarea rows={4} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4 text-white font-inter text-base outline-none focus:border-gold/50 focus:shadow-[0_0_20px_rgba(198,165,92,0.08)] transition-all duration-300 resize-none" />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full btn-gold-pill py-4 font-inter text-base font-bold mt-2"
            >
              Send Message →
            </motion.button>
          </div>
        </motion.div>

        {/* Contact Cards */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          {contactCards.map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2, borderColor: 'rgba(198,165,92,0.3)' }}
              className="glass-card rounded-2xl p-5 md:p-6 flex items-center gap-4 cursor-pointer transition-all duration-300"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{ background: c.color || 'linear-gradient(135deg, #C6A55C, #E8D5A3)' }}
              >
                <c.icon size={20} className="text-dark-primary" />
              </div>
              <div>
                <p className="font-inter text-[15px] text-white font-semibold">{c.title}</p>
                <p className="font-inter text-[13px] text-white/40">{c.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default ContactSection;
