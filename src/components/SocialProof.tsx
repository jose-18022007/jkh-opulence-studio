import { motion } from 'framer-motion';

const items = [
  'Premium Quality ★',
  'AI Powered ⚡',
  'Expert Craftsmen 🛠',
  '500+ Projects ✓',
  '100% Satisfaction 💎',
];

const SocialProof = () => (
  <section className="py-12 md:py-16 border-t border-b" style={{ background: 'rgba(198,165,92,0.04)', borderColor: 'rgba(198,165,92,0.08)' }}>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="max-w-[1400px] mx-auto px-6 overflow-hidden"
    >
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center gap-8">
        {items.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex items-center gap-8"
          >
            <span className="font-inter text-[13px] uppercase tracking-[3px] text-white/50 whitespace-nowrap">{item}</span>
            {i < items.length - 1 && <span className="w-px h-5 gold-gradient-bg opacity-30" />}
          </motion.div>
        ))}
      </div>
      {/* Mobile marquee */}
      <div className="md:hidden overflow-hidden">
        <div className="flex animate-marquee w-max gap-10">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="font-inter text-[12px] uppercase tracking-[3px] text-white/50 whitespace-nowrap">{item}</span>
          ))}
        </div>
      </div>
    </motion.div>
  </section>
);

export default SocialProof;
