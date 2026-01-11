import { motion } from 'motion/react';
import { forwardRef } from 'react';
import { getStrainColor, getStrainGlow } from '../../utils/strainColors';

interface StrainCardProps {
  strain: string;
  category: 'Hybrid' | 'Indica' | 'Sativa';
  descriptor: string;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isHovered?: boolean;
  isDimmed?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

/**
 * InventoryCard / Strain
 * 
 * Individual strain card in the inventory tray.
 * When highlighted, displays strain-specific accent color (top border + glow).
 * Color token matches blend ring segment for visual traceability.
 */
export const StrainCard = forwardRef<HTMLButtonElement, StrainCardProps>(({
  strain,
  category,
  descriptor,
  isSelected = false,
  isHighlighted = false,
  isHovered = false,
  isDimmed = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
}, ref) => {
  const accentColor = getStrainColor(strain);
  const accentGlow = getStrainGlow(strain, 0.6);
  
  return (
    <motion.button
      ref={ref}
      type="button"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className="flex-shrink-0 relative"
      style={{
        width: '150px',
        height: '64px',
      }}
      animate={{
        y: isHovered ? -3 : 0,
        opacity: isDimmed ? 0.4 : 1,
      }}
      transition={{
        duration: 0.18,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Card background */}
      <div 
        className="absolute inset-0 rounded-[14px] transition-all duration-[180ms]"
        style={{
          background: 'rgba(28, 32, 35, 0.6)',
          boxShadow: isHovered 
            ? '0 6px 18px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
            : '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      />

      {/* Strain-specific accent indicator - Top border when highlighted */}
      {isHighlighted && (
        <div 
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[14px]"
          style={{
            background: accentColor,
            boxShadow: `0 0 12px ${accentGlow}`,
          }}
        />
      )}

      {/* Hover inner glow */}
      {isHovered && (
        <div 
          className="absolute inset-0 rounded-[14px] pointer-events-none"
          style={{
            background: 'rgba(212, 175, 55, 0.08)',
          }}
        />
      )}

      {/* Highlighted state - Full outline + glow (FRAME A) */}
      {isHighlighted && (
        <div 
          className="absolute inset-0 rounded-[14px] pointer-events-none"
          style={{
            boxShadow: `inset 0 0 0 1px ${accentGlow}, 0 0 16px ${accentGlow}`,
          }}
        />
      )}

      {/* Selection ring (deprecated - use isHighlighted instead) */}
      {isSelected && !isHighlighted && (
        <div 
          className="absolute inset-0 rounded-[14px] pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 0 1.5px rgba(212, 175, 55, 0.5)',
          }}
        />
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-3.5">
        {/* Category */}
        <div 
          className="text-[8px] uppercase tracking-[0.12em] mb-1 font-medium"
          style={{
            color: category === 'Sativa' 
              ? 'rgba(251, 191, 36, 0.7)' 
              : category === 'Indica' 
              ? 'rgba(139, 92, 246, 0.7)' 
              : 'rgba(212, 175, 55, 0.7)'
          }}
        >
          {category}
        </div>

        {/* Strain name */}
        <div className="text-sm font-light text-white/90 mb-0.5 leading-tight">
          {strain}
        </div>

        {/* Descriptor */}
        <div className="text-[10px] font-light text-white/40 leading-snug">
          {descriptor}
        </div>

        {/* Accent indicator dot - Bottom right when highlighted */}
        {isHighlighted && (
          <div 
            className="absolute bottom-2 right-2 w-2 h-2 rounded-full"
            style={{
              background: accentColor,
              boxShadow: `0 0 8px ${accentGlow}`,
            }}
          />
        )}
      </div>
    </motion.button>
  );
});

StrainCard.displayName = 'StrainCard';