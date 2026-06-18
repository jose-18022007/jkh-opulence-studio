import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share, PlusSquare, Smartphone, Sparkles } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // 1. Detect if the app is already installed/running in standalone mode
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    // 2. Local Storage Persistence Check
    const checkDismissal = () => {
      const status = localStorage.getItem("jkh_pwa_install_status");
      const lastDismissed = localStorage.getItem("jkh_pwa_install_dismissed_time");

      if (status === "installed" || status === "never_show") {
        return false;
      }

      if (lastDismissed) {
        const dismissedDate = new Date(parseInt(lastDismissed, 10));
        const now = new Date();
        const diffDays = Math.ceil((now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Show after 7 days if they clicked "Later" (Android/Desktop)
        // Show after 30 days if they dismissed iOS instructions
        const requiredGap = showIOSPrompt ? 30 : 7;
        if (diffDays < requiredGap) {
          return false;
        }
      }
      return true;
    };

    // 3. Android/Desktop Chrome Installer Capture
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Store prompt event to trigger it later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      if (checkDismissal()) {
        // Small delay to let user experience the site first
        setTimeout(() => {
          setShowAndroidPrompt(true);
        }, 8000);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. iOS Safari Detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS && isSafari && !isStandalone) {
      if (checkDismissal()) {
        setTimeout(() => {
          setShowIOSPrompt(true);
        }, 10000);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [showIOSPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Trigger prompt
    await deferredPrompt.prompt();
    
    // Wait for user choice
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt");
      localStorage.setItem("jkh_pwa_install_status", "installed");
    } else {
      console.log("User dismissed the install prompt");
      // Fallback: save dismissal for 7 days
      localStorage.setItem("jkh_pwa_install_dismissed_time", Date.now().toString());
    }

    // Reset prompt state
    setDeferredPrompt(null);
    setShowAndroidPrompt(false);
  };

  const handleLaterClick = () => {
    localStorage.setItem("jkh_pwa_install_dismissed_time", Date.now().toString());
    setShowAndroidPrompt(false);
  };

  const handleIOSDismiss = () => {
    localStorage.setItem("jkh_pwa_install_dismissed_time", Date.now().toString());
    setShowIOSPrompt(false);
  };

  return (
    <>
      {/* 1. Android/Desktop Premium Install Overlay */}
      <AnimatePresence>
        {showAndroidPrompt && (
          <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[100] pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-card-gold p-6 relative overflow-hidden"
              style={{ borderRadius: 24 }}
            >
              {/* Gold gradient background details */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(198,165,92,0.08) 0%, transparent 70%)', filter: 'blur(30px)' }} />

              <button
                onClick={handleLaterClick}
                className="absolute top-4 right-4 w-7 h-7 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-full flex items-center justify-center transition-colors cursor-pointer border border-white/10 z-10"
              >
                <X size={14} />
              </button>

              <div className="flex gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0 shadow-[0_0_15px_rgba(198,165,92,0.15)]">
                  <Download size={22} className="animate-bounce" />
                </div>
                <div className="flex-1">
                  <h4 className="font-playfair text-[17px] font-bold text-white flex items-center gap-1.5">
                    Install JKH Opulence Studio <Sparkles size={13} className="text-gold" />
                  </h4>
                  <p className="font-inter text-[12px] font-light text-white/60 mt-1 leading-relaxed">
                    Add JKH Opulence Studio to your home screen for a faster app-like experience, offline support, and one-tap access.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6 relative z-10">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 font-inter text-xs font-semibold py-3 cursor-pointer text-dark-primary gold-gradient-bg transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(198,165,92,0.25)]"
                  style={{ borderRadius: 12 }}
                >
                  Install Now
                </button>
                <button
                  onClick={handleLaterClick}
                  className="flex-1 font-inter text-xs font-medium py-3 cursor-pointer text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  style={{ borderRadius: 12 }}
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. iOS Safari Step-by-Step Guide Panel */}
      <AnimatePresence>
        {showIOSPrompt && (
          <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[100] pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-card-gold p-6 relative overflow-hidden"
              style={{ borderRadius: 24 }}
            >
              {/* Background gradient details */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none" />

              <button
                onClick={handleIOSDismiss}
                className="absolute top-4 right-4 w-7 h-7 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-full flex items-center justify-center transition-colors cursor-pointer border border-white/10 z-10"
              >
                <X size={14} />
              </button>

              <div className="flex gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0 shadow-[0_0_15px_rgba(198,165,92,0.15)]">
                  <Smartphone size={22} />
                </div>
                <div className="flex-1">
                  <h4 className="font-playfair text-[17px] font-bold text-white flex items-center gap-1.5">
                    Install JKH Opulence Studio
                  </h4>
                  <p className="font-inter text-[12px] font-light text-white/50 mt-0.5 uppercase tracking-[1px]">
                    Install on iOS / Apple Devices
                  </p>
                </div>
              </div>

              {/* Step-by-Step Checklist */}
              <div className="space-y-4 mt-5 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gold shrink-0">
                    <Share size={15} />
                  </div>
                  <div className="text-[13px] font-inter text-white/80 font-light">
                    1. Tap the <span className="font-semibold text-white">Share</span> button in Safari.
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gold shrink-0">
                    <PlusSquare size={15} />
                  </div>
                  <div className="text-[13px] font-inter text-white/80 font-light">
                    2. Select <span className="font-semibold text-white">Add to Home Screen</span>.
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0 font-semibold text-xs">
                    Add
                  </div>
                  <div className="text-[13px] font-inter text-white/80 font-light">
                    3. Tap <span className="font-semibold text-white">Add</span> at the top right corner.
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end relative z-10">
                <button
                  onClick={handleIOSDismiss}
                  className="px-6 py-2.5 font-inter text-xs font-semibold cursor-pointer text-dark-primary gold-gradient-bg hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(198,165,92,0.2)]"
                  style={{ borderRadius: 10 }}
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
