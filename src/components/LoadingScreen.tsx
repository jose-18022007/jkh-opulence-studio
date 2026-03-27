import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => (
  <motion.div
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{ delay: 1.8, duration: 0.6 }}
    onAnimationComplete={onComplete}
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
    style={{ background: '#08080F' }}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="text-center"
    >
      <span className="font-playfair text-5xl font-bold gold-gradient-text">JKH</span>
      <div className="mt-2">
        <span className="font-inter text-[11px] uppercase tracking-[6px] text-white/50">Interior</span>
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.5, duration: 1.2, ease: 'easeInOut' }}
        className="h-px gold-gradient-bg mt-6 mx-auto"
        style={{ maxWidth: 120 }}
      />
    </motion.div>
  </motion.div>
);

export default LoadingScreen;
