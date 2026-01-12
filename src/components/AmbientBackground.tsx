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
      {/* Main ambient image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: opacity,
          filter: 'blur(8px) brightness(0.6) contrast(0.9)',
        }}
      />

      {/* Heavy vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.9) 100%)',
        }}
      />

      {/* Grain texture - reduced opacity for cleaner look */}
      <div
        className="absolute inset-0 opacity-[0.008]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
        }}
      />
    </motion.div>
  );
}
