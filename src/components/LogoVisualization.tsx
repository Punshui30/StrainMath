import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type VoiceState = 'idle' | 'listening' | 'analyzing' | 'resolved';

interface LogoVisualizationProps {
  state: VoiceState;
  size?: number;
}

export function LogoVisualization({ state, size = 200 }: LogoVisualizationProps) {
  const [pathLength, setPathLength] = useState(1);

  useEffect(() => {
    if (state === 'analyzing') {
      setPathLength(0);
    } else if (state === 'resolved') {
      setPathLength(1);
    }
  }, [state]);

  // Hexagon coordinates
  const hexSize = size * 0.35;
  const hexPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return {
      x: size / 2 + hexSize * Math.cos(angle),
      y: size / 2 + hexSize * Math.sin(angle),
    };
  });

  const hexPath = `M ${hexPoints.map((p) => `${p.x},${p.y}`).join(' L ')} Z`;

  // Parallelogram (left shape)
  const paraWidth = size * 0.3;
  const paraHeight = size * 0.28;
  const skew = size * 0.12;
  const paraX = size / 2 - hexSize - paraWidth * 0.7;
  const paraY = size / 2 - paraHeight / 2;

  const paraPath = `M ${paraX + skew},${paraY} L ${paraX + paraWidth + skew},${paraY} L ${
    paraX + paraWidth - skew
  },${paraY + paraHeight} L ${paraX - skew},${paraY + paraHeight} Z`;

  // Inner division lines
  const divisionPath = `M ${paraX + paraWidth / 2 + skew},${paraY} L ${paraX + paraWidth / 2 - skew},${
    paraY + paraHeight
  } M ${paraX + paraWidth / 2},${paraY + paraHeight / 2} L ${size / 2 - hexSize * 0.3},${size / 2}`;

  const strokeColor = state === 'resolved' ? '#D4A574' : state === 'analyzing' ? '#D4A574' : '#ffffff';
  const strokeWidth = 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        {/* Listening state: animated ring */}
        {state === 'listening' && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={size * 0.48}
            fill="none"
            stroke="#ffffff"
            strokeWidth={1}
            opacity={0.6}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Hexagon - right */}
        <motion.path
          d={hexPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          initial={{ pathLength: state === 'idle' ? 1 : 0 }}
          animate={{
            pathLength: state === 'analyzing' ? 1 : state === 'resolved' ? 1 : state === 'idle' ? 1 : 0,
          }}
          transition={{
            duration: state === 'analyzing' ? 2 : 0,
            ease: 'linear',
            delay: state === 'analyzing' ? 0 : 0,
          }}
        />

        {/* Parallelogram - left */}
        <motion.path
          d={paraPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          initial={{ pathLength: state === 'idle' ? 1 : 0 }}
          animate={{
            pathLength: state === 'analyzing' ? 1 : state === 'resolved' ? 1 : state === 'idle' ? 1 : 0,
          }}
          transition={{
            duration: state === 'analyzing' ? 2 : 0,
            ease: 'linear',
            delay: state === 'analyzing' ? 0.3 : 0,
          }}
        />

        {/* Division lines */}
        <motion.path
          d={divisionPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          initial={{ pathLength: state === 'idle' ? 1 : 0 }}
          animate={{
            pathLength: state === 'analyzing' ? 1 : state === 'resolved' ? 1 : state === 'idle' ? 1 : 0,
          }}
          transition={{
            duration: state === 'analyzing' ? 1.5 : 0,
            ease: 'linear',
            delay: state === 'analyzing' ? 0.6 : 0,
          }}
        />

        {/* Resolved state: endpoint glow */}
        {state === 'resolved' && (
          <>
            <circle cx={hexPoints[0].x} cy={hexPoints[0].y} r={3} fill="#D4A574">
              <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={paraX + skew} cy={paraY} r={3} fill="#D4A574">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}
