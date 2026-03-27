import { motion } from 'framer-motion';
import { Sparkles, Play, Zap, Heart, Star } from 'lucide-react';
import heroImg from '@/assets/hero-interior.jpg';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.2 } } };
const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } };
const fadeRight = { hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.3, ease: 'easeOut' } } };

const trust = [
  { icon: Sparkles, num: '1000+', label: 'Designs Created' },
  { icon: Heart, num: '500+', label: 'Happy Homes' },
  { icon: Zap, num: '24/7', label: 'AI Available' },
];

const HeroSection = () => (
  <section id="home" className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #08080F 0%, #0F0F1A 100%)' }}>
    {/* Background orbs */}
    <div className="absolute top-20 right-[20%] w-[500px] h-[500px] rounded-full animate-float pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.08) 0%, transparent 70%)', filter: 'blur(100px)' }} />
    <div className="absolute bottom-20 left-[10%] w-[400px] h-[400px] rounded-full animate-float pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.05) 0%, transparent 70%)', filter: 'blur(100px)', animationDelay: '2.5s' }} />

    <div className="max-w-[1400px] mx-auto px-6 w-full pt-24 pb-16 md:pt-0 md:pb-0">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.h1 variants={fadeUp} className="font-playfair text-[40px] md:text-[72px] lg:text-[76px] font-extrabold leading-[1.1]">
            Transform Your Space Into a{' '}
            <span className="gold-gradient-text" style={{ textShadow: '0 0 80px rgba(198,165,92,0.3)' }}>Masterpiece</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="font-inter text-base md:text-xl text-white/55 leading-relaxed mt-6 max-w-lg">
            Upload your room photo and watch our AI create 10+ breathtaking interior design variations in seconds. No designer needed.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-8 md:mt-10">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(198,165,92,0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="btn-gold-pill px-8 md:px-10 py-4 md:py-[18px] text-base md:text-lg font-inter flex items-center gap-2"
              style={{ boxShadow: '0 0 30px rgba(198,165,92,0.3)' }}
            >
              <Star size={18} /> Generate Your Design
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="btn-outline-gold px-8 md:px-10 py-4 md:py-[18px] text-base md:text-lg font-inter flex items-center gap-2"
            >
              <Play size={18} /> Watch How It Works
            </motion.button>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-8 md:gap-10 mt-10 md:mt-12">
            {trust.map(t => (
              <div key={t.label} className="flex items-center gap-3">
                <t.icon size={18} className="text-gold" />
                <div>
                  <span className="font-inter text-lg text-white font-bold">{t.num}</span>
                  <span className="block font-inter text-[13px] text-white/40">{t.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right */}
        <motion.div variants={fadeRight} initial="hidden" animate="show" className="relative flex justify-center">
          {/* Rotating ring */}
          <div className="absolute inset-[-20px] md:inset-[-40px] rounded-full border border-gold/10 animate-rotate-slow pointer-events-none" />
          <div className="absolute inset-[-50px] md:inset-[-80px] rounded-full border border-gold/5 animate-rotate-slow pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '45s' }} />
          {/* Glow orbs */}
          <div className="absolute -top-8 -right-8 w-[200px] h-[200px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute -bottom-8 -left-8 w-[150px] h-[150px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }} />
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden w-full max-w-[480px]" style={{ aspectRatio: '4/5', border: '2px solid rgba(198,165,92,0.2)' }}>
            <img src={heroImg} alt="Luxury interior design" className="w-full h-full object-cover" width={1024} height={1280} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,15,0.4) 0%, transparent 40%)' }} />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
