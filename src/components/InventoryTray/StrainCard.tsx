import { motion, AnimatePresence } from 'framer-motion';
import { useState, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { getStrainColor, getStrainGlow } from '../../utils/strainColors';
import type { MockCOA } from '../../../data/mockCoas';

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
  coa?: MockCOA;
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
  coa,
}, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const accentColor = getStrainColor(strain);
  const accentGlow = getStrainGlow(strain, 0.6);

  return (
    <motion.button
      ref={ref}
      type="button"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => {
        setIsExpanded(true);
        onClick?.();
      }}
      className="flex-shrink-0 relative"
      style={{
        width: '190px',
        height: '88px',
      }}
      animate={{
        y: (isHovered && !isExpanded) ? -3 : 0,
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

      {/* Expanded Detail Overlay */}
      {isExpanded && coa && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsExpanded(false);
            }
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-[#1C2023]/95 border border-white/10 rounded-3xl overflow-y-auto shadow-2xl"
              style={{
                boxShadow: `0 0 40px ${accentGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
                maxHeight: '90vh',
              }}
            >
              {/* Header */}
              <div className="p-8 pb-4 flex justify-between items-start">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] font-medium mb-2"
                    style={{ color: accentColor }}>
                    {category} Full Profile
                  </div>
                  <h3 className="text-3xl font-light text-white tracking-tight">
                    {strain}
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className="p-2 rounded-full hover:bg-white/5 transition-colors"
                >
                  <X className="w-6 h-6 text-white/40" />
                </button>
              </div>

              {/* Stats Row */}
              <div className="px-8 flex gap-8 mb-8">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 mb-1">THC</span>
                  <span className="text-xl font-medium text-white/90">{coa.cannabinoids.thc}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 mb-1">CBD</span>
                  <span className="text-xl font-medium text-white/90">{coa.cannabinoids.cbd}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Total Terpenes</span>
                  <span className="text-xl font-medium text-white/90">{coa.totalTerpenes}%</span>
                </div>
              </div>

              {/* Terpenes List */}
              <div className="px-8 pb-8">
                <div className="text-[10px] uppercase tracking-widest text-white/30 mb-4 font-medium border-b border-white/5 pb-2">
                  Complete Terpene Analysis
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {coa.terpenes.map((terp: { name: string; percentage: number }, idx: number) => (
                    <div key={idx} className="flex justify-between items-center group">
                      <span className="text-sm font-light text-white/60 group-hover:text-white/80 transition-colors">
                        {terp.name}
                      </span>
                      <span className="text-sm font-medium text-white/90">
                        {terp.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accents */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: accentColor }} />
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </motion.button>
  );
});

StrainCard.displayName = 'StrainCard';
