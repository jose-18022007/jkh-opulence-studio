import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Download, Eye, Sparkles, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectionHeading from './SectionHeading';
import { getCreations } from '@/lib/db';

// Import local room assets for showcase
import lrAfter from '@/assets/living-room-after.png';
import kAfter from '@/assets/kitchen-after.png';
import bAfter from '@/assets/bedroom-after.png';
import oAfter from '@/assets/office-after.png';
import heroImg from '@/assets/hero-interior.jpg';

const items = [
  { cat: 'Modern Kitchen', ratio: '3/4', img: kAfter },
  { cat: 'Luxury Bedroom', ratio: '1/1', img: bAfter },
  { cat: 'Living Room', ratio: '4/3', img: lrAfter },
  { cat: 'TV Unit', ratio: '1/1', img: heroImg },
  { cat: 'Ceiling Design', ratio: '3/4', img: lrAfter },
  { cat: 'Wardrobe', ratio: '4/3', img: bAfter },
  { cat: 'Dressing Table', ratio: '4/3', img: bAfter },
  { cat: 'Office', ratio: '1/1', img: oAfter },
  { cat: 'Dining Room', ratio: '3/4', img: kAfter },
];

const cardVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: (i % 3) * 0.15, type: 'spring' as const, stiffness: 100, damping: 15 },
  }),
};

const DesignGallery = () => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'inspiration' | 'creations'>('inspiration');
  const [creations, setCreations] = useState<any[]>([]);
  const [isLoadingCreations, setIsLoadingCreations] = useState(false);
  const [selectedCreation, setSelectedCreation] = useState<any | null>(null);

  const toggleLike = (i: number) => {
    setLiked(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };

  // Fetch designs stored on device from IndexedDB
  const fetchCreations = async () => {
    setIsLoadingCreations(true);
    try {
      const data = await getCreations();
      setCreations(data);
    } catch (error) {
      console.error("Failed to fetch creations from DB:", error);
    } finally {
      setIsLoadingCreations(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'creations') {
      fetchCreations();
    }
  }, [activeTab]);

  const downloadImage = async (url: string, filename: string) => {
    try {
      if (url.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      console.error('Download failed:', error);
      window.open(url, '_blank');
    }
  };

  return (
    <section className="py-20 md:py-36" style={{ background: '#0A0A14' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeading white="Design" gold="Gallery" sub="Browse through design inspirations or review your generated rooms" />
        
        {/* Tab switcher */}
        <div className="flex justify-center gap-4 mt-10 mb-14">
          <button
            onClick={() => setActiveTab('inspiration')}
            className={`px-6 py-2.5 font-inter text-sm cursor-pointer rounded-full transition-all duration-300 border ${
              activeTab === 'inspiration'
                ? 'gold-gradient-bg text-dark-primary font-bold shadow-[0_0_15px_rgba(198,165,92,0.25)] border-transparent'
                : 'bg-white/5 text-white/60 border-white/10 hover:border-white/15 hover:text-white'
            }`}
          >
            Inspiration Showcase
          </button>
          <button
            onClick={() => setActiveTab('creations')}
            className={`px-6 py-2.5 font-inter text-sm cursor-pointer rounded-full transition-all duration-300 border ${
              activeTab === 'creations'
                ? 'gold-gradient-bg text-dark-primary font-bold shadow-[0_0_15px_rgba(198,165,92,0.25)] border-transparent'
                : 'bg-white/5 text-white/60 border-white/10 hover:border-white/15 hover:text-white'
            }`}
          >
            My Creations
          </button>
        </div>

        {/* Tab Panels */}
        {activeTab === 'inspiration' ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
            {items.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={cardVariants}
                className="relative overflow-hidden cursor-pointer group mb-4 break-inside-avoid"
                style={{ aspectRatio: item.ratio, borderRadius: 24 }}
              >
                <img
                  src={item.img}
                  alt={item.cat}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="px-4 py-1.5 text-[11px] font-inter uppercase tracking-[4px] font-light" style={{ border: '1px solid rgba(198,165,92,0.5)', color: 'rgba(198,165,92,0.8)', borderRadius: 9999 }}>{item.cat}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLike(i); }}
                  className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Heart size={20} className={liked.has(i) ? 'fill-gold text-gold' : 'text-gold'} />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Creations Tab */
          <div>
            {isLoadingCreations ? (
              <div className="py-24 flex flex-col items-center justify-center gap-4 text-white/40">
                <Loader2 size={36} className="animate-spin text-gold" />
                <span className="font-inter text-sm uppercase tracking-[2px]">Loading creations...</span>
              </div>
            ) : creations.length === 0 ? (
              <div className="py-20 text-center glass-card-gold p-8 max-w-lg mx-auto" style={{ borderRadius: 24 }}>
                <Sparkles size={36} className="mx-auto text-gold mb-4 opacity-50" />
                <h4 className="font-playfair text-lg font-bold text-white mb-2">No designs found</h4>
                <p className="font-inter text-xs text-white/40 mb-6 leading-relaxed">
                  You haven't generated any AI interior designs yet, or your temporary session files have been cleared.
                </p>
                <a
                  href="#generate"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('generate')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-gold-pill px-6 py-2.5 font-inter text-xs inline-block cursor-pointer"
                >
                  Design Room Now
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {creations.slice(0, 3).map((creation, i) => (
                    <motion.div
                      key={creation.id || i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="relative overflow-hidden glass-card-gold group flex flex-col cursor-pointer"
                      style={{ borderRadius: 20 }}
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-black/30 relative">
                        <img
                          src={creation.url}
                          alt="My dynamic creation"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Hover controls */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10">
                          <button
                            onClick={() => setSelectedCreation(creation)}
                            className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center text-dark-primary hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); downloadImage(creation.url, `my-jkh-design-${creation.id}.png`); }}
                            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Details footer */}
                      <div className="p-4 flex items-center justify-between border-t border-white/5 bg-white/[0.01]">
                        <div>
                          <span className="text-[9px] font-inter uppercase tracking-[2px] text-white/30 block mb-1">
                            {creation.room_type} ({creation.style})
                          </span>
                          <span className="text-xs font-inter font-medium text-white/70">
                            {new Date(creation.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-[10px] text-gold font-medium px-2 py-0.5 rounded bg-gold/10 border border-gold/25 flex items-center gap-0.5">
                          <Sparkles size={8} /> AI
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center mt-4">
                  <button
                    onClick={() => navigate('/my-designs')}
                    className="btn-gold-pill px-10 py-3.5 font-inter text-xs"
                  >
                    View All & Share Creations ({creations.length}) →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button for inspiration gallery */}
        {activeTab === 'inspiration' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(198,165,92,0.1)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('generate')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-outline-gold px-12 py-4 font-inter text-[15px] font-semibold text-gold cursor-pointer"
            >
              Create Custom Design →
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Creation Preview Lightbox */}
      <AnimatePresence>
        {selectedCreation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setSelectedCreation(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-[800px] glass-card-gold overflow-hidden z-10 flex flex-col"
              style={{ borderRadius: 24 }}
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="font-playfair text-lg font-bold gold-gradient-text">Design Details</h4>
                  <span className="font-inter text-[10px] uppercase text-white/40 tracking-[2px]">{selectedCreation.room_type} — {selectedCreation.style} style</span>
                </div>
                <button
                  onClick={() => setSelectedCreation(null)}
                  className="w-8 h-8 bg-white/5 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-4 md:p-6 overflow-hidden">
                <img
                  src={selectedCreation.url}
                  alt="Full preview"
                  className="w-full h-auto max-h-[60vh] object-contain rounded-lg border border-white/5"
                />
              </div>
              <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between gap-4">
                <span className="font-inter text-[10px] text-white/30">
                  Created on {new Date(selectedCreation.created_at).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadImage(selectedCreation.url, `my-jkh-design-${selectedCreation.id}.png`)}
                    className="btn-gold-pill px-6 py-2.5 font-inter text-xs flex items-center gap-1.5"
                  >
                    <Download size={14} /> Download
                  </button>
                  <button
                    onClick={() => setSelectedCreation(null)}
                    className="btn-outline-gold px-4 py-2.5 font-inter text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default DesignGallery;
