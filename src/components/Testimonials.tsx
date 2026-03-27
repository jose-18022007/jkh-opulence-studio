import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import SectionHeading from './SectionHeading';

const testimonials = [
  { text: "JKH Interior completely transformed our living room. The AI suggestions were spot-on, and the execution by their team was flawless. Our home feels like a luxury hotel now.", name: 'Priya Sharma', loc: 'Chennai, TN' },
  { text: "I was skeptical about AI-designed interiors, but JKH proved me wrong. They redesigned our entire kitchen in a style I never imagined. Absolutely world-class quality and service.", name: 'Rajesh Kumar', loc: 'Bangalore, KA' },
  { text: "From the initial AI-generated concepts to the final handover, everything was seamless. The attention to detail and use of premium materials made all the difference. Highly recommend!", name: 'Anitha Menon', loc: 'Kochi, KL' },
];

const Testimonials = () => (
  <section className="py-20 md:py-36" style={{ background: '#08080F' }}>
    <div className="max-w-[1200px] mx-auto px-6">
      <SectionHeading white="What Our" gold="Clients Say" />
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            whileHover={{ y: -4, borderColor: 'rgba(198,165,92,0.2)' }}
            className="glass-card rounded-3xl p-8 md:p-10 relative transition-all duration-500"
          >
            <span className="font-playfair text-[80px] leading-none absolute top-4 left-6" style={{ color: 'rgba(198,165,92,0.15)' }}>"</span>
            <div className="flex gap-1 mb-4 mt-8">
              {[...Array(5)].map((_, j) => <Star key={j} size={16} className="fill-gold text-gold" />)}
            </div>
            <p className="font-inter text-[15px] text-white/70 italic leading-relaxed">{t.text}</p>
            <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full" style={{ background: 'linear-gradient(135deg, #C6A55C, #E8D5A3)', border: '2px solid rgba(198,165,92,0.4)' }} />
                <div>
                  <p className="font-inter text-base text-white font-semibold">{t.name}</p>
                  <p className="font-inter text-[13px] text-white/40">{t.loc}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
