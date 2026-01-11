import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { IngredientCard } from '../types/animationStates';
import { ANIMATION_TIMINGS } from '../types/animationStates';

interface IngredientCardLiftingProps {
  ingredient: IngredientCard;
  startPosition: DOMRect;
  logoPosition: DOMRect;
  isLifting: boolean;
  onArrival: () => void;
}

/**
 * IngredientCardLifting
 * 
 * STATE 2: Single card that lifts from inventory to logo.
 * - Animates from REAL DOM position (not a proxy)
 * - Takes 250-350ms (configurable)
 * - Scale down to 0.92 during flight
 * - Strain name remains readable
 * - Triggers onArrival when complete
 */
export function IngredientCardLifting({ 
  ingredient, 
  startPosition, 
  logoPosition,
  isLifting,
  onArrival 
}: IngredientCardLiftingProps) {
  const hasCalledArrival = useRef(false);

  useEffect(() => {
    if (isLifting && !hasCalledArrival.current) {
      hasCalledArrival.current = true;
      const timer = setTimeout(() => {
        onArrival();
      }, ANIMATION_TIMINGS.CARD_LIFT_DURATION);
      
      return () => clearTimeout(timer);
    }
  }, [isLifting, onArrival]);

  if (!isLifting) return null;

  // Calculate arc path
  const startX = startPosition.left + startPosition.width / 2;
  const startY = startPosition.top + startPosition.height / 2;
  const endX = logoPosition.left + logoPosition.width / 2;
  const endY = logoPosition.top + logoPosition.height / 2;

  // Arc control point (curved path)
  const controlX = (startX + endX) / 2;
  const controlY = Math.min(startY, endY) - 60; // Arc upward

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      style={{
        left: startX,
        top: startY,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
      }}
      animate={{
        x: endX - startX,
        y: endY - startY,
        scale: 0.92,
        opacity: hasCalledArrival.current ? 0 : 1,
      }}
      transition={{
        duration: ANIMATION_TIMINGS.CARD_LIFT_DURATION / 1000,
        ease: [0.22, 1, 0.36, 1],
        x: {
          duration: ANIMATION_TIMINGS.CARD_LIFT_DURATION / 1000,
          ease: [0.22, 1, 0.36, 1],
        },
        y: {
          duration: ANIMATION_TIMINGS.CARD_LIFT_DURATION / 1000,
          ease: [0.34, 1.2, 0.64, 1], // Slight bounce at end
        },
      }}
    >
      {/* Card replica */}
      <div 
        className="px-4 py-2 rounded-xl backdrop-blur-xl"
        style={{
          background: 'rgba(28, 32, 35, 0.85)',
          boxShadow: `0 0 24px ${ingredient.color}80, inset 0 0 0 1px ${ingredient.color}60`,
          width: '150px',
        }}
      >
        <div className="text-sm font-light text-white/90 text-center">
          {ingredient.strain}
        </div>
        <div 
          className="text-[10px] uppercase tracking-wider text-center mt-1 font-medium"
          style={{ color: ingredient.color }}
        >
          {ingredient.role}
        </div>
      </div>

      {/* Glow trail */}
      <div 
        className="absolute inset-0 blur-2xl opacity-60 -z-10"
        style={{
          background: `radial-gradient(circle, ${ingredient.color}60 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}
