import { motion } from 'motion/react';
import { useState } from 'react';

const blendComponents = [
  { 
    id: 1, 
    name: 'Blue Dream', 
    type: 'Hybrid', 
    role: 'Driver',
    profile: 'Sativa Lean', 
    percentage: 50,
    arcColor: 'from-[#14B8A6] to-[#5EEAD4]',
    terpenes: ['Myrcene', 'Pinene', 'Caryophyllene'],
    description: 'Provides the foundational mood elevation and mental clarity. High myrcene content drives physical relaxation while maintaining cognitive function.',
  },
  { 
    id: 2, 
    name: 'Northern Lights', 
    type: 'Indica', 
    role: 'Modulator',
    profile: 'Caryophyllene', 
    percentage: 30,
    arcColor: 'from-[#10B981] to-[#6EE7B7]',
    terpenes: ['Caryophyllene', 'Myrcene', 'Limonene'],
    description: 'Stabilizes the blend by reducing tension and anxiety through caryophyllene. Adds body-focused relaxation without sedation.',
  },
  { 
    id: 3, 
    name: 'Blueberry', 
    type: 'Indica', 
    role: 'Anchor',
    profile: 'Caryophyllene', 
    percentage: 20,
    arcColor: 'from-[#0891B2] to-[#67E8F9]',
    terpenes: ['Myrcene', 'Caryophyllene', 'Linalool'],
    description: 'Grounds the experience with gentle physical calm. Prevents overstimulation while supporting sustained relaxation.',
  },
];

export function BlendComposition() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);

  const detailComponent = blendComponents.find(c => c.id === detailId);

  return (
    <div className="w-full h-full px-12 pt-12 pb-8 relative">
      {/* Detail Panel Overlay */}
      {detailComponent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-50 flex items-center justify-center px-12 py-12"
          onClick={() => setDetailId(null)}
        >
          {/* Dimmed background */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Detail Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full p-12 rounded-3xl backdrop-blur-2xl
                       bg-gradient-to-br from-white/[0.12] to-white/[0.06]
                       shadow-[inset_0_0_0_1px_rgba(20,184,166,0.2),0_24px_48px_rgba(0,0,0,0.4)]"
          >
            {/* Type Label */}
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4 font-medium">
              {detailComponent.type}
            </div>

            {/* Name */}
            <h2 className="text-5xl text-white/95 font-light tracking-tight mb-3">
              {detailComponent.name}
            </h2>

            {/* Role */}
            <div className={`inline-block px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium mb-8
                            bg-gradient-to-r ${detailComponent.arcColor} text-black/80`}>
              {detailComponent.role}
            </div>

            {/* Percentage */}
            <div className="mb-10">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2 font-medium">
                Contribution
              </div>
              <div className="text-7xl text-white/95 font-light tracking-tight">
                {detailComponent.percentage}<span className="text-4xl">%</span>
              </div>
            </div>

            {/* Terpenes */}
            <div className="mb-8">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4 font-medium">
                Key Terpenes
              </div>
              <div className="flex gap-3">
                {detailComponent.terpenes.map((terpene) => (
                  <div 
                    key={terpene}
                    className="px-4 py-2 bg-white/[0.04] rounded-full text-xs text-white/60 font-light
                               shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                  >
                    {terpene}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4 font-medium">
                Why it's here
              </div>
              <p className="text-sm text-white/60 leading-relaxed font-light">
                {detailComponent.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="mb-10">
        <h2 className="text-[11px] uppercase tracking-[0.25em] text-white/30 font-medium">
          Blend Composition
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {blendComponents.map((component, index) => (
          <motion.div
            key={component.id}
            initial={{ opacity: 0, y: -120, scale: 1.1 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
            }}
            whileHover={{
              y: -4,
            }}
            transition={{
              duration: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseEnter={() => setHoveredId(component.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setDetailId(component.id)}
            className={`relative p-8 rounded-2xl backdrop-blur-2xl cursor-pointer
                       transition-all duration-200 ease-out
                       ${hoveredId === component.id 
                         ? 'bg-gradient-to-br from-white/[0.14] to-white/[0.08] shadow-[inset_0_0_0_1px_rgba(20,184,166,0.25),0_12px_32px_rgba(0,0,0,0.4)]'
                         : 'bg-gradient-to-br from-white/[0.08] to-white/[0.03] shadow-[inset_0_0_0_1px_rgba(20,184,166,0.15),0_8px_32px_rgba(0,0,0,0.3)]'
                       }
                       overflow-hidden`}
            style={{
              animationDelay: `${index * 0.25}s`,
            }}
          >
            {/* Subtle ambient glow - brighter on hover */}
            <div 
              className={`absolute inset-0 blur-2xl transition-opacity duration-200 ${
                hoveredId === component.id ? 'opacity-30' : 'opacity-20'
              }`}
              style={{
                background: `radial-gradient(circle at top right, rgba(20,184,166,0.3) 0%, transparent 60%)`
              }}
            />

            <div className="relative z-10">
              {/* Type Label */}
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4 font-medium">
                {component.type}
              </div>

              {/* Cultivar Name */}
              <div className="text-xl text-white/95 mb-2 font-light tracking-tight">
                {component.name}
              </div>

              {/* Profile */}
              <div className="text-xs text-white/40 mb-6 font-light">
                {component.profile}
              </div>

              {/* Role & Percentage */}
              <div className="flex items-baseline justify-between pt-6 border-t border-white/10">
                <div 
                  className="text-[10px] uppercase tracking-[0.2em] font-medium transition-opacity duration-200"
                  style={{ 
                    color: hoveredId === component.id ? '#00FFE5' : '#00FFE5',
                    opacity: hoveredId === component.id ? 1.0 : 0.8
                  }}
                >
                  {component.role}
                </div>
                <div 
                  className="text-4xl font-light tracking-tight transition-opacity duration-200"
                  style={{ 
                    color: hoveredId === component.id ? '#00FFE5' : '#00FFE5',
                    opacity: hoveredId === component.id ? 1.0 : 0.9
                  }}
                >
                  {component.percentage}<span className="text-2xl">%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
