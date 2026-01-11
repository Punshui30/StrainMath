import { motion } from 'motion/react';
import type { IngredientCard } from '../types/blend';

interface SafeTileAnimationProps {
    cards: IngredientCard[];
}

export function SafeTileAnimation({ cards }: SafeTileAnimationProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-12 pointer-events-none">
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
                {cards.map((card, index) => (
                    <motion.div
                        key={`${card.strain}-${index}`}
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{
                            duration: 0.4,
                            delay: index * 0.08, // Staggered index-based delay
                            ease: "easeOut"
                        }}
                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl min-w-[140px]"
                    >
                        {/* Strain Type Indicator */}
                        <div
                            className="w-2 h-2 rounded-full mb-3"
                            style={{ backgroundColor: card.color || '#D4AF37' }}
                        />

                        {/* Strain Name */}
                        <span className="text-sm font-medium text-white/90 text-center leading-tight">
                            {card.strain}
                        </span>

                        {/* Percentage (Optional, adds realism) */}
                        {card.percentage && (
                            <span className="text-[10px] text-white/40 mt-1 font-mono">
                                {Math.round(card.percentage * 100)}%
                            </span>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
