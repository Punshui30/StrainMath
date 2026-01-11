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
    const restart = () => setStep(1);

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
            {/* Progress Indicator */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                    <div
                        key={s}
                        className={`h-1 rounded-full transition-all duration-500 ${s <= step ? 'w-8 bg-[#D4AF37]' : 'w-4 bg-white/10'
                            }`}
                    />
                ))}
            </div>

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
                        <p className="text-base md:text-lg text-white/40 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
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
                        <p className="text-base md:text-xl text-white/40 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
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
                        className="max-w-4xl w-full flex flex-col items-center px-4"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.4em] mb-4">CUSTOMER EXPERIENCE</h2>
                            <p className="text-base text-white/40 font-medium">How shoppers interact with GO Line</p>
                        </div>
                        <div className="mb-12 transform scale-90 md:scale-110">
                            <BlendResultCard
                                blend={sampleBlend as any}
                                isSelected={true}
                                onSelect={() => { }}
                                index={0}
                            />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-light text-white mb-8 tracking-tight text-center leading-tight">
                            Each recommendation is a custom blend — designed for consistency, not guesswork.
                        </h2>
                        <button
                            onClick={nextStep}
                            className="w-full md:w-auto px-12 py-4 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/5 uppercase tracking-widest text-xs transition-all"
                        >
                            Next: Operator Experience
                        </button>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="max-w-5xl w-full flex flex-col items-center px-4"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.4em] mb-4">OPERATOR EXPERIENCE</h2>
                            <h1 className="text-3xl md:text-5xl font-light text-white mb-6">Staff manage intent at scale.</h1>
                        </div>

                        <div className="w-full aspect-video rounded-2xl bg-white/[0.02] border border-white/10 mb-12 flex flex-col overflow-hidden relative">
                            <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                                <div className="w-2 h-2 rounded-full bg-white/10" />
                                <div className="w-2 h-2 rounded-full bg-white/10" />
                                <div className="w-2 h-2 rounded-full bg-white/10" />
                            </div>
                            <div className="flex-1 p-6 flex gap-6">
                                <div className="w-40 h-full bg-white/[0.03] rounded-lg border border-white/5 p-4 space-y-3">
                                    <div className="h-2 w-12 bg-white/10 rounded-full" />
                                    <div className="h-2 w-full bg-white/5 rounded-full" />
                                    <div className="h-2 w-full bg-white/5 rounded-full" />
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className="h-12 w-full bg-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/10" />
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-32 bg-white/[0.03] rounded-xl border border-white/5" />
                                        <div className="h-32 bg-white/[0.03] rounded-xl border border-white/5" />
                                        <div className="h-32 bg-white/[0.03] rounded-xl border border-white/5" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[10px] uppercase tracking-widest text-[#D4AF37]/60 font-medium">
                                Live Inventory Awareness & System Modes
                            </div>
                        </div>

                        <p className="text-lg text-white/40 font-medium leading-relaxed mb-12 max-w-2xl mx-auto text-center">
                            The Operator Console provides a curated view of inventory, system states, and live usage—ensuring your staff stay in control.
                        </p>

                        <button
                            onClick={nextStep}
                            className="w-full md:w-auto px-12 py-4 rounded-xl border border-white/20 text-white/80 hover:bg-white/5 uppercase tracking-widest text-xs transition-all"
                        >
                            Continue to Impact
                        </button>
                    </motion.div>
                )}

                {step === 5 && (
                    <motion.div
                        key="step5"
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
                                    <p className="text-white/40 text-sm md:text-base font-medium leading-relaxed">{impact.d}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center px-4">
                            <button
                                onClick={nextStep}
                                className="w-full md:w-auto px-12 py-5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-bold uppercase tracking-widest text-sm hover:bg-[#D4AF37]/20 transition-all"
                            >
                                Continue to Conclusion
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 6 && (
                    <motion.div
                        key="step6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-3xl w-full text-center px-4"
                    >
                        <h1 className="text-5xl md:text-6xl font-light text-white mb-8 tracking-tight">That’s GO Line.</h1>
                        <p className="text-xl text-white font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
                            GO Line turns everyday inventory into consistent, outcome-driven experiences — for customers and operators alike.
                        </p>

                        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 text-left max-w-2xl mx-auto mb-12">
                            <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-6">What we demonstrated:</h3>
                            <ul className="space-y-4">
                                {[
                                    "Outcome-based recommendations",
                                    "Custom blends from existing inventory",
                                    "Increased cart size and sell-through",
                                    "White-label flexibility"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 items-center text-white/70 font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={nextStep}
                            className="w-full md:w-auto px-12 py-5 rounded-2xl bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-sm"
                        >
                            See Next Actions
                        </button>
                    </motion.div>
                )}

                {step === 7 && (
                    <motion.div
                        key="step7"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-3xl w-full text-center px-4"
                    >
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-10 md:mb-12">
                            <span className="text-3xl md:text-4xl">🚀</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">Ready to get started?</h1>
                        <p className="text-lg md:text-xl text-white/40 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
                            The walkthrough is complete. Choose your next step below.
                        </p>
                        <div className="flex flex-col items-center gap-6">
                            <button
                                onClick={() => window.open('https://calendly.com/golinesystems', '_blank')}
                                className="w-full md:w-auto px-12 py-5 rounded-2xl bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-sm shadow-[0_10px_40px_rgba(212,175,55,0.25)]"
                            >
                                Schedule a dispensary walkthrough
                            </button>

                            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                <button
                                    onClick={onEnterConsole}
                                    className="px-8 py-4 rounded-xl border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                                >
                                    Explore Business Console
                                </button>
                                <button
                                    onClick={restart}
                                    className="px-8 py-4 rounded-xl border border-white/10 text-white/40 font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                                >
                                    Restart Walkthrough
                                </button>
                            </div>
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
