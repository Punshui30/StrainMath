import { motion } from 'framer-motion';

interface TapToSpeakArrowsProps {
  isVisible: boolean;
}

export function TapToSpeakArrows({ isVisible }: TapToSpeakArrowsProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none">
      {[0, 1, 2].map((index) => (
        <motion.svg
          key={index}
          width="16"
          height="10"
          viewBox="0 0 16 10"
          fill="none"
          initial={{ opacity: 0, y: 3 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [3, 0, -3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: index * 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <path
            d="M1 9L8 2L15 9"
            stroke="rgba(212, 175, 55, 0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      ))}
    </div>
  );
}
