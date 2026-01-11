import { motion } from 'motion/react';
import logoImage from '../../assets/logo.png';
import type { BlendIngredient } from '../../types/blendStates';

interface ProcessorProps {
  state: 'idle' | 'listening' | 'analyzing' | 'processing';
  ingredients?: BlendIngredient[];
}

/**
 * GoLogo / Processor
 * 
 * FRAME B: blending_in_progress
 * When state = 'processing', displays ingredient tokens inside logo region.
 * Token count MUST equal ingredients.length.
 */
export function Processor({ state, ingredients = [] }: ProcessorProps) {
  const getGlowIntensity = () => {
    switch (state) {
      case 'listening': return 0.4;
      case 'analyzing': return 0.6;
      case 'processing': return 0.8;
      default: return 0.2;
    }
  };

  const glowIntensity = getGlowIntensity();

  return (
    <div className="relative flex flex-col items-center">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 blur-3xl transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, rgba(212,175,55,${glowIntensity}) 0%, transparent 70%)`,
          opacity: state === 'idle' ? 0.3 : 1,
        }}
      />

      {/* Logo */}
      <motion.img
        src={logoImage}
        alt="GO LINE"
        className="w-32 h-auto relative z-10"
        animate={{
          scale: state === 'processing' ? 1.1 : 1,
          filter: `drop-shadow(0 0 ${state === 'processing' ? '24px' : '12px'} rgba(212,175,55,${glowIntensity}))`
        }}
        transition={{
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* FRAME B: Ingredient tokens visible during processing */}
      {state === 'processing' && ingredients.length > 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 items-center z-20">
          {ingredients.map((ingredient, index) => (
            <motion.div
              key={`${ingredient.strain}-token-${index}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.1,
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-medium bg-[#D4AF37]/20 text-[#D4AF37] backdrop-blur-sm"
            >
              {ingredient.strain}
            </motion.div>
          ))}
        </div>
      )}

      {/* State label (for debugging/demo) */}
      {state !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.5, y: 0 }}
          className="mt-4 text-[10px] uppercase tracking-wider text-white/40"
        >
          {state === 'listening' && 'Listening...'}
          {state === 'analyzing' && 'Analyzing...'}
          {state === 'processing' && 'Blending...'}
        </motion.div>
      )}
    </div>
  );
}
