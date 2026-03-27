import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Play, Zap, Heart, Star } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import heroImg from '@/assets/hero-interior.jpg';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.2 } } };
const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } } };
const fadeRight = { hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.3, ease: 'easeOut' as const } } };

const trust = [
  { icon: Sparkles, num: '1000+', label: 'Designs Created' },
  { icon: Heart, num: '500+', label: 'Happy Homes' },
  { icon: Zap, num: '24/7', label: 'AI Available' },
];

const headingWords = ['Transform', 'Your', 'Space', 'Into', 'a'];

const TypewriterHeading = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showGold, setShowGold] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= headingWords.length) {
          clearInterval(timer);
          setTimeout(() => setShowGold(true), 200);
          return prev;
        }
        return prev + 1;
      });
    }, 150);
    return () => clearInterval(timer);
  }, []);

  return (
    <h1 className="font-playfair text-[40px] md:text-[72px] lg:text-[76px] font-extrabold leading-[1.1]">
      {headingWords.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={i < visibleCount ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
      <br className="hidden md:block" />
      <motion.span
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(12px)' }}
        animate={showGold ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="gold-shimmer-text shimmer-active inline-block"
        style={{ textShadow: '0 0 80px rgba(198,165,92,0.3)' }}
      >
        Masterpiece
      </motion.span>
    </h1>
  );
};

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #08080F 0%, #0F0F1A 100%)' }}>
      {/* Parallax background orbs */}
      <motion.div style={{ y: orbY1 }} className="absolute top-20 right-[20%] w-[500px] h-[500px] rounded-full animate-float pointer-events-none" />
      <div className="absolute top-20 right-[20%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.08) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      <motion.div style={{ y: orbY2 }} className="absolute bottom-20 left-[10%] w-[400px] h-[400px] rounded-full animate-float pointer-events-none" />
      <div className="absolute bottom-20 left-[10%] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.05) 0%, transparent 70%)', filter: 'blur(100px)', animationDelay: '2.5s' }} />

      <div className="max-w-[1400px] mx-auto px-6 w-full pt-24 pb-16 md:pt-0 md:pb-0">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={fadeUp}>
              <TypewriterHeading />
            </motion.div>
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
              {trust.map((t, i) => (
                <motion.div
                  key={t.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.15, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <t.icon size={18} className="text-gold" />
                  <div>
                    <span className="font-inter text-lg text-white font-bold">{t.num}</span>
                    <span className="block font-inter text-[13px] text-white/40">{t.label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right */}
          <motion.div variants={fadeRight} initial="hidden" animate="show" className="relative flex justify-center">
            <div className="absolute inset-[-20px] md:inset-[-40px] rounded-full border border-gold/10 animate-rotate-slow pointer-events-none" />
            <div className="absolute inset-[-50px] md:inset-[-80px] rounded-full border border-gold/5 animate-rotate-slow pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '45s' }} />
            <div className="absolute -top-8 -right-8 w-[200px] h-[200px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute -bottom-8 -left-8 w-[150px] h-[150px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="relative rounded-3xl overflow-hidden w-full max-w-[480px]"
              style={{ aspectRatio: '4/5', border: '2px solid rgba(198,165,92,0.2)' }}
            >
              <img src={heroImg} alt="Luxury interior design" className="w-full h-full object-cover" width={1024} height={1280} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,15,0.4) 0%, transparent 40%)' }} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
