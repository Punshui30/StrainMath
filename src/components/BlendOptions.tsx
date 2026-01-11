import { motion } from 'motion/react';
import type { BlendRecommendation } from '../types/blend';

interface BlendOptionsProps {
  blends: BlendRecommendation[];
  selectedBlendId: number;
  onSelectBlend: (id: number) => void;
  onMakeBlend?: () => void;
}

export function BlendOptions({ blends, selectedBlendId, onSelectBlend, onMakeBlend }: BlendOptionsProps) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-6 justify-center mb-12">
        {blends.map((blend, index) => {
          const isSelected = blend.id === selectedBlendId;

          return (
            <motion.button
              key={blend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => onSelectBlend(blend.id)}
              className={`relative group w-80 p-8 rounded-3xl backdrop-blur-2xl
                         transition-all duration-200 ease-out
                         ${isSelected
                  ? 'bg-gradient-to-br from-white/[0.14] to-white/[0.08] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.4),0_16px_48px_rgba(0,0,0,0.5)]'
                  : 'bg-gradient-to-br from-white/[0.06] to-white/[0.03] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] hover:shadow-[inset_0_0_0_1px_rgba(212,175,55,0.2),0_12px_32px_rgba(0,0,0,0.4)]'
                }`}
            >
              {/* Ambient glow for selected - Gold */}
              {isSelected && (
                <div
                  className="absolute inset-0 blur-3xl opacity-20 rounded-3xl pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at top, rgba(212,175,55,0.4) 0%, transparent 70%)'
                  }}
                />
              )}

              <div className="relative z-10 text-left">
                {/* Blend Name */}
                <h3 className={`text-2xl font-light tracking-tight mb-3 transition-colors duration-200
                  ${isSelected ? 'text-white/95' : 'text-white/80 group-hover:text-white/90'}`}>
                  {blend.name}
                </h3>

                {/* Vibe Emphasis */}
                <p className={`text-sm font-light mb-6 leading-relaxed transition-colors duration-200
                  ${isSelected ? 'text-white/60' : 'text-white/40 group-hover:text-white/50'}`}>
                  {blend.vibeEmphasis}
                </p>

                {/* Divider */}
                <div className={`h-px mb-6 transition-colors duration-200
                  ${isSelected ? 'bg-white/15' : 'bg-white/8'}`} />

                {/* Components - Compact Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {blend.components.map((component) => (
                    <div key={component.id} className="text-center">
                      <div className={`text-xl font-light mb-1 transition-colors duration-200
                        ${isSelected ? 'text-white/85' : 'text-white/60 group-hover:text-white/70'}`}>
                        {component.percentage}<span className="text-xs">%</span>
                      </div>
                      <div className={`text-[9px] uppercase tracking-wider font-medium transition-colors duration-200
                        ${isSelected ? 'text-[#D4AF37]/80' : 'text-white/30 group-hover:text-[#D4AF37]/60'}`}>
                        {component.role}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Confidence Range */}
                <div className="flex items-baseline justify-between">
                  <div className="text-[9px] uppercase tracking-wider text-white/40 font-medium">
                    Confidence
                  </div>
                  <div className={`text-xl font-light tracking-tight transition-colors duration-200
                    ${isSelected ? 'text-[#D4AF37]/90' : 'text-[#D4AF37]/60 group-hover:text-[#D4AF37]/75'}`}>
                    {blend.confidenceRange}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {onMakeBlend && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          onClick={onMakeBlend}
          className="px-12 py-4 bg-gradient-to-r from-[#D4AF37]/90 to-[#B8941F]/90 
                     hover:from-[#D4AF37] hover:to-[#B8941F]
                     text-black text-sm uppercase tracking-wider font-medium
                     rounded-full transition-all duration-300
                     shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)]"
        >
          Make This Blend
        </motion.button>
      )}
    </div>
  );
}