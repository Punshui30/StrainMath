import { motion } from 'framer-motion';
import logoImage from '../assets/logo.png';
import { CircularVisualization } from './CircularVisualization';
import { TapToSpeakArrows } from './TapToSpeakArrows';
import type { BlendRecommendation } from '../types/blend';

type VoiceState = 'idle' | 'listening' | 'analyzing' | 'resolved' | 'assembling' | 'committed';

interface VoiceInterfaceProps {
  state: VoiceState;
  onActivate: () => void;
  onReset: () => void;
  selectedBlend?: BlendRecommendation;
  isProcessing?: boolean; // New prop for logo processing state
}

export function VoiceInterface({ state, onActivate, selectedBlend }: VoiceInterfaceProps) {
  return (
    <div className="w-full h-full flex items-center justify-center px-12 py-16">
      <div className="flex flex-col items-center max-w-2xl w-full">
        {/* Visualization - Always Glass-Enhanced */}
        <div className="mb-10">
          {state === 'resolved' && selectedBlend ? (
            // Live Instrument - Updates with blend changes
            <CircularVisualization
              blendName={selectedBlend.name}
              components={selectedBlend.components}
            />
          ) : (
            // Logo States - Structured with clear zones
            <div className="relative flex flex-col items-center w-full">
              {/* ZONE 1: Logo + Arrows Interaction Zone */}
              <motion.div
                animate={{
                  y: state === 'idle' ? 8 : 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col items-center"
              >
                <button
                  onClick={onActivate}
                  disabled={state !== 'idle'}
                  className={`relative w-64 h-64 flex items-center justify-center transition-all duration-300 ease-out group
                    ${state === 'idle'
                      ? 'cursor-pointer'
                      : 'cursor-default'
                    }
                  `}
                >
                  {/* Breathing ambient glow for listening state */}
                  {state === 'listening' && (
                    <motion.div
                      className="absolute inset-0 rounded-full blur-[100px]"
                      style={{
                        background: 'radial-gradient(circle, rgba(212,175,55,0.7) 0%, rgba(212,175,55,0.3) 40%, transparent 70%)',
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 0.9, 0.6],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}

                  {/* Analyzing pulse - Multiple layers */}
                  {state === 'analyzing' && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full blur-[80px]"
                        style={{
                          background: 'radial-gradient(circle, rgba(212,175,55,0.8) 0%, rgba(212,175,55,0.4) 50%, transparent 70%)',
                        }}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full blur-[120px]"
                        style={{
                          background: 'radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 60%)',
                        }}
                        animate={{
                          scale: [1.3, 1, 1.3],
                          opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.75,
                        }}
                      />
                    </>
                  )}

                  {/* Assembling state - Success glow */}
                  {(state === 'assembling' || state === 'committed') && (
                    <motion.div
                      className="absolute inset-0 rounded-full blur-[100px]"
                      style={{
                        background: 'radial-gradient(circle, rgba(212,175,55,0.9) 0%, rgba(212,175,55,0.4) 50%, transparent 70%)',
                      }}
                      animate={{
                        scale: state === 'committed' ? [1, 1.4, 1.2] : [1, 1.2, 1],
                        opacity: state === 'committed' ? [0.8, 1, 0.6] : [0.6, 0.8, 0.6],
                      }}
                      transition={{
                        duration: state === 'committed' ? 2 : 1.2,
                        repeat: state === 'committed' ? 0 : Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}

                  {/* Idle subtle glow */}
                  {state === 'idle' && (
                    <motion.div
                      className="absolute inset-0 rounded-full blur-[60px] opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                      style={{
                        background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 60%)',
                      }}
                    />
                  )}

                  {/* Logo with breathing animation when listening */}
                  <motion.img
                    src={logoImage}
                    alt="GO LINE Logo"
                    className="relative z-10 w-56 h-auto"
                    animate={state === 'listening' ? {
                      scale: [1, 1.08, 1],
                      filter: [
                        'drop-shadow(0 0 30px rgba(212,175,55,0.6)) drop-shadow(0 0 60px rgba(212,175,55,0.3))',
                        'drop-shadow(0 0 50px rgba(212,175,55,0.9)) drop-shadow(0 0 100px rgba(212,175,55,0.5))',
                        'drop-shadow(0 0 30px rgba(212,175,55,0.6)) drop-shadow(0 0 60px rgba(212,175,55,0.3))',
                      ],
                    } : state === 'analyzing' ? {
                      scale: [1, 1.05, 1],
                      filter: [
                        'drop-shadow(0 0 40px rgba(212,175,55,0.7)) drop-shadow(0 0 80px rgba(212,175,55,0.4))',
                        'drop-shadow(0 0 60px rgba(212,175,55,1)) drop-shadow(0 0 120px rgba(212,175,55,0.6))',
                        'drop-shadow(0 0 40px rgba(212,175,55,0.7)) drop-shadow(0 0 80px rgba(212,175,55,0.4))',
                      ],
                    } : (state === 'assembling' || state === 'committed') ? {
                      scale: state === 'committed' ? 1.1 : 1.05,
                      filter: 'drop-shadow(0 0 50px rgba(212,175,55,0.8)) drop-shadow(0 0 100px rgba(212,175,55,0.5))',
                    } : {
                      filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.3)) drop-shadow(0 0 40px rgba(212,175,55,0.15))',
                    }}
                    transition={{
                      duration: state === 'listening' ? 3 : state === 'committed' ? 1.5 : 1.5,
                      repeat: state === 'listening' || state === 'analyzing' || state === 'assembling' ? Infinity : 0,
                      ease: 'easeInOut',
                    }}
                    whileHover={state === 'idle' ? {
                      scale: 1.05,
                      filter: 'drop-shadow(0 0 40px rgba(212,175,55,0.5)) drop-shadow(0 0 80px rgba(212,175,55,0.3))',
                    } : {}}
                  />
                </button>

                {/* Tap to speak arrows - positioned below logo in idle state */}
                {state === 'idle' && (
                  <div className="mt-2">
                    <TapToSpeakArrows isVisible={true} />
                  </div>
                )}

                {/* Assembling/Complete status */}
                {state === 'assembling' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-sm text-[#D4AF37]/80 font-light tracking-wide"
                  >
                    Assembling blend...
                  </motion.div>
                )}

                {state === 'committed' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 text-base text-[#D4AF37]/90 font-medium tracking-wide"
                  >
                    Blend ready
                  </motion.div>
                )}
              </motion.div>
            </div>
          )}
        </div>

        {/* Vibe Match - Only show when resolved */}
        {state === 'resolved' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-10 text-center"
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3 font-medium">
              Vibe Match
            </div>
            <div className="text-xl text-white/75 font-light tracking-wide">
              {"Relaxed, alert, socially fluid"}
            </div>
          </motion.div>
        )}

        {/* ZONE 2: Status Copy - 12-16px below interaction zone */}
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-[11px] uppercase tracking-[0.3em] font-medium transition-colors duration-500 mb-4 ${state === 'resolved' || state === 'analyzing' ? 'text-[#D4AF37]/80' : 'text-white/30'
            }`}
        >
          {state === 'listening' ? 'Listening' : state === 'analyzing' ? 'Analyzing' : state === 'resolved' ? 'Interpretations' : state === 'assembling' ? 'Assembling' : state === 'committed' ? 'Complete' : 'Ready'}
        </motion.div>

        {/* ZONE 3: Text Entry Field - 12-16px below status copy, only in idle */}
        {state === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-md mb-4"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Or type what you're looking for..."
                className="w-full px-6 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white/80 placeholder:text-white/30 focus:bg-white/[0.06] focus:border-[#D4AF37]/30 focus:outline-none transition-all duration-300 text-sm font-light"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onActivate();
                  }
                }}
              />
              <button
                onClick={onActivate}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 text-[#D4AF37]/80 hover:text-[#D4AF37] text-xs font-medium transition-all duration-200"
              >
                Submit
              </button>
            </div>
          </motion.div>
        )}

        {/* Subtext - Only for active states */}
        {(state === 'analyzing' || state === 'listening') && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm max-w-lg text-center leading-relaxed font-light text-white/50"
          >
            "Relaxed but alert, no anxiety"
          </motion.p>
        )}
      </div>
    </div>
  );
}
