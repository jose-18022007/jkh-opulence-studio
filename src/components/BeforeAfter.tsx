import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

// Import local room assets
import lrBefore from '@/assets/living-room-before.png';
import lrAfter from '@/assets/living-room-after.png';
import kBefore from '@/assets/kitchen-before.png';
import kAfter from '@/assets/kitchen-after.png';
import bBefore from '@/assets/bedroom-before.png';
import bAfter from '@/assets/bedroom-after.png';
import oBefore from '@/assets/office-before.png';
import oAfter from '@/assets/office-after.png';

const thumbnails = ['Living Room', 'Kitchen', 'Bedroom', 'Office'];

const categoryImages: Record<string, { before: string; after: string }> = {
  'Living Room': { before: lrBefore, after: lrAfter },
  'Kitchen': { before: kBefore, after: kAfter },
  'Bedroom': { before: bBefore, after: bAfter },
  'Office': { before: oBefore, after: oAfter },
};

const BeforeAfter = () => {
  const [activeCategory, setActiveCategory] = useState('Living Room');
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
            {/* Before (Background) */}
            <div className="absolute inset-0 bg-black/40">
              <img 
                src={categoryImages[activeCategory].before} 
                alt="Original room before AI design" 
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>
            <div className="absolute top-4 left-4 z-10 px-3 py-1 text-[12px] font-inter uppercase tracking-[3px] text-white/85" style={{ background: 'rgba(0,0,0,0.6)', borderRadius: 9999, backdropFilter: 'blur(4px)' }}>Before</div>
            
            {/* After (Foreground curtain) */}
            <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
              <img 
                src={categoryImages[activeCategory].after} 
                alt="AI redesigned interior" 
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>
            <div className="absolute top-4 right-4 z-10 px-3 py-1 text-[12px] font-inter uppercase tracking-[3px] font-semibold" style={{ background: 'linear-gradient(135deg, #C6A55C, #FCF6BA, #B8941F)', color: '#08080F', borderRadius: 9999 }}>After</div>
            
            {/* Slider Divider bar */}
            <div className="absolute top-0 bottom-0 z-20" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
              <div className="w-0.5 h-full gold-gradient-bg" />
              <div
                onMouseDown={onMouseDown}
                onTouchStart={() => { dragging.current = true; }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full gold-gradient-bg flex items-center justify-center cursor-grab active:cursor-grabbing"
                style={{ boxShadow: '0 0 20px rgba(198,165,92,0.4)' }}
              >
                <ArrowLeftRight size={20} className="text-dark-primary" />
              </div>
            </div>
          </div>

          {/* Category Thumbnails Swapping Controls */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            {thumbnails.map(t => (
              <motion.div
                key={t}
                whileHover={{ y: -4 }}
                onClick={() => {
                  setActiveCategory(t);
                  setPos(50); // Reset position on swap
                }}
                className="flex flex-col items-center gap-2.5 cursor-pointer group"
              >
                <div 
                  className="flex gap-1 p-1 rounded-2xl transition-all duration-300" 
                  style={{ 
                    border: activeCategory === t ? '2px solid #C6A55C' : '2px solid rgba(255,255,255,0.05)', 
                    background: 'rgba(255,255,255,0.02)',
                    boxShadow: activeCategory === t ? '0 0 15px rgba(198,165,92,0.15)' : 'none'
                  }}
                >
                  <img 
                    src={categoryImages[t].before} 
                    alt="Before thumbnail"
                    className="w-[55px] h-[38px] md:w-[90px] md:h-[60px] object-cover rounded-lg transition-opacity" 
                    style={{ opacity: activeCategory === t ? 1 : 0.4 }} 
                  />
                  <div className="w-px bg-white/10" />
                  <img 
                    src={categoryImages[t].after} 
                    alt="After thumbnail"
                    className="w-[55px] h-[38px] md:w-[90px] md:h-[60px] object-cover rounded-lg transition-opacity" 
                    style={{ opacity: activeCategory === t ? 1 : 0.4 }} 
                  />
                </div>
                <span className={`font-inter text-[12px] tracking-[1px] uppercase transition-colors ${activeCategory === t ? 'text-gold font-semibold' : 'text-white/40 group-hover:text-white/70'}`}>{t}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BeforeAfter;
