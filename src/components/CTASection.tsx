import { motion } from 'framer-motion';

const CTASection = () => (
  <section className="py-20 md:py-32 relative overflow-hidden" style={{ background: '#0A0A14' }}>
    <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(198,165,92,0.08) 0%, transparent 70%)' }} />
    <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full animate-float pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.06) 0%, transparent 70%)', filter: 'blur(100px)' }} />

    <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-inter text-[11px] uppercase tracking-[4px] text-gold mb-6 font-light"
          style={{ border: '1px solid rgba(198,165,92,0.3)', background: 'rgba(198,165,92,0.05)' }}
        >
          ✨ Start Your Journey
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="font-playfair text-[34px] md:text-[60px] font-extrabold leading-tight mt-6"
        >
          Ready to Transform <span className="gold-shimmer-text shimmer-active" style={{ filter: 'drop-shadow(0 0 20px rgba(198,165,92,0.2))' }}>Your Home?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="font-inter text-sm md:text-base font-light text-white/45 mt-6 leading-relaxed tracking-[0.5px]"
        >
          Upload your room photo now and witness your space reimagined by AI in seconds. It's free, instant, and magical.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-10 btn-gold-pill text-lg font-playfair font-bold px-14 py-5 animate-pulse-gold cursor-pointer"
        >
          Start Designing Now →
        </motion.button>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="font-inter text-xs text-white/30 mt-6 uppercase tracking-[4px] font-light"
        >
          Join 500+ homeowners who already transformed their spaces
        </motion.p>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
