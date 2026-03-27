import { motion } from 'framer-motion';
import { Upload, Sparkles, Heart } from 'lucide-react';
import SectionHeading from './SectionHeading';

const steps = [
  { num: '01', icon: Upload, title: 'Upload Your Photo', desc: 'Snap a photo of any room or upload from your gallery. Our AI accepts any angle, any lighting, any room.' },
  { num: '02', icon: Sparkles, title: 'AI Designs Your Space', desc: 'Our advanced AI analyzes your room dimensions, structure, and lighting to generate 10+ unique, stunning interior designs.' },
  { num: '03', icon: Heart, title: 'Choose & Build', desc: 'Pick your favorite designs, connect with our expert team, and watch your dream interior come to life.' },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 md:py-36" style={{ background: '#08080F' }}>
    <div className="max-w-[1200px] mx-auto px-6">
      <SectionHeading white="How It" gold="Works" sub="Three simple steps to transform your space" />
      <div className="mt-16 md:mt-20 grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            whileHover={{ y: -8, borderColor: 'rgba(198,165,92,0.3)', boxShadow: '0 0 40px rgba(198,165,92,0.08)' }}
            className="glass-card rounded-3xl p-10 md:p-12 relative overflow-hidden cursor-pointer transition-all duration-500"
          >
            <span className="absolute -top-2 -right-2 font-playfair text-[120px] font-bold leading-none select-none" style={{ color: 'rgba(198,165,92,0.06)' }}>{s.num}</span>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ border: '2px solid rgba(198,165,92,0.4)' }}>
              <s.icon size={28} className="text-gold" />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-white mb-3">{s.title}</h3>
            <p className="font-inter text-[15px] text-white/50 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
