import { motion } from 'motion/react';
import type { BlendComponent } from '../data/blendRecommendations';
import { getStrainColor } from '../utils/strainColors';

interface CircularVisualizationProps {
  blendName: string;
  components: BlendComponent[];
}

/**
 * CircularVisualization
 * 
 * Blend ring with color-coded segments.
 * Each segment uses the strain's color token for visual correlation with strain cards.
 */
export function CircularVisualization({ blendName, components }: CircularVisualizationProps) {
  const size = 280;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Gap between segments (in percentage points)
  const gapPercentage = 2;
  const totalGaps = components.length * gapPercentage;
  const usablePercentage = 100 - totalGaps;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Ambient glow behind */}
      <div 
        className="absolute inset-0 blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)'
        }}
      />

      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        <defs>
          {/* Create gradient for each component using strain color */}
          {components.map((component, index) => {
            const baseColor = getStrainColor(component.name);
            const isAnchor = component.role.toLowerCase() === 'anchor';
            
            return (
              <linearGradient 
                key={`gradient-${component.id}-${index}`} 
                id={`gradient-${component.id}-${index}`}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor={isAnchor ? '#D4AF37' : baseColor} />
                <stop offset="100%" stopColor={isAnchor ? '#F4D365' : `${baseColor}CC`} />
              </linearGradient>
            );
          })}
        </defs>

        {components.map((component, index) => {
          // Calculate the adjusted percentage accounting for gaps
          const adjustedPercentage = (component.percentage / 100) * usablePercentage;
          
          // Calculate cumulative offset including gaps
          let cumulativeOffset = 0;
          for (let i = 0; i < index; i++) {
            const prevAdjusted = (components[i].percentage / 100) * usablePercentage;
            cumulativeOffset += prevAdjusted + gapPercentage;
          }
          
          const dashArray = `${(adjustedPercentage / 100) * circumference} ${circumference}`;
          const dashOffset = -((cumulativeOffset / 100) * circumference);
          
          // Determine stroke color and glow based on strain
          const isAnchor = component.role.toLowerCase() === 'anchor';
          const baseColor = getStrainColor(component.name);
          const strokeColor = `url(#gradient-${component.id}-${index})`;
          
          // Convert hex to rgba for glow
          const r = parseInt(baseColor.slice(1, 3), 16);
          const g = parseInt(baseColor.slice(3, 5), 16);
          const b = parseInt(baseColor.slice(5, 7), 16);
          const glowColor = isAnchor ? 'rgba(212,175,55,0.6)' : `rgba(${r},${g},${b},0.5)`;
          
          return (
            <motion.circle
              key={`${component.id}-${index}-${blendName}`}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeLinecap="round"
              opacity={0.85}
              initial={{ strokeDashoffset: -circumference, opacity: 0 }}
              animate={{ strokeDashoffset: dashOffset, opacity: 0.85 }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                filter: `drop-shadow(0 0 8px ${glowColor})`
              }}
            />
          );
        })}
      </svg>

      {/* Center - Minimal Label with Gold accent */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <motion.div 
          key={blendName}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]/70 font-medium"
        >
          Focus
        </motion.div>
      </div>
    </div>
  );
}