import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

type CardPhase = 'flying-to-logo' | 'docked-in-logo' | 'flying-to-blend' | 'completed';

interface AnimatedCard {
  strain: string;
  role: string;
  category: 'Hybrid' | 'Indica' | 'Sativa';
  percentage: number;
  startPosition: { x: number; y: number };
  targetBlendIndex: number;
}

interface AnimatedCardsProps {
  cards: AnimatedCard[];
  logoPosition: { x: number; y: number };
  blendCardPositions: Array<{ x: number; y: number }>;
  onPhaseComplete: () => void;
}

export function AnimatedCards({ cards, logoPosition, blendCardPositions, onPhaseComplete }: AnimatedCardsProps) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [phase, setPhase] = useState<CardPhase>('flying-to-logo');

  useEffect(() => {
    if (cards.length === 0) return;

    // Phase 1: Sequential flight to logo
    if (phase === 'flying-to-logo') {
      const timer = setTimeout(() => {
        if (activeCardIndex < cards.length - 1) {
          setActiveCardIndex(activeCardIndex + 1);
        } else {
          // All cards have reached logo, enter docked phase
          setPhase('docked-in-logo');
        }
      }, 175); // faster: ~2x speed (per-card)
      return () => clearTimeout(timer);
    }

    // Phase 2: Processing pause
    if (phase === 'docked-in-logo') {
      const timer = setTimeout(() => {
        setPhase('flying-to-blend');
        setActiveCardIndex(0);
      }, 200); // faster: ~2x speed (processing pause)
      return () => clearTimeout(timer);
    }

    // Phase 3: Sequential flight to blend positions
    if (phase === 'flying-to-blend') {
      const timer = setTimeout(() => {
        if (activeCardIndex < cards.length - 1) {
          setActiveCardIndex(activeCardIndex + 1);
        } else {
          // All cards have reached blend positions
          setPhase('completed');
          setTimeout(() => {
            onPhaseComplete();
          }, 400); // Wait for last card to settle
        }
      }, 150); // faster: ~2x speed (per-card to blend)
      return () => clearTimeout(timer);
    }
  }, [activeCardIndex, phase, cards.length, onPhaseComplete]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Indica': return 'rgba(147, 51, 234, 0.3)';
      case 'Sativa': return 'rgba(239, 68, 68, 0.3)';
      case 'Hybrid': return 'rgba(34, 197, 94, 0.3)';
      default: return 'rgba(148, 163, 184, 0.3)';
    }
  };

  const getCategoryBorder = (category: string) => {
    switch (category) {
      case 'Indica': return 'rgba(147, 51, 234, 0.4)';
      case 'Sativa': return 'rgba(239, 68, 68, 0.4)';
      case 'Hybrid': return 'rgba(34, 197, 94, 0.4)';
      default: return 'rgba(148, 163, 184, 0.4)';
    }
  };

  return (
    <AnimatePresence>
      {cards.map((card, index) => {
        // Determine if this card should be visible based on phase and index
        const isActive = 
          (phase === 'flying-to-logo' && index <= activeCardIndex) ||
          (phase === 'docked-in-logo') ||
          (phase === 'flying-to-blend' && index <= activeCardIndex);

        if (!isActive) return null;

        // Calculate current position based on phase
        let targetX = logoPosition.x;
        let targetY = logoPosition.y;
        
        if (phase === 'flying-to-blend' || phase === 'completed') {
          const blendPos = blendCardPositions[card.targetBlendIndex];
          if (blendPos) {
            targetX = blendPos.x;
            targetY = blendPos.y;
          }
        }

        // Calculate scale for logo phase
        const targetScale = phase === 'docked-in-logo' ? 0.3 : 1;
        const targetOpacity = phase === 'completed' ? 0 : 1;

        return (
          <motion.div
            key={`animated-card-${card.strain}-${index}`}
            initial={{
              position: 'fixed',
              x: card.startPosition.x - 120, // Center the 240px card
              y: card.startPosition.y - 80,  // Center the 160px card
              scale: 1,
              opacity: 1,
              zIndex: 1000 + index,
            }}
            animate={{
              x: targetX - 120,
              y: targetY - 80,
              scale: targetScale,
              opacity: targetOpacity,
            }}
            transition={{
              duration: phase === 'flying-to-logo' ? 0.18 : 0.15, // ~2x faster
              ease: [0.2, 0.8, 0.2, 1], // sharper ease-out
            }}
            className="pointer-events-none"
            style={{
              width: '240px',
              height: '160px',
            }}
          >
            {/* Card Design - Matches Inventory Card */}
            <div
              className="w-full h-full rounded-2xl backdrop-blur-2xl p-5 flex flex-col justify-between"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                boxShadow: `inset 0 0 0 1px ${getCategoryBorder(card.category)}, 0 8px 24px rgba(0,0,0,0.4)`,
              }}
            >
              {/* Category Badge */}
              <div className="flex items-center gap-2">
                <div
                  className="px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-medium"
                  style={{
                    background: getCategoryColor(card.category),
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  {card.category}
                </div>
              </div>

              {/* Strain Name */}
              <div>
                <h4 className="text-lg font-light text-white/90 mb-1 tracking-tight">
                  {card.strain}
                </h4>
                <p className="text-[10px] uppercase tracking-wider text-[#D4AF37]/70 font-medium">
                  {card.role} • {card.percentage}%
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}
