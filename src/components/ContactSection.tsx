import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, Clock, Loader2 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { toast } from '@/hooks/use-toast';

const contactCards = [
  { icon: Phone, color: '', title: '+91 98765 43210', sub: 'Call us anytime', action: 'tel:+919876543210' },
  { icon: Mail, color: '', title: 'info@jkhinterior.com', sub: 'Write to us', action: 'mailto:info@jkhinterior.com' },
  { icon: MapPin, color: '', title: 'Chennai, Tamil Nadu', sub: 'Visit our studio', action: 'https://maps.google.com/?q=JKH+Interior+Chennai' },
  { icon: MessageCircle, color: '#25D366', title: 'Chat on WhatsApp', sub: 'Instant response', action: 'https://wa.me/919876543210' },
  { icon: Clock, color: '', title: 'Mon — Sat, 9AM — 7PM', sub: 'Working hours', action: '' },
];

const formFieldVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: 0.2 + i * 0.08, ease: 'easeOut' as const },
  }),
};

const contactCardVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1 + i * 0.1, type: 'spring' as const, stiffness: 100, damping: 15 },
  }),
};

const ContactSection = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!form.name.trim() || form.name.length < 2) {
      toast({ 
        title: "Name Required", 
        description: "Please enter a name of at least 2 characters.", 
        variant: "destructive" 
      });
      return;
    }
    
    // Validate phone number format
    if (!/^\+?[0-9\s-]{10,15}$/.test(form.phone.trim().replace(/\s/g, ''))) {
      toast({ 
        title: "Invalid Phone Number", 
        description: "Please enter a valid phone number (10 to 15 digits).", 
        variant: "destructive" 
      });
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast({ 
        title: "Invalid Email Address", 
        description: "Please enter a valid email address.", 
        variant: "destructive" 
      });
      return;
    }

    if (!form.service) {
      toast({ 
        title: "Service Selection Required", 
        description: "Please select an interior design service.", 
        variant: "destructive" 
      });
      return;
    }

    if (!form.message.trim() || form.message.length < 10) {
      toast({ 
        title: "Message Too Short", 
        description: "Message must be at least 10 characters.", 
        variant: "destructive" 
      });
      return;
    }

    setSubmitting(true);

    try {
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      
      if (accessKey) {
        // Direct Web3Forms client-side email submission
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `New JKH Interior Inquiry from ${form.name}`,
            from_name: "JKH Opulence Studio App",
            name: form.name,
            phone: form.phone,
            email: form.email,
            service: form.service,
            message: form.message
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          toast({
            title: "Inquiry Sent Successfully!",
            description: "Thank you for contacting us! We'll review your details and get back to you within 24 hours.",
          });
          setForm({ name: '', phone: '', email: '', service: '', message: '' });
        } else {
          throw new Error(data.message || "Web3Forms submission failed.");
        }
      } else {
        // Fallback: simulated server submission (for demo/zero-cost offline mode)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast({
          title: "Inquiry Submitted! (Demo Mode)",
          description: `Thank you, ${form.name}! We've logged your request for "${form.service}". (Note: Add VITE_WEB3FORMS_ACCESS_KEY to .env to receive emails).`,
        });
        setForm({ name: '', phone: '', email: '', service: '', message: '' });
      }
    } catch (error: unknown) {
      console.error("Submission failed:", error);
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Failed to submit contact request. Please check your network.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardClick = (action: string) => {
    if (!action) return;
    if (action.startsWith('tel:') || action.startsWith('mailto:')) {
      window.location.href = action;
    } else {
      window.open(action, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="contact" className="py-20 md:py-36" style={{ background: '#08080F' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <SectionHeading white="Get In" gold="Touch" sub="Let's discuss your dream interior project" />
        <div className="mt-16 grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 15 }}
            className="glass-card p-8 md:p-10"
            style={{ borderRadius: 32 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { label: 'Your Name', type: 'text', key: 'name', placeholder: 'Enter your full name' },
                { label: 'Phone Number', type: 'tel', key: 'phone', placeholder: 'Enter phone number' },
                { label: 'Email Address', type: 'email', key: 'email', placeholder: 'name@example.com' },
              ].map((f, i) => (
                <motion.div
                  key={f.label}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={formFieldVariants}
                >
                  <label className="font-inter text-[11px] uppercase tracking-[4px] text-white/40 mb-2 block font-light">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key as keyof typeof form]}
                    placeholder={f.placeholder}
                    onChange={e => handleInputChange(f.key, e.target.value)}
                    required
                    disabled={submitting}
                    className="w-full bg-white/[0.04] border border-white/[0.08] px-5 py-4 text-white placeholder-white/20 font-inter text-base outline-none focus:border-gold/50 focus:shadow-[0_0_20px_rgba(198,165,92,0.08)] transition-all duration-300"
                    style={{ borderRadius: 12 }}
                  />
                </motion.div>
              ))}
              
              <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={formFieldVariants}>
                <label className="font-inter text-[11px] uppercase tracking-[4px] text-white/40 mb-2 block font-light">What Do You Need?</label>
                <select 
                  value={form.service}
                  onChange={e => handleInputChange('service', e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full bg-white/[0.04] border border-white/[0.08] px-5 py-4 text-white/70 font-inter text-base outline-none focus:border-gold/50 transition-all duration-300 appearance-none cursor-pointer" 
                  style={{ borderRadius: 12 }}
                >
                  <option value="" className="bg-dark-primary text-white/40">Select a service</option>
                  {['TV Unit Design', 'Kitchen Interior', 'Wardrobe Design', 'Ceiling Design', 'Full Home Interior', 'Commercial Interior', 'Other'].map(o => (
                    <option key={o} value={o} className="bg-dark-primary text-white">{o}</option>
                  ))}
                </select>
              </motion.div>

              <motion.div custom={4} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={formFieldVariants}>
                <label className="font-inter text-[11px] uppercase tracking-[4px] text-white/40 mb-2 block font-light">Your Message</label>
                <textarea 
                  rows={4} 
                  value={form.message}
                  placeholder="Describe your design vision, timeline, or space specifics..."
                  onChange={e => handleInputChange('message', e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full bg-white/[0.04] border border-white/[0.08] px-5 py-4 text-white placeholder-white/20 font-inter text-base outline-none focus:border-gold/50 focus:shadow-[0_0_20px_rgba(198,165,92,0.08)] transition-all duration-300 resize-none" 
                  style={{ borderRadius: 12 }} 
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={submitting}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.97 }}
                className={`w-full btn-gold-pill py-4 font-inter text-base font-bold mt-2 flex items-center justify-center gap-2 cursor-pointer ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>Send Message →</>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Cards */}
          <div className="space-y-4">
            {contactCards.map((c, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={contactCardVariants}
                whileHover={c.action ? { y: -2, borderColor: 'rgba(198,165,92,0.3)' } : {}}
                onClick={() => handleCardClick(c.action)}
                className={`glass-card p-6 flex items-center gap-4 transition-all duration-300 ${
                  c.action ? 'cursor-pointer hover:shadow-[0_0_15px_rgba(198,165,92,0.05)]' : 'cursor-default'
                }`}
                style={{ borderRadius: 24 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 300 }}
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: c.color || 'linear-gradient(135deg, #C6A55C, #FCF6BA, #B8941F)' }}
                >
                  <c.icon size={20} className="text-dark-primary" />
                </motion.div>
                <div>
                  <p className="font-inter text-[15px] text-white font-semibold">{c.title}</p>
                  <p className="font-inter text-[13px] text-white/40">{c.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
