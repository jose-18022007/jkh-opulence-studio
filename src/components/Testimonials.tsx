import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, ClipboardCheck } from 'lucide-react';
import SectionHeading from './SectionHeading';

const promises = [
  { 
    icon: Cpu, 
    title: "Precision AI Engine", 
    text: "Our models analyze structural boundaries, light angles, and door openings, ensuring all generated designs are structurally realistic and constructible." 
  },
  { 
    icon: ShieldCheck, 
    title: "Artisan Partnership", 
    text: "We bridge the gap between concept and reality by partnering with certified modular manufacturers and local carpenters to execute designs." 
  },
  { 
    icon: ClipboardCheck, 
    title: "Documented Curation", 
    text: "No abstract mockups. Each rendering translates to specific material grades, paints, finishes, and smart lighting designs that can be sourced locally." 
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.2, type: 'spring' as const, stiffness: 100, damping: 15 },
  }),
};

const Testimonials = () => (
  <section className="py-20 md:py-36 relative overflow-hidden" style={{ background: '#08080F' }}>
    <div className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] rounded-full animate-orb-pulse pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.04) 0%, transparent 70%)', filter: 'blur(110px)', animationDelay: '2s' }} />
    <div className="absolute bottom-[20%] left-[-5%] w-[350px] h-[350px] rounded-full animate-orb-pulse pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(252,246,186,0.03) 0%, transparent 70%)', filter: 'blur(100px)', animationDelay: '4s' }} />
    <div className="max-w-[1200px] mx-auto px-6 relative z-10">
      <SectionHeading white="Our Design" gold="Guarantees" sub="Crafting premium interiors with structural honesty and execution clarity" />
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {promises.map((p, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={cardVariants}
            whileHover={{ y: -6, borderColor: 'rgba(198,165,92,0.25)', boxShadow: '0 10px 30px rgba(198,165,92,0.05)' }}
            className="glass-card p-8 md:p-10 relative transition-all duration-500 border border-white/5 flex flex-col"
            style={{ borderRadius: 32 }}
          >
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
              style={{ border: '2px solid rgba(198,165,92,0.35)', background: 'rgba(198,165,92,0.03)' }}
            >
              <p.icon size={24} className="text-gold" />
            </div>
            
            <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-4 tracking-[-0.02em]">{p.title}</h3>
            <p className="font-inter text-[14px] text-white/55 leading-[1.8] font-light flex-1">{p.text}</p>
            
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="font-inter text-[11px] text-gold uppercase tracking-[2px] font-medium">JKH Guarantee ✓</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
