import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => (
  <motion.div
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ delay: 2.2, duration: 0.8, ease: 'easeInOut' }}
    onAnimationComplete={onComplete}
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
    style={{ background: '#08080F' }}
  >
    {/* Ambient glow */}
    <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.08) 0%, transparent 70%)', filter: 'blur(100px)' }} />

    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="text-center relative z-10"
    >
      <motion.span
        className="font-playfair text-6xl md:text-7xl font-extrabold gold-gradient-text block"
        style={{ filter: 'drop-shadow(0 0 30px rgba(198,165,92,0.3))' }}
      >
        JKH
      </motion.span>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-3"
      >
        <span className="font-inter text-[11px] uppercase tracking-[8px] text-white/40 font-light">Interior</span>
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 1.4, ease: 'easeInOut' }}
        className="h-px mt-8 mx-auto origin-left"
        style={{ width: 120, background: 'linear-gradient(90deg, transparent, #C6A55C, transparent)' }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="font-inter text-[10px] uppercase tracking-[6px] text-white/20 mt-6 font-light"
      >
        Crafting Luxury
      </motion.p>
    </motion.div>
  </motion.div>
);

export default LoadingScreen;
