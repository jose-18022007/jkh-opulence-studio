import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface Props {
  white: string;
  gold: string;
  sub?: string;
  emoji?: string;
}

const SectionHeading = ({ white, gold, sub, emoji }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [shimmer, setShimmer] = useState(false);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setShimmer(true), 400);
      return () => clearTimeout(t);
    }
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="text-center"
    >
      {/* Decorative gold rule above */}
      <div className="mx-auto mb-6 h-px w-[60px]" style={{ background: 'linear-gradient(90deg, transparent, #C6A55C, transparent)' }} />
      <h2 className="font-playfair text-[32px] md:text-[56px] font-extrabold leading-tight tracking-[-0.01em]">
        {white}{' '}
        <span
          className={`gold-shimmer-text ${shimmer ? 'shimmer-active' : ''}`}
          style={{ filter: 'drop-shadow(0 0 20px rgba(198,165,92,0.2))' }}
        >
          {gold}
        </span>
        {emoji ? ` ${emoji}` : ''}
      </h2>
      {/* Decorative gold rule below */}
      <div className="mx-auto mt-6 h-px w-[60px]" style={{ background: 'linear-gradient(90deg, transparent, #C6A55C, transparent)' }} />
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-inter text-sm md:text-[15px] font-light text-white/40 mt-5 max-w-xl mx-auto uppercase tracking-[3px] leading-relaxed"
        >
          {sub}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
