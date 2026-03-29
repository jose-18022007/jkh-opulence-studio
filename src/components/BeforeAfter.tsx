import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

const thumbnails = ['Living Room', 'Kitchen', 'Bedroom', 'Office'];

const BeforeAfter = () => {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  };

  const onMouseDown = () => { dragging.current = true; };
  const onMouseUp = () => { dragging.current = false; };
  const onMouseMove = (e: React.MouseEvent) => { if (dragging.current) updatePos(e.clientX); };
  const onTouchMove = (e: React.TouchEvent) => { updatePos(e.touches[0].clientX); };

  return (
    <section className="py-20 md:py-36" style={{ background: '#08080F' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeading white="See The" gold="AI Magic" emoji="✨" sub="Watch ordinary rooms transform into extraordinary spaces" />
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 15 }}
          className="mt-16 max-w-[900px] mx-auto"
        >
          <div
            ref={containerRef}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchMove={onTouchMove}
            className="relative overflow-hidden select-none cursor-ew-resize"
            style={{ aspectRatio: '16/10', border: '2px solid rgba(198,165,92,0.2)', boxShadow: '0 0 60px rgba(198,165,92,0.08)', borderRadius: 32 }}
          >
            {/* Before */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #2a2a3a, #1a1a2a, #252535)' }} />
            <div className="absolute top-4 left-4 z-10 px-3 py-1 text-[12px] font-inter uppercase tracking-[3px] text-white/80" style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 9999 }}>Before</div>
            {/* After */}
            <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)`, background: 'linear-gradient(135deg, #1a1a2e, #2a1f3d, #C6A55C22)' }} />
            <div className="absolute top-4 right-4 z-10 px-3 py-1 text-[12px] font-inter uppercase tracking-[3px]" style={{ background: 'linear-gradient(135deg, #C6A55C, #FCF6BA, #B8941F)', color: '#08080F', borderRadius: 9999 }}>After</div>
            {/* Slider */}
            <div className="absolute top-0 bottom-0 z-20" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
              <div className="w-0.5 h-full gold-gradient-bg" />
              <div
                onMouseDown={onMouseDown}
                onTouchStart={() => {}}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full gold-gradient-bg flex items-center justify-center cursor-grab active:cursor-grabbing"
                style={{ boxShadow: '0 0 20px rgba(198,165,92,0.4)' }}
              >
                <ArrowLeftRight size={20} className="text-dark-primary" />
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mt-6 flex gap-4 justify-center">
            {thumbnails.map(t => (
              <motion.div
                key={t}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className="flex gap-0.5">
                  <div className="w-[60px] h-[40px] md:w-[120px] md:h-[80px]" style={{ background: 'linear-gradient(135deg, #2a2a3a, #1a1a2a)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }} />
                  <div className="w-px gold-gradient-bg opacity-40" />
                  <div className="w-[60px] h-[40px] md:w-[120px] md:h-[80px]" style={{ background: 'linear-gradient(135deg, #1a1a2e, #C6A55C11)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }} />
                </div>
                <span className="font-inter text-[12px] text-white/40 group-hover:text-white/70 transition-colors">{t}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BeforeAfter;
