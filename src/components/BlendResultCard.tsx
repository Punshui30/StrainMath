import { motion } from 'motion/react';
import type { BlendRecommendation } from '../types/blend';
import { getRoleColor } from '../utils/roleColors';

interface BlendResultCardProps {
  blend: BlendRecommendation;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

/**
 * BlendResultCard
 * 
 * FRAME C: blend_output
 * Individual recommendation card that appears after blending is complete.
 * Part of the three-card recommendation set.
 * Uses strain color tokens for visual correlation with ring segments.
 */
export function BlendResultCard({ blend, isSelected, onSelect, index }: BlendResultCardProps) {
  // Safeguard: Ensure blend has required properties
  if (!blend || !blend.components) {
    return null;
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={onSelect}
      className={`relative group w-80 p-8 rounded-3xl backdrop-blur-2xl
                 transition-all duration-200 ease-out
                 ${isSelected
          ? 'bg-gradient-to-br from-white/[0.14] to-white/[0.08] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.4),0_16px_48px_rgba(0,0,0,0.5)]'
          : 'bg-gradient-to-br from-white/[0.06] to-white/[0.03] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] hover:shadow-[inset_0_0_0_1px_rgba(212,175,55,0.2),0_12px_32px_rgba(0,0,0,0.4)]'
        }`}
    >
      {/* Name & Descriptor */}
      <div className="mb-8">
        <h3 className="text-2xl font-light text-white/95 mb-3 tracking-tight">
          {blend.name}
        </h3>
        <p className="text-sm text-white/50 leading-relaxed font-light">
          {blend.vibeEmphasis}
        </p>
      </div>

      {/* Confidence Range Pill */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div
          className="px-3 py-1 rounded-full text-xs font-light"
          style={{
            background: 'rgba(212, 175, 55, 0.12)',
            color: 'rgba(212, 175, 55, 0.9)',
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
                <span className="text-white/70 font-light">{component.name}</span>
                <span className="text-white/40 text-[10px] uppercase tracking-wider">
                  {component.role}
                </span>
              </div>
              <span className="text-white/50 font-light tabular-nums">{component.percentage}%</span>
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