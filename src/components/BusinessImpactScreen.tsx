import { motion } from 'framer-motion';
import logoImage from '../assets/logo.png';

interface BusinessImpactScreenProps {
    onRestart: () => void;
    onSchedule: () => void;
}

export function BusinessImpactScreen({ onRestart, onSchedule }: BusinessImpactScreenProps) {
    const impacts = [
        {
            title: "Increased cart size",
            description: "Blends average 23% higher ticket value"
        },
        {
            title: "Higher retention",
            description: "Outcome-based shopping builds loyalty"
        },
        {
            title: "Better sell-through",
            description: "Turn slow inventory into custom blends"
        },
        {
            title: "White-label ready",
            description: "Brand it as your own expertise"
        }
    ];

    return (
        <div className="fixed inset-0 bg-[#0A0A0B] z-[100] flex flex-col items-center justify-center p-8 overflow-y-auto">
            <div className="max-w-4xl w-full">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.img
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={logoImage}
                        alt="GO LINE"
                        className="w-16 h-auto mb-8"
                        style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.3))' }}
                    />
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.4em] mb-4"
                    >
                        BUSINESS IMPACT
                    </motion.h2>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight"
                    >
                        GO Line turns inventory into outcomes.
                    </motion.h1>
                </div>

                {/* Impact Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    {impacts.map((impact, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/30 transition-colors group"
                        >
                            <h3 className="text-xl font-medium text-white/95 mb-2 group-hover:text-white transition-colors">
                                {impact.title}
                            </h3>
                            <p className="text-white/50 font-light leading-relaxed">
                                {impact.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action Area */}
                <div className="flex flex-col items-center gap-6 border-t border-white/10 pt-12">
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        onClick={onSchedule}
                        className="px-12 py-5 rounded-2xl bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-sm
                       hover:bg-[#E5C05B] transition-all shadow-[0_10px_40px_rgba(212,175,55,0.2)] active:scale-95"
                    >
                        Schedule a dispensary walkthrough
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                        onClick={onRestart}
                        className="text-xs text-white/40 hover:text-white/70 uppercase tracking-[0.2em] transition-colors"
                    >
                        Restart Walkthrough
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
