import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Loader2 } from 'lucide-react';

interface GenerationLoaderProps {
  imagePreview: string | null;
  roomType: string;
  styleName: string;
}

const stages = [
  { id: 'analyze', label: 'Analyzing room structure' },
  { id: 'layout', label: 'Detecting architectural layout' },
  { id: 'style', label: 'Applying designated design style' },
  { id: 'render', label: 'Rendering final high-res design' },
];

export const GenerationLoader = ({ imagePreview, roomType, styleName }: GenerationLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  useEffect(() => {
    // We expect the generation to take around 12-15 seconds.
    // Let's increment progress and switch stages smoothly.
    const duration = 14000; // 14 seconds
    const intervalTime = 100;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + increment, 99); // Max 99% until completed
        
        // Update active stage based on progress threshold
        if (next < 25) {
          setActiveStageIdx(0);
        } else if (next < 50) {
          setActiveStageIdx(1);
        } else if (next < 75) {
          setActiveStageIdx(2);
        } else {
          setActiveStageIdx(3);
        }
        
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full glass-card-gold p-8 md:p-12 relative overflow-hidden" style={{ borderRadius: 32 }}>
      {/* Background ambient light */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left Side: Room image with scanner animation */}
        <div className="flex flex-col items-center justify-center">
          <div 
            className="w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-gold/20 relative shadow-[0_0_40px_rgba(198,165,92,0.15)]"
          >
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Room scanner" 
                className="w-full h-full object-cover opacity-60 filter saturate-50"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20">
                Scanning empty space...
              </div>
            )}
            
            {/* Holographic Laser Grid Scanner Effect */}
            <motion.div 
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
              className="absolute left-0 right-0 h-1 gold-gradient-bg z-20 shadow-[0_0_15px_#C6A55C,0_0_30px_#C6A55C]"
            />
            
            {/* Shimmer layout lines overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(198,165,92,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(198,165,92,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            
            {/* Badge overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between px-3 py-2 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg">
              <span className="font-inter text-[10px] uppercase text-white/60 tracking-[2px]">{roomType}</span>
              <span className="font-inter text-[10px] text-gold font-medium flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" /> SCANNING...
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Generation Stages */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="font-playfair text-2xl font-bold text-white flex items-center gap-2">
              Transforming <span className="gold-gradient-text">{roomType}</span>
            </h3>
            <p className="font-inter text-[13px] text-white/40 mt-1 uppercase tracking-[2px]">
              Theme: {styleName} style
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className="h-full gold-gradient-bg shadow-[0_0_10px_#C6A55C]"
              style={{ width: `${progress}%` }}
              layoutId="progressBar"
            />
          </div>

          {/* Stepper Checklist */}
          <div className="space-y-4">
            {stages.map((stage, idx) => {
              const isCompleted = idx < activeStageIdx;
              const isActive = idx === activeStageIdx;
              
              return (
                <div 
                  key={stage.id} 
                  className={`flex items-center gap-4 transition-all duration-300 ${
                    isActive ? 'scale-[1.02]' : ''
                  }`}
                >
                  {/* Status Icon Indicator */}
                  <div className="relative shrink-0">
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <motion.div
                          key="complete"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="w-6 h-6 rounded-full bg-gold flex items-center justify-center text-dark-primary shadow-[0_0_10px_rgba(198,165,92,0.4)]"
                        >
                          <Check size={14} className="stroke-[3]" />
                        </motion.div>
                      ) : isActive ? (
                        <motion.div
                          key="active"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="w-6 h-6 rounded-full border border-gold bg-gold/10 flex items-center justify-center text-gold shadow-[0_0_10px_rgba(198,165,92,0.2)]"
                        >
                          <Loader2 size={12} className="animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="idle"
                          className="w-6 h-6 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/20"
                        >
                          <span className="text-[10px] font-inter font-bold">{idx + 1}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Stage Label Text */}
                  <span 
                    className={`font-inter text-sm transition-colors duration-300 ${
                      isActive 
                        ? 'text-white font-medium' 
                        : isCompleted 
                          ? 'text-white/60 line-through decoration-gold/30' 
                          : 'text-white/30 font-light'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-white/30 text-[11px] font-inter uppercase tracking-[1.5px]">
            <Sparkles size={12} className="text-gold" /> Creating high fidelity layout render
          </div>
        </div>

      </div>
    </div>
  );
};
export default GenerationLoader;
