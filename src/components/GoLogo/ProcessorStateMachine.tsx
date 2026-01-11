import { motion } from 'motion/react';
import logoImage from '../../assets/logo.png';
import type { AnimationState } from '../../types/animationStates';

interface ProcessorStateMachineProps {
  state: AnimationState;
  cardsArrived?: number;
  totalCards?: number;
  isInterpreting?: boolean;
}

/**
 * ProcessorStateMachine
 * 
 * Logo with state-based visual feedback.
 * - STATE 0: Idle/breathing
 * - STATE 1: Analyzing (subtle glow)
 * - STATE 2: Pulses on each card arrival (incremental intensity)
 * - STATE 3: Emit glow (ready to output)
 */
export function ProcessorStateMachine({
  state,
  cardsArrived = 0,
  totalCards = 0,
  isInterpreting = false
}: ProcessorStateMachineProps) {

  const getGlowIntensity = () => {
    if (isInterpreting) return 0.8;
    switch (state) {
      case 'STATE_0_IDLE':
        return 0.2;
      case 'STATE_1_INVENTORY_ALIGNED':
        return 0.4;
      case 'STATE_2_INGREDIENT_LIFT':
        // Incremental glow as cards arrive
        return 0.4 + (cardsArrived / totalCards) * 0.4; // 0.4 → 0.8
      case 'STATE_3_RECOMMENDATION_OUTPUT':
        return 0.9;
      default:
        return 0.2;
    }
  };

  const glowIntensity = getGlowIntensity();
  const isReceivingCards = state === 'STATE_2_INGREDIENT_LIFT';

  return (
    <div className="relative flex flex-col items-center">
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 blur-3xl -z-10"
        animate={{
          opacity: glowIntensity,
          scale: isReceivingCards ? [1, 1.15, 1] : 1,
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: {
            duration: 0.4,
            repeat: isReceivingCards ? Infinity : 0,
            repeatDelay: 0.3,
          }
        }}
        style={{
          background: `radial-gradient(circle, rgba(212,175,55,${glowIntensity}) 0%, transparent 70%)`,
        }}
      />

      {/* Logo */}
      <motion.img
        src={logoImage}
        alt="GO LINE"
        className="w-64 h-auto relative z-10"
        animate={{
          scale: isReceivingCards ? [1, 1.08, 1] : 1,
          filter: `drop-shadow(0 0 ${24 + glowIntensity * 40}px rgba(212,175,55,${glowIntensity}))`
        }}
        transition={{
          scale: {
            duration: 0.4,
            repeat: isReceivingCards ? Infinity : 0,
            repeatDelay: 0.3,
          },
          filter: { duration: 0.3 },
        }}
      />

      {/* Card arrival counter (debug/visual feedback) */}
      {isReceivingCards && totalCards > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="mt-4 text-[10px] uppercase tracking-wider text-white/40 font-medium"
        >
          {cardsArrived} / {totalCards} received
        </motion.div>
      )}

      {/* State label */}
      {(state !== 'STATE_0_IDLE' || isInterpreting) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.4, y: 0 }}
          className="mt-2 text-[9px] uppercase tracking-[0.15em] text-white/30 font-medium"
        >
          {isInterpreting && 'Thinking...'}
          {!isInterpreting && state === 'STATE_1_INVENTORY_ALIGNED' && 'Analyzing...'}
          {!isInterpreting && state === 'STATE_2_INGREDIENT_LIFT' && 'Receiving...'}
          {!isInterpreting && state === 'STATE_3_RECOMMENDATION_OUTPUT' && 'Complete'}
        </motion.div>
      )}
    </div>
  );
}
