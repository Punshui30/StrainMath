import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '../assets/logo.png';
import { BlendResultCard } from './BlendResultCard';

interface BusinessWalkthroughProps {
    onClose: () => void;
    onEnterConsole: () => void;
}

export function BusinessWalkthrough({ onClose, onEnterConsole }: BusinessWalkthroughProps) {
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(prev => prev + 1);

    // Mock data for Step 3
    const sampleBlend = {
        id: 1,
        name: "Golden Hour Bloom",
        vibeEmphasis: "Euphoric & Socially Focused",
        confidenceRange: "96%",
        isPrimary: true,
        components: [
            { name: "White Gummy", role: "Driver", percentage: 50, type: "Hybrid" },
            { name: "Blue Dream", role: "Modulator", percentage: 30, type: "Sativa" },
            { name: "OG Kush", role: "Anchor", percentage: 20, type: "Indica" }
        ],
        targets: { focus: 0.8, creativity: 0.7, energy: 0.6 }
    };

    return (
        <div className="fixed inset-0 bg-[#0A0A0B] z-[200] flex flex-col items-center justify-center p-6 overflow-hidden">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="max-w-3xl w-full text-center px-4"
                    >
                        <img src={logoImage} alt="GO LINE" className="w-16 md:w-20 h-auto mx-auto mb-10 md:mb-12 opacity-90"
                            style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.3))' }} />
                        <h1 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight">
                            GO Line™ Business Walkthrough
                        </h1>
                        <p className="text-lg md:text-xl text-[#D4AF37] font-medium mb-8 tracking-wide">
                            Turn inventory into outcomes — automatically.
                        </p>
                        <p className="text-base md:text-lg text-white/40 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
                            This walkthrough shows how GO Line helps dispensaries increase cart size, improve sell-through, and build customer loyalty using outcome-based blends.
                        </p>
                        <button
                            onClick={nextStep}
                            className="w-full md:w-auto px-12 py-5 rounded-2xl bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-sm
                         hover:bg-[#E5C05B] transition-all shadow-[0_10px_40px_rgba(212,175,55,0.2)] active:scale-95"
                        >
                            Begin Walkthrough
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-4xl w-full text-center px-4"
                    >
                        <div className="mb-16 md:mb-20 flex flex-wrap justify-center items-center gap-6 md:gap-12">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <span className="text-xl md:text-2xl">🗣️</span>
                                </div>
                                <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40">Outcome</span>
                            </div>
                            <div className="hidden md:block w-12 h-[1px] bg-white/10" />
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin-slow" />
                                </div>
                                <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-[#D4AF37]/60">Blend Engine</span>
                            </div>
                            <div className="hidden md:block w-12 h-[1px] bg-white/10" />
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <span className="text-xl md:text-2xl">📦</span>
                                </div>
                                <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40">Inventory</span>
                            </div>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-light text-white mb-8 md:mb-12 tracking-tight max-w-2xl mx-auto leading-tight">
                            Customers describe what they want to feel.
                        </h2>
                        <p className="text-base md:text-xl text-white/40 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
                            GO Line translates that intent into optimized blends using your existing inventory.
                        </p>
                        <button
                            onClick={nextStep}
                            className="w-full md:w-auto px-12 py-4 rounded-xl border border-white/20 text-white/80 hover:bg-white/5 uppercase tracking-widest text-xs transition-all"
                        >
                            Continue
                        </button>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-4xl w-full flex flex-col items-center"
                    >
                        <div className="mb-12 transform scale-110">
                            <BlendResultCard
                                blend={sampleBlend as any}
                                isSelected={true}
                                onSelect={() => { }}
                                index={0}
                            />
                        </div>
                        <h2 className="text-3xl font-light text-white mb-6 tracking-tight text-center">
                            Each recommendation is a custom blend — designed for consistency, not guesswork.
                        </h2>
                        <button
                            onClick={nextStep}
                            className="px-12 py-4 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/5 uppercase tracking-widest text-xs transition-all"
                        >
                            Next: Business Impact
                        </button>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="max-w-5xl w-full"
                    >
                        <div className="text-center mb-12 md:mb-16 px-4">
                            <h2 className="text-[10px] md:text-xs font-bold text-[#D4AF37] uppercase tracking-[0.4em] mb-4">BUSINESS IMPACT</h2>
                            <h1 className="text-3xl md:text-5xl font-light text-white mb-6 tracking-tight">GO Line turns inventory into outcomes.</h1>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16 px-4">
                            {[
                                { t: "Increased cart size", d: "Blends average 23% higher ticket value" },
                                { t: "Higher retention", d: "Outcome-based shopping builds loyalty" },
                                { t: "Better sell-through", d: "Turn slow inventory into custom blends" },
                                { t: "White-label ready", d: "Brand it as your own expertise" }
                            ].map((impact, i) => (
                                <div key={i} className="p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/20 transition-colors">
                                    <h3 className="text-lg md:text-xl font-medium text-white mb-2">{impact.t}</h3>
                                    <p className="text-white/40 text-sm md:text-base font-light leading-relaxed">{impact.d}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center px-4">
                            <button
                                onClick={nextStep}
                                className="w-full md:w-auto px-12 py-5 rounded-2xl bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-sm shadow-[0_10px_40px_rgba(212,175,55,0.25)]"
                            >
                                Proceed to Operator Console
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 5 && (
                    <motion.div
                        key="step5"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-3xl w-full text-center px-4"
                    >
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-10 md:mb-12">
                            <span className="text-3xl md:text-4xl">🛠️</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">Operator Console</h1>
                        <p className="text-lg md:text-xl text-white/40 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
                            This is where operators manage inventory, system modes, and live usage.
                        </p>
                        <div className="flex flex-col items-center gap-6">
                            <button
                                onClick={onEnterConsole}
                                className="w-full md:w-auto px-12 py-5 rounded-2xl bg-white/10 border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:bg-white/20 transition-all active:scale-95"
                            >
                                Explore Console
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="text-xs text-white/20 hover:text-white/50 uppercase tracking-widest transition-colors"
                            >
                                Restart Walkthrough
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Close button for all steps */}
            <button
                onClick={onClose}
                className="fixed top-8 right-8 text-white/20 hover:text-white/60 transition-colors z-[210]"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
