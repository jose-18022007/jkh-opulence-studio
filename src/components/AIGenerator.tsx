import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, X, Loader2, Eye, Download, Camera as CameraIcon, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { saveCreation } from '@/lib/db';
import type { Creation } from '@/lib/db';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { prepareUploadBlob, optimizeImage } from '@/lib/imageOptimizer';
import GenerationLoader from './GenerationLoader';

const roomTypes = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining', 'Office', 'Kids Room', 'Pooja Room', 'TV Unit'];
const styles = ['Modern', 'Minimalist', 'Traditional', 'Luxury', 'Contemporary', 'Scandinavian', 'Industrial'];
const counts = ['1', '5', '10', '15'];

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

// Client-side AI prompt helper
const createPrompt = (roomType: string, designStyle: string) => {
  const roomLower = roomType.toLowerCase();
  if (roomLower === "tv unit") {
    return (
      `Sleek and premium ${designStyle.toLowerCase()} style TV unit wall design. ` +
      `Keep the wall layout, the TV screen, and the room structure exactly the same. ` +
      `Redesign the dark wood wall background into a high-end ${designStyle.toLowerCase()} accent wall paneling (such as premium white marble cladding, fluted wood paneling, or sleek matte lacquer). ` +
      `Replace the space below the TV with a clean floating console cabinet. ` +
      `Do not add any chairs, desks, clutter, or extra furniture in the foreground. Keep the floor space in front of the TV unit open and completely clean. ` +
      `Add subtle, warm indirect LED strip backlighting behind the panels. Minimalist, premium, professional architectural interior photography, high resolution.`
    );
  } else if (roomLower.includes("wardrobe") || roomLower.includes("kitchen")) {
    return (
      `Modify and redesign this ${roomType.toLowerCase()} cabinets and style into a stunning, clean ${designStyle.toLowerCase()} design. ` +
      `Keep the original room layout, walls, and ceiling structure identical. ` +
      `Only change the cabinet door designs, materials (such as matte acrylic, premium veneer, or glass panels), handles, and countertops. ` +
      `Do not add clutter or extra items. Professional interior design rendering, clean and spacious, high-end materials, neat and organized.`
    );
  } else {
    return (
      `Modify and transform this ${roomType.toLowerCase()} into a stunning, clutter-free ${designStyle.toLowerCase()} interior design. ` +
      `Keep the original room structure, walls, windows, and architectural layout identical. ` +
      `Redesign the furniture, style, lighting, and decoration to be ${designStyle.toLowerCase()}. ` +
      `Keep the layout spacious, modern, and clean. Professional interior photography, high-end furniture, architectural digest quality, photorealistic.`
    );
  }
};

// Client-side Pollinations uploader
const uploadToPollinations = async (file: File): Promise<string> => {
  const apiKey = import.meta.env.VITE_POLLINATIONS_API_KEY || "sk_Q3CiZkqjyp54NV3JaO7nafrjD5YlxwbF";
  const response = await fetch("https://media.pollinations.ai/upload", {
    method: "POST",
    headers: {
      "Content-Type": file.type,
      "Authorization": `Bearer ${apiKey}`
    },
    body: file
  });
  
  if (!response.ok) {
    throw new Error("Failed to upload source image to Pollinations Media Storage.");
  }
  
  const result = await response.json();
  const mediaUrl = result.url || (result.id ? `https://media.pollinations.ai/${result.id}` : "");
  if (!mediaUrl) {
    throw new Error("Malformed response from Pollinations Media Storage.");
  }
  return mediaUrl;
};

// Direct client-side AI image-to-image edit
const generateSingleDesign = async (prompt: string, mediaUrl: string, seed: number): Promise<string> => {
  const apiKey = import.meta.env.VITE_POLLINATIONS_API_KEY || "sk_Q3CiZkqjyp54NV3JaO7nafrjD5YlxwbF";
  const response = await fetch("https://gen.pollinations.ai/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: prompt,
      image: mediaUrl,
      model: "klein",
      size: "1024x1024",
      response_format: "b64_json",
      n: 1,
      seed: seed
    })
  });
  
  if (!response.ok) {
    throw new Error(`AI model returned status ${response.status}`);
  }
  
  const result = await response.json();
  if (result.data && result.data[0]?.b64_json) {
    return `data:image/png;base64,${result.data[0].b64_json}`;
  } else {
    throw new Error("Unexpected API response format. Missing image content.");
  }
};

interface AIGeneratorProps {
  room: string;
  setRoom: (room: string) => void;
}

const AIGenerator = ({ room, setRoom }: AIGeneratorProps) => {
  const [style, setStyle] = useState('Modern');
  const [count, setCount] = useState('1');
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // State for storing and rendering generated designs
  const [generatedDesigns, setGeneratedDesigns] = useState<Creation[]>([]);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<Creation | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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

  const pickImageNatively = async (sourceType: 'camera' | 'photos') => {
    try {
      const source = sourceType === 'camera' ? CameraSource.Camera : CameraSource.Photos;
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: source
      });
      
      if (image.webPath) {
        setImagePreview(image.webPath);
        
        // Fetch webPath content to convert to a binary File object
        const res = await fetch(image.webPath);
        const blob = await res.blob();
        const file = new File([blob], `captured-room.${image.format}`, { type: blob.type });
        setUploadedImage(file);
        
        toast({
          title: "Image Selected",
          description: `Room image captured successfully from ${sourceType}.`
        });
      }
    } catch (err: unknown) {
      console.error('Native camera pick failed:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg && !msg.includes('cancelled') && !msg.includes('User cancelled')) {
        toast({
          title: "Selection Failed",
          description: msg || "Failed to load selected photo. Please verify permissions.",
          variant: "destructive"
        });
      }
    }
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

  const downloadImage = async (url: string, filename: string) => {
    try {
      toast({
        title: "Starting download...",
        description: "Your design image is fetching.",
      });
      
      // If base64 data url, we can download directly
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
      
      toast({
        title: "Download complete!",
        description: "Design saved to your device.",
      });
    } catch (error) {
      console.error('Download failed:', error);
      window.open(url, '_blank');
      toast({
        title: "Download started in new tab",
        description: "Right click the image to save if it didn't auto-download.",
      });
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
    setGeneratedDesigns([]);

    try {
      toast({
        title: "Optimizing Image...",
        description: "Compressing room photo to WebP format.",
      });
      
      // Compress upload file to WebP
      const optimizedBlob = await prepareUploadBlob(uploadedImage, 1024, 1024, 0.8);
      
      // Generate optimized WebP base64 of the original room photo to store locally in database history
      const originalWebpBase64 = await optimizeImage(uploadedImage, 1024, 1024, 0.7);

      toast({
        title: "Uploading Image...",
        description: "Preparing your space for AI redesign.",
      });
      
      // 1. Upload optimized photo to Pollinations
      const mediaUrl = await uploadToPollinations(optimizedBlob);
      setOriginalImageUrl(mediaUrl);
      
      toast({
        title: "Generating AI Concepts...",
        description: "Reimagining your room. This takes about 10-15 seconds per option.",
      });

      // 2. Prepare rendering values
      const prompt = createPrompt(room, style);
      const numDesigns = parseInt(count, 10);
      const resultsList = [];

      // Generate sequential variations using random seeds
      for (let i = 0; i < numDesigns; i++) {
        const seed = Math.floor(Math.random() * 10000000) + i;
        const base64DataUrl = await generateSingleDesign(prompt, mediaUrl, seed);
        
        const creationItem = {
          id: crypto.randomUUID(),
          url: base64DataUrl,
          original_url: originalWebpBase64,
          style: style,
          room_type: room,
          created_at: new Date().toISOString()
        };
        
        // 3. Save creation natively to device database
        await saveCreation(creationItem);
        resultsList.push(creationItem);
      }

      setGeneratedDesigns(resultsList);
      
      toast({
        title: "Designs generated successfully!",
        description: `Generated ${resultsList.length} designs for your ${room}`,
      });
      
      // Scroll to results section smoothly
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      
    } catch (error: unknown) {
      console.error('Error generating designs:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An error occurred while communicating with the AI server. Please try again.",
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

        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="mt-12 max-w-[800px] mx-auto"
            >
              <GenerationLoader 
                imagePreview={imagePreview} 
                roomType={room} 
                styleName={style} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="generator-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
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
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                    <p className="font-inter text-sm text-white/70 mt-3">{uploadedImage?.name || 'Selected Room Photo'}</p>
                  </div>
                ) : (
                  <>
                    <Upload size={48} className="mx-auto text-gold mb-4" />
                    <p className="font-inter text-lg text-white font-semibold">Drop your room photo here</p>
                    
                    {Capacitor.isNativePlatform() ? (
                      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
                        <motion.button 
                          whileHover={{ scale: 1.03 }} 
                          whileTap={{ scale: 0.97 }} 
                          onClick={() => pickImageNatively('camera')}
                          className="btn-gold-pill px-6 py-2.5 font-inter text-sm cursor-pointer flex items-center gap-2 justify-center"
                        >
                          <CameraIcon size={16} /> Take Photo
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.03 }} 
                          whileTap={{ scale: 0.97 }} 
                          onClick={() => pickImageNatively('photos')}
                          className="btn-outline-gold px-6 py-2.5 font-inter text-sm cursor-pointer flex items-center gap-2 justify-center"
                        >
                          <ImageIcon size={16} /> Gallery Photo
                        </motion.button>
                      </div>
                    ) : (
                      <>
                        <p className="font-inter text-sm text-white/30 my-3">or</p>
                        <motion.button 
                          whileHover={{ scale: 1.05 }} 
                          whileTap={{ scale: 0.97 }} 
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-gold-pill px-8 py-2.5 font-inter text-sm cursor-pointer"
                        >
                          Browse Files
                        </motion.button>
                      </>
                    )}
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
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={generateDesigns}
                className="w-full mt-10 font-playfair text-xl font-bold py-5 cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 gold-gradient-bg text-dark-primary animate-pulse-gold"
                style={{ borderRadius: 16 }}
              >
                <Sparkles size={24} />
                Generate Designs
              </motion.button>
              <p className="text-center font-inter text-[13px] text-white/35 mt-4">🔒 Free to use • No signup required • Results in 15 seconds per layout</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Ref Hook Anchor */}
        <div ref={resultsRef} className="pt-2" />

        {/* Generated Designs Gallery Grid */}
        {generatedDesigns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-24 max-w-[1000px] mx-auto"
          >
            <div className="text-center mb-12">
              <h3 className="font-playfair text-2xl md:text-4xl font-extrabold gold-gradient-text" style={{ textShadow: '0 0 40px rgba(198,165,92,0.15)' }}>
                Your AI Masterpieces
              </h3>
              <p className="font-inter text-xs md:text-sm font-light text-white/40 mt-3 uppercase tracking-[3px]">
                Generated designs for your {room} in {style} style
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {generatedDesigns.map((design, idx) => (
                <motion.div
                  key={design.id || idx}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden glass-card-gold group flex flex-col"
                  style={{ borderRadius: 24 }}
                >
                  {/* Image wrapper */}
                  <div className="aspect-square w-full overflow-hidden bg-black/40 relative">
                    <img
                      src={design.url}
                      alt={`${style} ${room} design ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-20">
                      <button
                        onClick={() => setSelectedDesign(design)}
                        className="w-12 h-12 rounded-full gold-gradient-bg flex items-center justify-center text-dark-primary hover:scale-110 transition-transform cursor-pointer shadow-[0_0_15px_rgba(198,165,92,0.3)]"
                        aria-label="Compare view"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => downloadImage(design.url, `jkh-opulence-${room.toLowerCase().replace(' ', '-')}-${idx + 1}.png`)}
                        className="w-12 h-12 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white hover:bg-white/15 hover:scale-110 transition-transform cursor-pointer"
                        aria-label="Download image"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Card Details Footer */}
                  <div className="p-5 flex items-center justify-between border-t border-white/5 bg-white/[0.01] flex-1">
                    <div>
                      <span className="text-[10px] font-inter uppercase tracking-[2px] text-white/30 block mb-1">Design Option {idx + 1}</span>
                      <span className="text-sm font-inter font-semibold text-white/80">{style} Theme</span>
                    </div>
                    <span className="text-[11px] text-gold font-medium px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20 flex items-center gap-1">
                      <Sparkles size={10} /> AI
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox Side-by-Side Comparison Modal */}
      <AnimatePresence>
        {selectedDesign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setSelectedDesign(null)} />
            
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
                    {selectedDesign.room_type || room} • {selectedDesign.style || style} Style
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDesign(null)}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Comparative Side-by-Side Content */}
              <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left: Original Room */}
                  <div className="flex flex-col gap-3">
                    <span className="font-inter text-xs uppercase tracking-[2.5px] text-white/35 font-light">Original Room</span>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black/30 border border-white/5 shadow-inner">
                      {originalImageUrl ? (
                        <img
                          src={originalImageUrl}
                          alt="Original uploaded room"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-sm font-inter">
                          No original preview available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: AI Transformation */}
                  <div className="flex flex-col gap-3">
                    <span className="font-inter text-xs uppercase tracking-[2.5px] text-gold font-light flex items-center gap-1.5">
                      <Sparkles size={12} className="text-gold" /> AI Redesign
                    </span>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black/30 border border-gold/15 shadow-[0_0_30px_rgba(198,165,92,0.1)]">
                      <img
                        src={selectedDesign.url}
                        alt="AI generated interior design"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="font-inter text-[11px] text-white/30 uppercase tracking-[1px]">
                  Powered by JKH Opulence AI Engine
                </span>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => downloadImage(selectedDesign.url, `jkh-opulence-redesign-${selectedDesign.id || 'image'}.png`)}
                    className="btn-gold-pill px-8 py-3.5 font-inter text-sm flex-1 sm:flex-none flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> Download Transformation
                  </button>
                  <button
                    onClick={() => setSelectedDesign(null)}
                    className="btn-outline-gold px-6 py-3.5 font-inter text-sm flex-1 sm:flex-none"
                  >
                    Close View
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

export default AIGenerator;
