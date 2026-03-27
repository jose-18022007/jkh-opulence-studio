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
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden" style={{ aspectRatio: '4/5', background: 'linear-gradient(135deg, #1a1a2e, #2a1f3d, #16213E)', border: '2px solid rgba(198,165,92,0.15)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} />
          <div className="absolute -bottom-4 -right-4 md:bottom-8 md:right-[-20px] glass-card-gold rounded-2xl px-5 py-3">
            <span className="font-playfair text-lg font-bold gold-gradient-text">10+</span>
            <span className="font-inter text-[13px] text-white/60 ml-2">Years Experience</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-inter text-[12px] uppercase tracking-[4px]" style={{ color: 'rgba(198,165,92,0.7)' }}>About Us</span>
          <h2 className="font-playfair text-3xl md:text-[44px] font-bold mt-3 leading-tight">
            Crafting Dream <span className="gold-gradient-text">Interiors</span>
          </h2>
          <p className="font-inter text-[16px] md:text-[17px] text-white/55 leading-relaxed mt-6">
            We combine decades of interior design craftsmanship with cutting-edge artificial intelligence to make premium interior design accessible to every homeowner. From the first concept sketch to the final nail, JKH Interior transforms ordinary spaces into extraordinary homes that reflect your personality and lifestyle.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ border: '2px solid rgba(198,165,92,0.3)' }}>
                  <f.icon size={20} className="text-gold" />
                </div>
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
