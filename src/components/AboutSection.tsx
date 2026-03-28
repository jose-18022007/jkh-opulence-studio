import { motion } from 'framer-motion';
import { Users, Sparkles, Gem, Clock } from 'lucide-react';

const features = [
  { icon: Users, title: 'Expert Craftsmen', desc: 'Skilled artisans with 10+ years experience' },
  { icon: Sparkles, title: 'AI-Powered Design', desc: 'Advanced AI for instant design generation' },
  { icon: Gem, title: 'Premium Materials', desc: 'Only the finest quality materials used' },
  { icon: Clock, title: 'On-Time Delivery', desc: 'Projects completed on schedule, every time' },
];

const AboutSection = () => (
  <section id="about" className="py-20 md:py-36" style={{ background: '#08080F' }}>
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden" style={{ aspectRatio: '4/5', background: 'linear-gradient(135deg, #1a1a2e, #2a1f3d, #16213E)', border: '2px solid rgba(198,165,92,0.15)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
            className="absolute -bottom-4 -right-4 md:bottom-8 md:right-[-20px] glass-card-gold rounded-2xl px-5 py-3"
          >
            <span className="font-playfair text-lg font-bold gold-gradient-text">10+</span>
            <span className="font-inter text-[13px] text-white/60 ml-2">Years Experience</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-inter text-[11px] uppercase tracking-[6px] inline-block font-light"
            style={{ color: 'rgba(198,165,92,0.7)' }}
          >
            About Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-playfair text-[34px] md:text-[48px] font-extrabold mt-3 leading-tight"
          >
            Crafting Dream <span className="gold-shimmer-text shimmer-active" style={{ filter: 'drop-shadow(0 0 20px rgba(198,165,92,0.2))' }}>Interiors</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-inter text-[15px] md:text-base font-light text-white/50 leading-[1.9] mt-6 tracking-[0.3px]"
          >
            We combine decades of interior design craftsmanship with cutting-edge artificial intelligence to make premium interior design accessible to every homeowner. From the first concept sketch to the final nail, JKH Interior transforms ordinary spaces into extraordinary homes that reflect your personality and lifestyle.
          </motion.p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.6 }}
                className="flex items-start gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.12, type: 'spring', stiffness: 250 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ border: '2px solid rgba(198,165,92,0.3)' }}
                >
                  <f.icon size={20} className="text-gold" />
                </motion.div>
                <div>
                  <p className="font-inter text-[15px] text-white font-semibold">{f.title}</p>
                  <p className="font-inter text-[13px] text-white/40 mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
