import { motion } from 'framer-motion';

const CTASection = () => (
  <section className="py-20 md:py-32 relative overflow-hidden" style={{ background: '#0A0A14' }}>
    <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(198,165,92,0.08) 0%, transparent 70%)' }} />
    <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full animate-float pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.06) 0%, transparent 70%)', filter: 'blur(100px)' }} />

    <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-inter text-[12px] uppercase tracking-[3px] text-gold mb-6" style={{ border: '1px solid rgba(198,165,92,0.3)', background: 'rgba(198,165,92,0.05)' }}>
          ✨ Start Your Journey
        </span>
        <h2 className="font-playfair text-3xl md:text-[56px] font-bold leading-tight mt-6">
          Ready to Transform <span className="gold-gradient-text">Your Home?</span>
        </h2>
        <p className="font-inter text-base md:text-lg text-white/50 mt-6 leading-relaxed">Upload your room photo now and witness your space reimagined by AI in seconds. It's free, instant, and magical.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-10 btn-gold-pill text-lg font-playfair font-bold px-14 py-5 animate-pulse-gold cursor-pointer"
        >
          Start Designing Now →
        </motion.button>
        <p className="font-inter text-sm text-white/35 mt-6">Join 500+ homeowners who already transformed their spaces</p>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
