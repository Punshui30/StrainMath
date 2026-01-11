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
        width: '190px',
        height: '88px',
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
        className="absolute inset-0 rounded-[18px] transition-all duration-[180ms]"
        style={{
          background: 'rgba(28, 32, 35, 0.6)',
          boxShadow: isHovered
            ? '0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
            : '0 6px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      />

      {/* Strain-specific accent indicator - Top border when highlighted */}
      {isHighlighted && (
        <div
          className="absolute top-0 left-0 right-0 h-[4px] rounded-t-[18px]"
          style={{
            background: accentColor,
            boxShadow: `0 0 16px ${accentGlow}`,
          }}
        />
      )}

      {/* Hover inner glow */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-[18px] pointer-events-none"
          style={{
            background: 'rgba(212, 175, 55, 0.08)',
          }}
        />
      )}

      {/* Highlighted state - Full outline + glow (FRAME A) */}
      {isHighlighted && (
        <div
          className="absolute inset-0 rounded-[18px] pointer-events-none"
          style={{
            boxShadow: `inset 0 0 0 1px ${accentGlow}, 0 0 20px ${accentGlow}`,
          }}
        />
      )}

      {/* Selection ring (deprecated - use isHighlighted instead) */}
      {isSelected && !isHighlighted && (
        <div
          className="absolute inset-0 rounded-[18px] pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 0 1.5px rgba(212, 175, 55, 0.5)',
          }}
        />
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-4.5">
        {/* Category */}
        <div
          className="text-[10px] uppercase tracking-[0.14em] mb-1.5 font-medium"
          style={{
            color: category === 'Sativa'
              ? 'rgba(251, 191, 36, 0.8)'
              : category === 'Indica'
                ? 'rgba(139, 92, 246, 0.8)'
                : 'rgba(212, 175, 55, 0.8)'
          }}
        >
          {category}
        </div>

        {/* Strain name */}
        <div className="text-lg font-light text-white/95 mb-1 leading-tight tracking-tight">
          {strain}
        </div>

        {/* Descriptor */}
        <div className="text-[12px] font-light text-white/50 leading-snug">
          {descriptor}
        </div>

        {/* Accent indicator dot - Bottom right when highlighted */}
        {isHighlighted && (
          <div
            className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full"
            style={{
              background: accentColor,
              boxShadow: `0 0 10px ${accentGlow}`,
            }}
          />
        )}
      </div>
    </motion.button>
  );
});

StrainCard.displayName = 'StrainCard';