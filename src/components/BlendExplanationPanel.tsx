import { motion } from 'framer-motion';
import type { BlendRecommendation } from '../types/blend';
import type { IntentVectors } from '../engine/scoring';

interface BlendExplanationPanelProps {
    blend: BlendRecommendation;
    intent: IntentVectors | null;
    explanation: string | null;
    userText: string;
    onProceed: () => void;
    onCancel: () => void;
}

export function BlendExplanationPanel({
    blend,
    intent,
    explanation,
    userText,
    onProceed,
    onCancel
}: BlendExplanationPanelProps) {

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onCancel}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[300]"
            />

            {/* Panel */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 flex items-center justify-center z-[301] pointer-events-none"
            >
                <div className="w-full max-w-2xl mx-8 p-12 rounded-3xl backdrop-blur-2xl bg-[#0a0a0a]/95 
                        shadow-[inset_0_0_0_1px_rgba(212,175,55,0.2),0_24px_80px_rgba(0,0,0,0.6)]
                        pointer-events-auto">

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-light text-white/95 mb-2 tracking-tight">
                            {blend.name}
                        </h2>
                        <div className="text-sm text-[#D4AF37]/80 uppercase tracking-[0.2em]">
                            Why We Chose This Blend
                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="mb-10 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                        {explanation ? (
                            <p className="text-lg leading-relaxed text-white/80 font-light whitespace-pre-line">
                                {explanation}
                            </p>
                        ) : (
                            <p className="text-lg leading-relaxed text-white/60 font-light italic">
                                This blend was selected based on available inventory and general wellness principles.
                            </p>
                        )}
                    </div>

                    {/* Confidence Badge */}
                    <div className="mb-8 flex justify-center">
                        <div className="px-6 py-3 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                            <span className="text-[#D4AF37] font-medium text-sm uppercase tracking-wider">
                                {blend.confidenceRange} confidence
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10
                         border border-white/10 hover:border-white/20
                         text-white/60 hover:text-white/90 text-sm uppercase tracking-wider
                         transition-all duration-200"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={onProceed}
                            className="flex-[2] py-4 rounded-2xl
                         bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10
                         hover:from-[#D4AF37]/30 hover:to-[#D4AF37]/20
                         border border-[#D4AF37]/40 hover:border-[#D4AF37]/60
                         text-white hover:text-white text-base uppercase tracking-wider font-medium
                         shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:shadow-[0_0_40px_rgba(212,175,55,0.25)]
                         transition-all duration-300
                         hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Proceed to Calculator
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
