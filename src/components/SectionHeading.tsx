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
      <h2 className="font-playfair text-3xl md:text-[52px] font-bold leading-tight">
        {white}{' '}
        <span className={`gold-shimmer-text ${shimmer ? 'shimmer-active' : ''}`}>
          {gold}
        </span>
        {emoji ? ` ${emoji}` : ''}
      </h2>
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-inter text-base md:text-[17px] text-white/40 mt-4 max-w-xl mx-auto"
        >
          {sub}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
