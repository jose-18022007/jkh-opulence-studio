import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Calendar, Filter, Eye, Download, 
  Share2, Trash2, Sparkles, X, MessageSquare 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCreations, deleteCreation, Creation } from '@/lib/storageService';
import { toast } from '@/hooks/use-toast';

export const MyDesigns = () => {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<Creation[]>([]);
  const [filteredDesigns, setFilteredDesigns] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search, Filter, and Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [selectedRoom, setSelectedRoom] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Selected design for comparative lightbox
  const [selectedDesign, setSelectedDesign] = useState<Creation | null>(null);

  // Fetch creations from database
  const loadDesigns = async () => {
    setLoading(true);
    try {
      const data = await getCreations();
      setDesigns(data);
      setFilteredDesigns(data);
    } catch (error) {
      console.error('Failed to load designs:', error);
      toast({
        title: "Load Failed",
        description: "Failed to retrieve your design history from database.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDesigns();
  }, []);

  // Filter and sort designs when states change
  useEffect(() => {
    let result = [...designs];

    // Search query matching (matches room type or style name)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        d => d.room_type.toLowerCase().includes(q) || d.style.toLowerCase().includes(q)
      );
    }

    // Filter by Style
    if (selectedStyle !== 'All') {
      result = result.filter(d => d.style === selectedStyle);
    }

    // Filter by Room Type
    if (selectedRoom !== 'All') {
      result = result.filter(d => d.room_type === selectedRoom);
    }

    // Sort by Date
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredDesigns(result);
  }, [searchQuery, selectedStyle, selectedRoom, sortBy, designs]);

  // Handle deletion of a creation
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening comparison view
    if (!window.confirm('Are you sure you want to delete this design permanent?')) return;

    try {
      await deleteCreation(id);
      toast({
        title: "Design Deleted",
        description: "Design has been removed from your local database."
      });
      loadDesigns(); // Refresh database checklist
    } catch (error) {
      console.error('Failed to delete creation:', error);
      toast({
        title: "Delete Failed",
        description: "Could not remove design from your device.",
        variant: "destructive"
      });
    }
  };

  // Handle high resolution download
  const handleDownload = async (creation: Creation, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      toast({
        title: "Exporting design...",
        description: "Fetching high resolution image file."
      });

      const url = creation.url;
      const filename = `jkh-design-${creation.room_type.toLowerCase().replace(/ /g, '-')}-${creation.id.slice(0, 8)}.png`;

      if (url.startsWith('data:')) {
        // If Base64 string, trigger browser download anchor
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (Capacitor.isNativePlatform()) {
        // On Native iOS: Share sheet provides a native save-to-gallery function
        const relativePath = `creations/generated_${creation.id}.webp`;
        const fileUri = await Filesystem.getUri({
          path: relativePath,
          directory: Directory.Data
        });
        
        await Share.share({
          title: `Download JKH Opulence Design`,
          text: `Save this premium JKH design to your device.`,
          url: fileUri.uri
        });
      } else {
        // Standard HTTP URL download fallback
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

      toast({
        title: "Design Exported Successfully",
        description: "Design file ready."
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Export Failed",
        description: "Could not download the high-resolution image.",
        variant: "destructive"
      });
    }
  };

  // Handle Native Sharing
  const handleShare = async (creation: Creation, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (Capacitor.isNativePlatform()) {
        const relativePath = `creations/generated_${creation.id}.webp`;
        const fileUri = await Filesystem.getUri({
          path: relativePath,
          directory: Directory.Data
        });
        
        await Share.share({
          title: `My JKH Interior Design`,
          text: `Check out my new ${creation.style} style ${creation.room_type} design generated with JKH Opulence!`,
          url: fileUri.uri
        });
      } else {
        // Web Browser Sharing Fallback
        if (navigator.share) {
          await navigator.share({
            title: `JKH Opulence Interior Design`,
            text: `Check out my new ${creation.style} style ${creation.room_type} design!`,
            url: window.location.origin
          });
        } else {
          await navigator.clipboard.writeText(creation.url);
          toast({
            title: "Link Copied!",
            description: "Image location link copied to clipboard."
          });
        }
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg !== 'Share canceled') {
        console.error('Sharing failed:', error);
        toast({
          title: "Share Failed",
          description: "Could not open share dialogue.",
          variant: "destructive"
        });
      }
    }
  };

  // Get unique room types and styles for dropdown filters
  const uniqueRooms = ['All', ...Array.from(new Set(designs.map(d => d.room_type)))];
  const uniqueStyles = ['All', ...Array.from(new Set(designs.map(d => d.style)))];

  return (
    <div className="noise-overlay relative min-h-screen flex flex-col" style={{ background: '#08080F' }}>
      <Navbar />

      <main className="flex-grow pt-28 pb-20 max-w-[1200px] mx-auto px-6 w-full relative z-10">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/50 hover:text-gold transition-colors font-inter text-xs uppercase tracking-[3px] mb-4 cursor-pointer bg-transparent border-none outline-none"
            >
              <ArrowLeft size={14} /> Back to Home
            </button>
            <h1 className="font-playfair text-4xl font-extrabold text-white">
              My <span className="gold-gradient-text">Design History</span>
            </h1>
            <p className="font-inter text-sm text-white/40 mt-1 uppercase tracking-[2px]">
              Review and manage your generated creations
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-inter text-white/30 uppercase tracking-[1px] px-3 py-1 bg-white/5 rounded-full border border-white/5">
              Total Designs: {designs.length}
            </span>
          </div>
        </div>

        {/* Filter Controls Panel */}
        <div className="glass-card p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between" style={{ borderRadius: 20 }}>
          
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input 
              type="text" 
              placeholder="Search room style, type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] pl-11 pr-4 py-3 text-white placeholder-white/20 font-inter text-sm outline-none focus:border-gold/50 transition-all duration-300"
              style={{ borderRadius: 12 }}
            />
          </div>

          {/* Selector Dropdowns */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
            {/* Room Filter */}
            <div className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] px-3 py-1.5 rounded-xl">
              <Filter size={12} className="text-gold" />
              <select 
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="bg-transparent border-none text-white/70 font-inter text-xs outline-none cursor-pointer"
              >
                {uniqueRooms.map(r => (
                  <option key={r} value={r} className="bg-dark-primary text-white">{r === 'All' ? 'All Rooms' : r}</option>
                ))}
              </select>
            </div>

            {/* Style Filter */}
            <div className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] px-3 py-1.5 rounded-xl">
              <Sparkles size={12} className="text-gold" />
              <select 
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="bg-transparent border-none text-white/70 font-inter text-xs outline-none cursor-pointer"
              >
                {uniqueStyles.map(s => (
                  <option key={s} value={s} className="bg-dark-primary text-white">{s === 'All' ? 'All Styles' : s}</option>
                ))}
              </select>
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] px-3 py-1.5 rounded-xl">
              <Calendar size={12} className="text-gold" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="bg-transparent border-none text-white/70 font-inter text-xs outline-none cursor-pointer"
              >
                <option value="newest" className="bg-dark-primary text-white">Newest First</option>
                <option value="oldest" className="bg-dark-primary text-white">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Grid Results */}
        {loading ? (
          <div className="py-36 flex flex-col items-center justify-center gap-4 text-white/30">
            <span className="w-12 h-12 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
            <span className="font-inter text-xs uppercase tracking-[3px]">Accessing Secure Vault...</span>
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="py-24 text-center glass-card p-10 max-w-lg mx-auto" style={{ borderRadius: 28 }}>
            <Sparkles size={40} className="mx-auto text-gold mb-4 opacity-40" />
            <h4 className="font-playfair text-xl font-bold text-white mb-2">No Designs Found</h4>
            <p className="font-inter text-xs text-white/40 mb-8 leading-relaxed">
              We couldn't find any saved room transformations matching your current search constraints.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="btn-gold-pill px-8 py-3 font-inter text-sm inline-block cursor-pointer"
            >
              Generate A New Room
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredDesigns.map((creation, idx) => (
                <motion.div
                  key={creation.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -6 }}
                  className="relative overflow-hidden glass-card-gold group flex flex-col cursor-pointer"
                  style={{ borderRadius: 24 }}
                  onClick={() => setSelectedDesign(creation)}
                >
                  {/* Thumbnail display */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-black/40 relative">
                    <img 
                      src={creation.url} 
                      alt="AI Redesign" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />

                    {/* Card overlay quick actions */}
                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3.5 z-20">
                      <button
                        onClick={() => setSelectedDesign(creation)}
                        className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center text-dark-primary hover:scale-110 transition-transform cursor-pointer"
                        aria-label="Compare original and redesign"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDownload(creation, e)}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white hover:bg-white/15 hover:scale-110 transition-transform cursor-pointer"
                        aria-label="Download high resolution"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={(e) => handleShare(creation, e)}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white hover:bg-white/15 hover:scale-110 transition-transform cursor-pointer"
                        aria-label="Share design"
                      >
                        <Share2 size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(creation.id, e)}
                        className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:scale-110 transition-transform cursor-pointer"
                        aria-label="Delete design permanently"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Design summary footer */}
                  <div className="p-5 flex items-center justify-between border-t border-white/5 bg-white/[0.01] flex-1">
                    <div>
                      <span className="text-[10px] font-inter uppercase tracking-[2px] text-white/30 block mb-1">
                        {creation.room_type}
                      </span>
                      <span className="text-sm font-inter font-semibold text-white/80">
                        {creation.style} style
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-inter text-gold/80 block mb-0.5 font-medium uppercase tracking-[1px] flex items-center gap-0.5 justify-end">
                        <Sparkles size={8} /> AI Render
                      </span>
                      <span className="text-[10px] font-inter text-white/35 block">
                        {new Date(creation.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Lightbox Side-by-Side Comparison Modal */}
        <AnimatePresence>
          {selectedDesign && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedDesign(null)} />
              
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-[1100px] glass-card-gold overflow-hidden z-10 flex flex-col max-h-[92vh]"
                style={{ borderRadius: 28 }}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/30 backdrop-blur-sm">
                  <div>
                    <h4 className="font-playfair text-xl md:text-2xl font-extrabold gold-gradient-text">
                      Transformation Viewer
                    </h4>
                    <p className="font-inter text-xs text-white/40 mt-1 uppercase tracking-[2px]">
                      {selectedDesign.room_type} • {selectedDesign.style} Style
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDesign(null)}
                    className="w-10 h-10 bg-white/5 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Comparative side-by-side images */}
                <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Original Room */}
                    <div className="flex flex-col gap-3">
                      <span className="font-inter text-xs uppercase tracking-[2.5px] text-white/35 font-light">Original Room</span>
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black/30 border border-white/5 shadow-inner relative">
                        {selectedDesign.original_url ? (
                          <img
                            src={selectedDesign.original_url}
                            alt="Original Room Upload"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white/20 text-xs font-inter p-6 text-center">
                            <MessageSquare size={24} className="mb-2 opacity-30" />
                            No original preview file found.<br />
                            (Only redesign image saved)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: AI Transformation */}
                    <div className="flex flex-col gap-3">
                      <span className="font-inter text-xs uppercase tracking-[2.5px] text-gold font-light flex items-center gap-1.5">
                        <Sparkles size={12} className="text-gold animate-pulse" /> AI Redesign
                      </span>
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black/30 border border-gold/15 shadow-[0_0_35px_rgba(198,165,92,0.08)]">
                        <img
                          src={selectedDesign.url}
                          alt="AI transformation mockup"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal actions footer */}
                <div className="p-6 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="font-inter text-[11px] text-white/30 uppercase tracking-[1px]">
                    Created: {new Date(selectedDesign.created_at).toLocaleString()}
                  </span>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={(e) => handleShare(selectedDesign, e)}
                      className="btn-outline-gold px-6 py-3.5 font-inter text-sm flex items-center justify-center gap-2 flex-1 sm:flex-none"
                    >
                      <Share2 size={15} /> Share Layout
                    </button>
                    <button
                      onClick={(e) => handleDownload(selectedDesign, e)}
                      className="btn-gold-pill px-8 py-3.5 font-inter text-sm flex-1 sm:flex-none flex items-center justify-center gap-2"
                    >
                      <Download size={15} /> Download Design
                    </button>
                    <button
                      onClick={(e) => { handleDelete(selectedDesign.id, e); setSelectedDesign(null); }}
                      className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-3.5 font-inter text-sm transition-colors rounded-full border border-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>

      <Footer />
    </div>
  );
};

export default MyDesigns;
