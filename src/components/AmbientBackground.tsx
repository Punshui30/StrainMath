import { motion } from 'motion/react';

interface AmbientBackgroundProps {
  imageUrl: string;
  opacity?: number;
}

export function AmbientBackground({ imageUrl, opacity = 0.06 }: AmbientBackgroundProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Main ambient image - disabled for true black background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0,  // Fully transparent - no gray lift
        }}
      />
    </motion.div>
  );
}
