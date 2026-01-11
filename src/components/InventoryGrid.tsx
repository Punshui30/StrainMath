import { motion } from 'framer-motion';

type VoiceState = 'idle' | 'listening' | 'analyzing' | 'resolved' | 'assembling' | 'committed';

interface InventoryGridProps {
  state: VoiceState;
}

// Complete inventory - what's available
const allCultivars = [
  { id: 1, name: 'Blue Dream', type: 'Hybrid', profile: 'Sativa Lean', selected: false },
  { id: 2, name: 'Northern Lights', type: 'Indica', profile: 'Caryophyllene', selected: false },
  { id: 3, name: 'Blueberry', type: 'Indica', profile: 'Caryophyllene', selected: false },
  { id: 4, name: 'Green Crack', type: 'Sativa', profile: 'Energizing', selected: false },
  { id: 5, name: 'OG Kush', type: 'Hybrid', profile: 'Balanced', selected: false },
  { id: 6, name: 'Jack Herer', type: 'Sativa', profile: 'Uplifting', selected: false },
  { id: 7, name: 'Durban Poison', type: 'Sativa', profile: 'Focus', selected: false },
  { id: 8, name: 'Granddaddy Purple', type: 'Indica', profile: 'Relaxing', selected: false },
];

export function InventoryGrid({ state }: InventoryGridProps) {
  // Which cultivars are selected for the blend
  const selectedIds = [1, 2, 3]; // Blue Dream, Northern Lights, Blueberry

  return (
    <div className="w-full h-full px-12 pt-8 pb-12 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-[11px] uppercase tracking-[0.25em] text-white/30 font-medium">
          Available Inventory
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {allCultivars.map((cultivar) => {
          const isSelected = selectedIds.includes(cultivar.id);
          const shouldDim = state === 'analyzing' && !isSelected;

          return (
            <motion.div
              key={cultivar.id}
              whileHover={!shouldDim ? {
                y: -4,
              } : {}}
              transition={{
                duration: 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`
                relative p-6 rounded-2xl backdrop-blur-2xl
                transition-all duration-700 ease-out cursor-pointer
                ${shouldDim ? 'opacity-20 scale-95' : 'opacity-100 scale-100'}
                ${isSelected && state === 'analyzing' 
                  ? 'bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(20,184,166,0.3),0_0_30px_rgba(20,184,166,0.15)]' 
                  : 'bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] hover:bg-white/[0.06] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),0_8px_24px_rgba(0,0,0,0.3)]'
                }
              `}
            >
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3 font-medium">
                {cultivar.type}
              </div>
              <div className="text-base text-white/90 mb-2 font-light">
                {cultivar.name}
              </div>
              <div className="text-xs text-white/40 font-light">{cultivar.profile}</div>

              {/* Selection indicator during analysis */}
              {isSelected && state === 'analyzing' && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-teal-400 rounded-full shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
