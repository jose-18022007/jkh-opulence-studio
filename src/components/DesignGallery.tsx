import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import SectionHeading from './SectionHeading';

const items = [
  { cat: 'Modern Kitchen', ratio: '3/4', gradient: 'linear-gradient(135deg, #1e1b2e, #2d2040, #1a1a2e)' },
  { cat: 'Luxury Bedroom', ratio: '1/1', gradient: 'linear-gradient(135deg, #1a1a2e, #16213E, #1e1b2e)' },
  { cat: 'Living Room', ratio: '4/3', gradient: 'linear-gradient(135deg, #2a1f3d, #1a1a2e, #16213E)' },
  { cat: 'TV Unit', ratio: '1/1', gradient: 'linear-gradient(135deg, #16213E, #1a1a2e, #2a1f3d)' },
  { cat: 'Ceiling Design', ratio: '3/4', gradient: 'linear-gradient(135deg, #1e1b2e, #1a1a2e, #2d2040)' },
  { cat: 'Wardrobe', ratio: '4/3', gradient: 'linear-gradient(135deg, #1a1a2e, #2a1f3d, #1e1b2e)' },
  { cat: 'Dressing Table', ratio: '4/3', gradient: 'linear-gradient(135deg, #2d2040, #1a1a2e, #16213E)' },
  { cat: 'Office', ratio: '1/1', gradient: 'linear-gradient(135deg, #1a1a2e, #1e1b2e, #16213E)' },
  { cat: 'Dining Room', ratio: '3/4', gradient: 'linear-gradient(135deg, #16213E, #2a1f3d, #1a1a2e)' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: (i % 3) * 0.15, type: 'spring' as const, stiffness: 100, damping: 15 },
  }),
};

const DesignGallery = () => {
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const toggleLike = (i: number) => {
    setLiked(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };

  return (
    <section className="py-20 md:py-36" style={{ background: '#0A0A14' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeading white="Design" gold="Inspiration Gallery" sub="Browse through our AI-generated interior masterpieces" />
        <div className="mt-16 columns-1 md:columns-2 lg:columns-3 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              variants={cardVariants}
              className="relative overflow-hidden cursor-pointer group mb-4 break-inside-avoid"
              style={{ aspectRatio: item.ratio, borderRadius: 24 }}
            >
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.08]" style={{ background: item.gradient }} />
              <div className="absolute inset-0 bg-[rgba(8,8,15,0.7)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="px-4 py-1.5 text-[11px] font-inter uppercase tracking-[4px] font-light" style={{ border: '1px solid rgba(198,165,92,0.5)', color: 'rgba(198,165,92,0.8)', borderRadius: 9999 }}>{item.cat}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); toggleLike(i); }}
                className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Heart size={20} className={liked.has(i) ? 'fill-gold text-gold' : 'text-gold'} />
              </button>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(198,165,92,0.1)' }}
            whileTap={{ scale: 0.97 }}
            className="btn-outline-gold px-12 py-4 font-inter text-[15px] font-semibold text-gold"
          >
            View All Designs →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default DesignGallery;
