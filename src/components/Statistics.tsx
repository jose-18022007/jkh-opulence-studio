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
      const p = Math.min((Date.now() - start) / dur, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <span ref={ref}>{val}{suffix}</span>;
};

const Statistics = () => (
  <section className="py-20 md:py-24 border-t border-b" style={{ background: 'linear-gradient(135deg, rgba(198,165,92,0.04), transparent, rgba(198,165,92,0.04))', borderColor: 'rgba(198,165,92,0.08)' }}>
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.15 }}
            className="text-center relative"
          >
            {i > 0 && <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 gold-gradient-bg opacity-15" />}
            <div className="font-playfair text-4xl md:text-[56px] font-bold gold-gradient-text">
              <Counter target={s.num} suffix={s.suffix} />
            </div>
            <p className="font-inter text-[13px] uppercase tracking-[3px] text-white/40 mt-2">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Statistics;
