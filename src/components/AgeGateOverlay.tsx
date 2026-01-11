import { useState } from 'react';
import { motion } from 'motion/react';
import logoImage from '../assets/logo.png';

interface AgeGateOverlayProps {
  onVerify: () => void;
}

export function AgeGateOverlay({ onVerify }: AgeGateOverlayProps) {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    // Allow animation to play before unmounting/transitioning
    setTimeout(onVerify, 1500);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#050505] via-[#0A0A0A] to-[#050505] flex items-center justify-center z-[200]">
      <div className="flex flex-col items-center max-w-md px-8 relative">

        {/* Logo + Subtitle Lockup */}
        <div className="flex flex-col items-center mb-16 perspective-[1000px]">
          {/* Logo - Animated */}
          <motion.div
            initial={{ rotateX: 60, y: 0, opacity: 0.6 }}
            animate={
              isVerifying
                ? { rotateX: 0, y: 0, opacity: 1, scale: 1.1 }
                : { rotateX: 60, y: 0, opacity: 0.6 }
            }
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1] // Custom exponential ease
            }}
            className="mb-8 relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Idle Float Animation Wrapper */}
            <motion.div
              animate={isVerifying ? {} : { y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img
                src={logoImage}
                alt="GO LINE Logo"
                className="w-48 h-auto"
                style={{
                  filter: isVerifying
                    ? 'drop-shadow(0 0 40px rgba(212,175,55,0.3))'
                    : 'drop-shadow(0 10px 20px rgba(0,0,0,0.8)) brightness(0.8)'
                }}
              />
            </motion.div>
          </motion.div>

          {/* Subtitle - Fade in on verify */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={isVerifying ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-sm tracking-[0.2em] uppercase font-light text-[#D4AF37] text-center"
          >
            Guided Outcome Calculator
          </motion.h1>
        </div>

        {/* Controls - Fade out on Verify */}
        <motion.div
          animate={isVerifying ? { opacity: 0, y: 20, pointerEvents: 'none' } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center w-full"
        >
          {/* Message */}
          <p className="text-sm text-white/40 text-center mb-12 leading-relaxed font-light">
            Age verification required. 21+
          </p>

          {/* Action */}
          <button
            onClick={handleVerify}
            className="w-full px-12 py-5 bg-white/[0.06] hover:bg-white/[0.10]
                       backdrop-blur-2xl rounded-2xl
                       shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]
                       hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15),0_8px_32px_rgba(255,255,255,0.06)]
                       text-white/80 hover:text-white/95 text-sm uppercase tracking-wider font-medium
                       transition-all duration-200 ease-out flex items-center justify-center gap-3 group"
          >
            <span>Verify Age</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-50 group-hover:translate-x-1 transition-transform">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            onClick={() => window.close()}
            className="mt-6 text-xs uppercase tracking-wider text-white/30 hover:text-white/50 
                       transition-colors duration-200 font-medium"
          >
            Exit
          </button>
        </motion.div>
      </div>
    </div>
  );
}