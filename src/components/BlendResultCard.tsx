import { motion } from 'framer-motion';
import type { BlendRecommendation } from '../types/blend';
import { getRoleColor } from '../utils/roleColors';

interface BlendResultCardProps {
  blend: BlendRecommendation;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
  animationAnchor?: DOMRect | null;
}

export function BlendResultCard({ blend, isSelected, onSelect, index, animationAnchor }: BlendResultCardProps) {
  // Safeguard: Ensure blend has required properties
  if (!blend || !blend.components) {
    return null;
  }

  // If anchor exists, we simulate a trajectory from "tray" (bottom) "towards logo" (top-ish) then "settle"
  // y: [start, overshoot_towards_logo, final]
  const yKeyframes = animationAnchor
    ? [300, -40, 0] // Stronger pull upwards if we know where logo is
    : [100, 0];      // Fallback simple slide

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scrollBehavior: 'smooth', y: yKeyframes, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.19, 1, 0.22, 1], // Exponential ease out
        times: animationAnchor ? [0, 0.6, 1] : undefined
      }}
      onClick={onSelect}
      className={`relative group w-full max-w-[320px] p-8 rounded-3xl backdrop-blur-xl border border-white/5
                 transition-all duration-300 ease-out
                 ${isSelected
          ? 'bg-[#080808]/90 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(212,175,55,0.5)] scale-[1.02]'
          : 'bg-[#080808]/60 hover:bg-[#080808]/80 shadow-[0_10px_30px_rgba(0,0,0,0.4)]'
        }`}
    >
      {/* Name & Descriptor */}
      <div className="mb-8">
        <h3 className="text-2xl font-light text-white/95 mb-3 tracking-tight">
          {blend.name}
        </h3>
        <p className="text-sm text-white/70 leading-relaxed font-light">
          {blend.vibeEmphasis}
        </p>
      </div>

      {/* Confidence Range Pill */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div
          className="px-3 py-1 rounded-full text-xs font-light"
          style={{
            background: 'rgba(212, 175, 55, 0.2)',
            color: '#D4AF37',
          }}
        >
          {blend.confidenceRange} confidence
        </div>
      </div>

      {/* Component breakdown */}
      <div className="space-y-2 pt-6 border-t border-white/[0.08] mb-6">
        {blend.components.map((component) => {
          const roleColor = getRoleColor(component.role);

          return (
            <div key={component.name} className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                {/* Strain-specific color indicator - matches ring segment */}
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: roleColor,
                    boxShadow: `0 0 6px ${roleColor}80`,
                  }}
                />
                <span className="text-white/90 font-light">{component.name}</span>
                <span className="text-white/40 text-[10px] uppercase tracking-wider">
                  {component.role}
                </span>
              </div>
              <span className="text-white/70 font-light tabular-nums">{component.percentage}%</span>
            </div>
          );
        })}
      </div>

      {/* Circular Ring Visualization */}
      <div className="flex justify-center pt-4">
        <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
          {/* Background ring */}
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />

          {/* Colored segments */}
          {(() => {
            let currentAngle = 0;
            return blend.components.map((component) => {
              const roleColor = getRoleColor(component.role);
              const percentage = component.percentage;
              const segmentAngle = (percentage / 100) * 360;
              const radius = 52;
              const circumference = 2 * Math.PI * radius;
              const segmentLength = (segmentAngle / 360) * circumference;
              const offset = (currentAngle / 360) * circumference;

              currentAngle += segmentAngle;

              return (
                <circle
                  key={component.name}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={roleColor}
                  strokeWidth="8"
                  strokeDasharray={`${segmentLength} ${circumference}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  style={{
                    filter: `drop-shadow(0 0 4px ${roleColor}60)`,
                  }}
                />
              );
            });
          })()}
        </svg>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          layoutId="selection-indicator"
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full"
          style={{
            background: 'linear-gradient(90deg, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0.9) 50%, rgba(212,175,55,0.6) 100%)',
            boxShadow: '0 0 16px rgba(212,175,55,0.5)',
          }}
        />
      )}
    </motion.button>
  );
}
