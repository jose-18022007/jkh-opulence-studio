import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, X, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const roomTypes = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining', 'Office', 'Kids Room', 'Pooja Room'];
const styles = ['Modern', 'Minimalist', 'Traditional', 'Luxury', 'Contemporary', 'Scandinavian', 'Industrial'];
const counts = ['5', '10', '15'];

const Pill = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`px-5 py-2.5 font-inter text-sm cursor-pointer transition-all duration-300 ${
      selected
        ? 'gold-gradient-bg text-dark-primary font-semibold shadow-[0_0_20px_rgba(198,165,92,0.3)]'
        : 'bg-white/5 text-white/70 border border-white/10 hover:border-white/20'
    }`}
    style={{ borderRadius: 9999 }}
  >
    {label}
  </motion.button>
);

const AIGenerator = () => {
  const [room, setRoom] = useState('Living Room');
  const [style, setStyle] = useState('Modern');
  const [count, setCount] = useState('10');
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploadedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateDesigns = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image uploaded",
        description: "Please upload a room image first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', uploadedImage);
      formData.append('roomType', room);
      formData.append('style', style);
      formData.append('count', count);

      // Make API call to backend
      const response = await fetch('/api/generate-designs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: "Designs generated successfully!",
        description: `Generated ${count} designs for your ${room}`,
      });

      // Handle the generated designs here
      console.log('Generated designs:', result);
      
    } catch (error) {
      console.error('Error generating designs:', error);
      
      // Show user-friendly error message
      toast({
        title: "Backend not available",
        description: "The design generation service is currently unavailable. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="generate" className="py-20 md:py-36 relative overflow-hidden" style={{ background: '#08080F' }}>
      {/* Gradient mesh */}
      <div className="absolute inset-0 pointer-events-none animate-mesh-morph" style={{
        background: `
          radial-gradient(ellipse 600px 400px at 20% 30%, rgba(198,165,92,0.06) 0%, transparent 70%),
          radial-gradient(ellipse 500px 500px at 80% 70%, rgba(217,169,56,0.05) 0%, transparent 70%),
          radial-gradient(ellipse 400px 300px at 50% 50%, rgba(252,246,186,0.03) 0%, transparent 70%),
          radial-gradient(ellipse 300px 400px at 70% 20%, rgba(184,148,31,0.04) 0%, transparent 70%),
          radial-gradient(ellipse 350px 350px at 30% 80%, rgba(232,213,163,0.03) 0%, transparent 70%)
        `
      }} />
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full animate-orb-pulse pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.06) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full animate-orb-pulse pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,169,56,0.05) 0%, transparent 70%)', filter: 'blur(100px)', animationDelay: '2s' }} />
      <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] rounded-full animate-orb-pulse pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(252,246,186,0.04) 0%, transparent 70%)', filter: 'blur(90px)', animationDelay: '3.5s' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 font-inter text-[11px] uppercase tracking-[4px] text-gold font-light" style={{ border: '1px solid rgba(198,165,92,0.3)', background: 'rgba(198,165,92,0.05)', borderRadius: 9999 }}>
            <Sparkles size={14} /> Powered by AI
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-playfair text-[34px] md:text-[56px] font-extrabold tracking-[-0.02em]" style={{ textShadow: '0 0 60px rgba(198,165,92,0.2)' }}>
            Create Your <span className="gold-gradient-text" style={{ filter: 'drop-shadow(0 0 20px rgba(198,165,92,0.2))' }}>Dream Interior</span>
          </h2>
          <p className="font-inter text-sm md:text-[15px] font-light text-white/40 mt-4 max-w-xl mx-auto uppercase tracking-[3px]">Upload any room photo and watch AI generate stunning designs instantly</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 100, damping: 15 }}
          className="mt-12 max-w-[800px] mx-auto glass-card-gold p-8 md:p-12"
          style={{ borderRadius: 32 }}
        >
          {/* Upload zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className="py-14 px-6 text-center transition-all duration-300 relative"
            style={{
              border: dragOver ? '2px solid #C6A55C' : '2px dashed rgba(198,165,92,0.3)',
              background: dragOver ? 'rgba(198,165,92,0.05)' : 'rgba(198,165,92,0.02)',
              borderRadius: 24,
            }}
          >
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Uploaded room" 
                  className="max-w-full max-h-64 mx-auto rounded-lg object-cover"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X size={16} />
                </button>
                <p className="font-inter text-sm text-white/70 mt-3">{uploadedImage?.name}</p>
              </div>
            ) : (
              <>
                <Upload size={48} className="mx-auto text-gold mb-4" />
                <p className="font-inter text-lg text-white font-semibold">Drop your room photo here</p>
                <p className="font-inter text-sm text-white/30 my-3">or</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.97 }} 
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-gold-pill px-8 py-2.5 font-inter text-sm"
                >
                  Browse Files
                </motion.button>
                <p className="font-inter text-[13px] text-white/30 mt-4">Supports JPG, PNG up to 10MB</p>
              </>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Options */}
          <div className="mt-8 space-y-6">
            <div>
              <label className="font-inter text-[11px] uppercase tracking-[4px] text-white/40 mb-3 block font-light">Select Room Type</label>
              <div className="flex flex-wrap gap-2">{roomTypes.map(r => <Pill key={r} label={r} selected={room === r} onClick={() => setRoom(r)} />)}</div>
            </div>
            <div>
              <label className="font-inter text-[11px] uppercase tracking-[4px] text-white/40 mb-3 block font-light">Design Style</label>
              <div className="flex flex-wrap gap-2">{styles.map(s => <Pill key={s} label={s} selected={style === s} onClick={() => setStyle(s)} />)}</div>
            </div>
            <div>
              <label className="font-inter text-[11px] uppercase tracking-[4px] text-white/40 mb-3 block font-light">Number of Designs</label>
              <div className="flex flex-wrap gap-2">{counts.map(c => <Pill key={c} label={c} selected={count === c} onClick={() => setCount(c)} />)}</div>
            </div>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: isGenerating ? 1 : 1.03 }}
            whileTap={{ scale: isGenerating ? 1 : 0.97 }}
            onClick={generateDesigns}
            disabled={isGenerating}
            className={`w-full mt-10 font-playfair text-xl font-bold py-5 cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 ${
              isGenerating 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'gold-gradient-bg text-dark-primary animate-pulse-gold'
            }`}
            style={{ borderRadius: 16 }}
          >
            {isGenerating ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Generating Designs...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Generate Designs
              </>
            )}
          </motion.button>
          <p className="text-center font-inter text-[13px] text-white/35 mt-4">🔒 Free to use • No signup required • Results in 30 seconds</p>
        </motion.div>
      </div>
    </section>
  );
};

export default AIGenerator;
