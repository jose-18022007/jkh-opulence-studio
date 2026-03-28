import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles } from 'lucide-react';

const roomTypes = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining', 'Office', 'Kids Room', 'Pooja Room'];
const styles = ['Modern', 'Minimalist', 'Traditional', 'Luxury', 'Contemporary', 'Scandinavian', 'Industrial'];
const counts = ['5', '10', '15'];

const Pill = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`px-5 py-2.5 rounded-full font-inter text-sm cursor-pointer transition-all duration-300 ${
      selected
        ? 'gold-gradient-bg text-dark-primary font-semibold shadow-[0_0_20px_rgba(198,165,92,0.3)]'
        : 'bg-white/5 text-white/70 border border-white/10 hover:border-white/20'
    }`}
  >
    {label}
  </motion.button>
);

const AIGenerator = () => {
  const [room, setRoom] = useState('Living Room');
  const [style, setStyle] = useState('Modern');
  const [count, setCount] = useState('10');
  const [dragOver, setDragOver] = useState(false);

  return (
    <section id="generate" className="py-20 md:py-36 relative overflow-hidden" style={{ background: '#08080F' }}>
      {/* Gradient mesh */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 600px 400px at 20% 30%, rgba(198,165,92,0.06) 0%, transparent 70%),
          radial-gradient(ellipse 500px 500px at 80% 70%, rgba(217,169,56,0.05) 0%, transparent 70%),
          radial-gradient(ellipse 400px 300px at 50% 50%, rgba(198,165,92,0.04) 0%, transparent 70%),
          radial-gradient(ellipse 300px 400px at 70% 20%, rgba(184,148,31,0.04) 0%, transparent 70%),
          radial-gradient(ellipse 350px 350px at 30% 80%, rgba(232,213,163,0.03) 0%, transparent 70%)
        `
      }} />
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full animate-float opacity-100 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.06) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full animate-float pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,169,56,0.05) 0%, transparent 70%)', filter: 'blur(100px)', animationDelay: '2s' }} />
      <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] rounded-full animate-float pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(232,213,163,0.04) 0%, transparent 70%)', filter: 'blur(90px)', animationDelay: '3.5s' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-inter text-[11px] uppercase tracking-[4px] text-gold font-light" style={{ border: '1px solid rgba(198,165,92,0.3)', background: 'rgba(198,165,92,0.05)' }}>
            <Sparkles size={14} /> Powered by AI
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-playfair text-[34px] md:text-[56px] font-extrabold" style={{ textShadow: '0 0 60px rgba(198,165,92,0.2)' }}>
            Create Your <span className="gold-gradient-text" style={{ filter: 'drop-shadow(0 0 20px rgba(198,165,92,0.2))' }}>Dream Interior</span>
          </h2>
          <p className="font-inter text-sm md:text-[15px] font-light text-white/40 mt-4 max-w-xl mx-auto uppercase tracking-[3px]">Upload any room photo and watch AI generate stunning designs instantly</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 max-w-[800px] mx-auto glass-card-gold rounded-[28px] p-8 md:p-12"
        >
          {/* Upload zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); }}
            className="rounded-[20px] py-14 px-6 text-center transition-all duration-300"
            style={{
              border: dragOver ? '2px solid #C6A55C' : '2px dashed rgba(198,165,92,0.3)',
              background: dragOver ? 'rgba(198,165,92,0.05)' : 'rgba(198,165,92,0.02)',
            }}
          >
            <Upload size={48} className="mx-auto text-gold mb-4" />
            <p className="font-inter text-lg text-white font-semibold">Drop your room photo here</p>
            <p className="font-inter text-sm text-white/30 my-3">or</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="btn-gold-pill px-8 py-2.5 font-inter text-sm">Browse Files</motion.button>
            <p className="font-inter text-[13px] text-white/30 mt-4">Supports JPG, PNG up to 10MB</p>
          </div>

          {/* Options */}
          <div className="mt-8 space-y-6">
            <div>
              <label className="font-inter text-[13px] uppercase tracking-[2px] text-white/40 mb-3 block">Select Room Type</label>
              <div className="flex flex-wrap gap-2">{roomTypes.map(r => <Pill key={r} label={r} selected={room === r} onClick={() => setRoom(r)} />)}</div>
            </div>
            <div>
              <label className="font-inter text-[13px] uppercase tracking-[2px] text-white/40 mb-3 block">Design Style</label>
              <div className="flex flex-wrap gap-2">{styles.map(s => <Pill key={s} label={s} selected={style === s} onClick={() => setStyle(s)} />)}</div>
            </div>
            <div>
              <label className="font-inter text-[13px] uppercase tracking-[2px] text-white/40 mb-3 block">Number of Designs</label>
              <div className="flex flex-wrap gap-2">{counts.map(c => <Pill key={c} label={c} selected={count === c} onClick={() => setCount(c)} />)}</div>
            </div>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-10 gold-gradient-bg text-dark-primary font-playfair text-xl font-bold py-5 rounded-2xl cursor-pointer animate-pulse-gold"
          >
            ✨ Generate Designs
          </motion.button>
          <p className="text-center font-inter text-[13px] text-white/35 mt-4">🔒 Free to use • No signup required • Results in 30 seconds</p>
        </motion.div>
      </div>
    </section>
  );
};

export default AIGenerator;
