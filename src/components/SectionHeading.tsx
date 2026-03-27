import { motion } from 'framer-motion';

interface Props {
  white: string;
  gold: string;
  sub?: string;
  emoji?: string;
}

const SectionHeading = ({ white, gold, sub, emoji }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="text-center"
  >
    <h2 className="font-playfair text-3xl md:text-[52px] font-bold leading-tight">
      {white} <span className="gold-gradient-text">{gold}</span>{emoji ? ` ${emoji}` : ''}
    </h2>
    {sub && <p className="font-inter text-base md:text-[17px] text-white/40 mt-4 max-w-xl mx-auto">{sub}</p>}
  </motion.div>
);

export default SectionHeading;
