import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function SystemEvaluationAnimation() {
    const [particles, setParticles] = useState<number[]>([]);

    useEffect(() => {
        // Generate particles
        const count = 12;
        setParticles(Array.from({ length: count }, (_, i) => i));
    }, []);

    return (
        <div className="absolute inset-x-0 bottom-0 h-64 pointer-events-none overflow-hidden z-50">
            {/* Fast Scan Line */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                    duration: 1.5,
                    ease: "linear",
                    repeat: Infinity,
                    repeatDelay: 0.5
                }}
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_40px_rgba(212,175,55,0.8)]"
            />

            {/* Flying "Generic" Cards */}
            {particles.map((i) => (
                <motion.div
                    key={i}
                    initial={{ y: 0, opacity: 0, x: `${Math.random() * 80 + 10}%` }}
                    animate={{
                        y: -400,
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.8]
                    }}
                    transition={{
                        duration: 2,
                        delay: i * 0.15,
                        ease: "easeOut"
                    }}
                    className="absolute bottom-10 w-12 h-16 rounded bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                />
            ))}

            {/* Abstract Grid/Noise Effect */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30" />
        </div>
    );
}
