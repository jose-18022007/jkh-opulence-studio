import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { num: 1000, suffix: '+', label: 'Designs Generated' },
  { num: 500, suffix: '+', label: 'Happy Clients' },
  { num: 50, suffix: '+', label: 'Design Styles' },
  { num: 24, suffix: '/7', label: 'AI Available' },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / dur, 1);
      // Ease-out cubic for smoother counting
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <span ref={ref}>{val}{suffix}</span>;
};

const Statistics = () => (
  <section className="py-20 md:py-28 border-t border-b" style={{ background: 'linear-gradient(135deg, rgba(198,165,92,0.04), transparent, rgba(198,165,92,0.04))', borderColor: 'rgba(198,165,92,0.08)' }}>
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.15, ease: 'easeOut' }}
            className="text-center relative"
          >
            {i > 0 && <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 gold-gradient-bg opacity-15" />}
            <div className="font-playfair text-4xl md:text-[60px] font-extrabold gold-gradient-text" style={{ filter: 'drop-shadow(0 0 20px rgba(198,165,92,0.2))' }}>
              <Counter target={s.num} suffix={s.suffix} />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.15 }}
              className="font-inter text-[11px] uppercase tracking-[4px] text-white/35 mt-3 font-light"
            >
              {s.label}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Statistics;
