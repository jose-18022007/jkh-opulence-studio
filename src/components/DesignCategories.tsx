import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const categories = [
  { name: 'TV Unit', gradient: 'linear-gradient(135deg, #1a1a2e, #16213E)' },
  { name: 'Modern Kitchen', gradient: 'linear-gradient(135deg, #1e1e30, #2a1f3d)' },
  { name: 'Wardrobe', gradient: 'linear-gradient(135deg, #1a1a2e, #1f2937)' },
  { name: 'Ceiling Design', gradient: 'linear-gradient(135deg, #1e1b2e, #2d2040)' },
  { name: 'Living Room', gradient: 'linear-gradient(135deg, #1a1a2e, #16213E)' },
  { name: 'Bedroom', gradient: 'linear-gradient(135deg, #2a1f3d, #1a1a2e)' },
  { name: 'Dressing Table', gradient: 'linear-gradient(135deg, #1f2937, #1a1a2e)' },
  { name: 'Loft Storage', gradient: 'linear-gradient(135deg, #1e1b2e, #16213E)' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.08, ease: 'easeOut' as const },
  }),
};

const DesignCategories = () => (
  <section id="designs" className="py-20 md:py-36" style={{ background: '#0A0A14' }}>
    <div className="max-w-[1400px] mx-auto px-6">
      <SectionHeading white="Explore Our" gold="Design Categories" sub="From living rooms to kitchens, we design every corner of your dream home" />
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            variants={cardVariants}
            whileHover={{ scale: 1.03, boxShadow: '0 20px 60px rgba(198,165,92,0.1)' }}
            className="relative rounded-3xl overflow-hidden cursor-pointer group"
            style={{ aspectRatio: '4/5' }}
          >
            <div className="absolute inset-0 transition-transform duration-[600ms] group-hover:scale-110" style={{ background: cat.gradient }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,15,0.9) 0%, transparent 60%)' }} />
            <div className="absolute top-4 right-4 w-8 h-8 opacity-20">
              <div className="absolute top-0 right-0 w-full h-px gold-gradient-bg" />
              <div className="absolute top-0 right-0 h-full w-px gold-gradient-bg" />
            </div>
            <div className="absolute bottom-0 left-0 p-7">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                className="font-playfair text-xl font-bold text-white"
              >
                {cat.name}
              </motion.h3>
              <span className="text-[13px] mt-1 inline-block" style={{ color: 'rgba(198,165,92,0.7)' }}>Explore →</span>
            </div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/40 rounded-3xl transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DesignCategories;
