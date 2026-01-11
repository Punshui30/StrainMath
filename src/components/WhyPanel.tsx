import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import type { BlendRecommendation } from '../types/blend';
import type { IntentVectors } from '../engine/scoring';

interface WhyPanelProps {
  isVisible: boolean;
  blend: BlendRecommendation;
  intent: IntentVectors | null;
}

export function WhyPanel({ isVisible, blend, intent }: WhyPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  // sort intent factors
  const topFactors = intent ? Object.entries(intent)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([key, val]) => ({ key: key.replace('_', ' '), val: Math.round((val as number) * 100) }))
    : [];

  return (
    <>
      {/* Collapsed Pill */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            type="button"
            onClick={() => setIsExpanded(true)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-8 bottom-8 z-20"
          >
            <div className="px-6 py-4 rounded-2xl backdrop-blur-xl bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.35)] hover:bg-white/[0.12] hover:shadow-[inset_0_0_0_1px_rgba(212,175,55,0.3),0_12px_50px_rgba(0,0,0,0.45)] transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="text-sm font-light text-white/80">
                  Blend Breakdown
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/70" />
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-8 top-1/2 -translate-y-1/2 z-20"
              style={{
                width: 'clamp(320px, 30vw, 380px)',
              }}
            >
              <div className="rounded-3xl backdrop-blur-2xl bg-[#121416]/95 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_24px_60px_rgba(0,0,0,0.5)] p-8">
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] transition-all duration-200 flex items-center justify-center text-white/50 hover:text-white/90"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>

                {/* Content */}
                <div className="space-y-8">
                  {/* Confidence */}
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-4 font-medium">
                      System Confidence
                    </div>
                    <div className="text-5xl font-light text-[#D4AF37]/90 tracking-tight">
                      {blend.confidenceRange}
                    </div>
                  </div>

                  {/* Architecture Breakdown */}
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-4 font-medium">
                      Architecture
                    </div>
                    <div className="flex flex-col gap-3">
                      {(blend?.components || []).map(comp => (
                        <div key={comp.name} className="flex items-center justify-between group">
                          <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                            {comp.name}
                          </span>
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded border ${comp.role === 'Driver'
                              ? 'border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/10'
                              : comp.role === 'Modulator'
                                ? 'border-blue-400/30 text-blue-400 bg-blue-400/10'
                                : 'border-white/20 text-white/40 bg-white/5'
                            }`}>
                            {comp.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Intent Drivers */}
                  {topFactors && topFactors.length > 0 && (
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-4 font-medium">
                        Targeting
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {topFactors.map(factor => (
                          <div key={factor.key} className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/5 flex items-center gap-2">
                            <span className="text-xs text-white/70 capitalize">{factor.key}</span>
                            <span className="text-[10px] text-white/40 font-mono">{factor.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}