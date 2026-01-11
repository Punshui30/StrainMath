import { motion } from 'motion/react';
import { useState, useRef, useImperativeHandle, forwardRef } from 'react';

interface InventoryItem {
  id: number;
  strain: string;
  category: 'Hybrid' | 'Indica' | 'Sativa';
  descriptor: string;
}

const inventoryItems: InventoryItem[] = [
  { id: 1, strain: 'Blue Dream', category: 'Hybrid', descriptor: 'Balanced euphoria' },
  { id: 2, strain: 'Northern Lights', category: 'Indica', descriptor: 'Deep relaxation' },
  { id: 3, strain: 'Blueberry', category: 'Indica', descriptor: 'Sweet calm' },
  { id: 4, strain: 'Sour Diesel', category: 'Sativa', descriptor: 'Energizing focus' },
  { id: 5, strain: 'OG Kush', category: 'Hybrid', descriptor: 'Classic balance' },
  { id: 6, strain: 'Girl Scout Cookies', category: 'Hybrid', descriptor: 'Happy uplift' },
  { id: 7, strain: 'Granddaddy Purple', category: 'Indica', descriptor: 'Heavy body' },
  { id: 8, strain: 'Jack Herer', category: 'Sativa', descriptor: 'Clear energy' },
  { id: 9, strain: 'White Widow', category: 'Hybrid', descriptor: 'Bright focus' },
  { id: 10, strain: 'Amnesia Haze', category: 'Sativa', descriptor: 'Uplifting buzz' },
];

interface InventoryTrayProps {
  selectedItems?: number[];
  onItemHover?: (id: number | null) => void;
  onItemSelect?: (id: number) => void;
  highlightedItems?: number[];
}

export interface InventoryTrayHandle {
  scrollToStrain: (strainName: string) => Promise<void>;
  scrollToStrains: (strainNames: string[]) => Promise<void>;
  getStrainCardPosition: (strainName: string) => DOMRect | null;
}

export const InventoryTray = forwardRef<InventoryTrayHandle, InventoryTrayProps>(({ 
  selectedItems = [], 
  onItemHover, 
  onItemSelect,
  highlightedItems = []
}, ref) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    scrollToStrain: async (strainName: string) => {
      const cardElement = cardRefs.current.get(strainName);
      if (cardElement && scrollRef.current) {
        const container = scrollRef.current;
        const cardRect = cardElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calculate scroll position to center the card
        const scrollLeft = cardElement.offsetLeft - (containerRect.width / 2) + (cardRect.width / 2);
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });

        // Wait for scroll to complete
        return new Promise((resolve) => {
          setTimeout(resolve, 400); // Allow time for smooth scroll
        });
      }
    },
    scrollToStrains: async (strainNames: string[]) => {
      if (strainNames.length === 0 || !scrollRef.current) return;

      // Find all card elements
      const cardElements = strainNames
        .map(name => cardRefs.current.get(name))
        .filter((el): el is HTMLButtonElement => el !== undefined);

      if (cardElements.length === 0) return;

      const container = scrollRef.current;
      const containerRect = container.getBoundingClientRect();

      // Calculate the leftmost and rightmost positions
      const leftmost = Math.min(...cardElements.map(el => el.offsetLeft));
      const rightmost = Math.max(...cardElements.map(el => el.offsetLeft + el.offsetWidth));
      
      // Calculate center point of all cards
      const groupCenter = (leftmost + rightmost) / 2;
      
      // Scroll to center the group
      const scrollLeft = groupCenter - (containerRect.width / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });

      // Wait for scroll animation to complete (600ms for smooth scroll + 100ms settle)
      return new Promise((resolve) => {
        setTimeout(resolve, 700);
      });
    },
    getStrainCardPosition: (strainName: string) => {
      const cardElement = cardRefs.current.get(strainName);
      if (cardElement) {
        return cardElement.getBoundingClientRect();
      }
      return null;
    }
  }));

  const handleMouseEnter = (id: number) => {
    setHoveredId(id);
    onItemHover?.(id);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    onItemHover?.(null);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10"
         style={{
           height: '96px',
         }}>
      {/* Soft top gradient divider */}
      <div 
        className="absolute top-0 left-0 right-0 h-8 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)'
        }}
      />

      {/* Tray Material */}
      <div 
        className="relative h-full backdrop-blur-[14px]"
        style={{
          background: 'rgba(18, 20, 22, 0.55)',
          boxShadow: '0 -8px 24px rgba(0,0,0,0.35)',
        }}
      >
        {/* Subtle grain overlay */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Inventory Rail Container - 16px top, 16px bottom padding = 64px content */}
        <div className="relative h-full px-6 pt-4 pb-4 flex items-center">
          {/* Left fade mask */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-10"
            style={{
              background: 'linear-gradient(90deg, rgba(18, 20, 22, 0.8) 0%, transparent 100%)'
            }}
          />

          {/* Horizontal scroll rail */}
          <div 
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {inventoryItems.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              const isHighlighted = highlightedItems.includes(item.id);
              const isHovered = hoveredId === item.id;
              const isDimmed = highlightedItems.length > 0 && !isHighlighted;

              return (
                <motion.button
                  key={item.id}
                  ref={(el) => {
                    if (el) {
                      cardRefs.current.set(item.strain, el);
                    }
                  }}
                  type="button"
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => onItemSelect?.(item.id)}
                  className="flex-shrink-0 relative"
                  style={{
                    width: '150px',
                    height: '64px',
                  }}
                  animate={{
                    y: isHovered ? -3 : 0,
                    opacity: isDimmed ? 0.4 : 1,
                  }}
                  transition={{
                    duration: 0.18,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* Card background */}
                  <div 
                    className="absolute inset-0 rounded-[14px] transition-all duration-[180ms]"
                    style={{
                      background: 'rgba(28, 32, 35, 0.6)',
                      boxShadow: isHovered 
                        ? '0 6px 18px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
                        : '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
                    }}
                  />

                  {/* Hover inner glow */}
                  {isHovered && (
                    <div 
                      className="absolute inset-0 rounded-[14px] pointer-events-none"
                      style={{
                        background: 'rgba(212, 175, 55, 0.08)',
                      }}
                    />
                  )}

                  {/* Selection ring */}
                  {isSelected && (
                    <div 
                      className="absolute inset-0 rounded-[14px] pointer-events-none"
                      style={{
                        boxShadow: 'inset 0 0 0 1.5px rgba(212, 175, 55, 0.5)',
                      }}
                    />
                  )}

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-center px-3.5">
                    {/* Category */}
                    <div 
                      className="text-[8px] uppercase tracking-[0.12em] mb-1 font-medium"
                      style={{
                        color: item.category === 'Sativa' 
                          ? 'rgba(251, 191, 36, 0.7)' 
                          : item.category === 'Indica' 
                          ? 'rgba(139, 92, 246, 0.7)' 
                          : 'rgba(212, 175, 55, 0.7)'
                      }}
                    >
                      {item.category}
                    </div>

                    {/* Strain name */}
                    <div className="text-sm font-light text-white/90 mb-0.5 leading-tight">
                      {item.strain}
                    </div>

                    {/* Descriptor */}
                    <div className="text-[10px] font-light text-white/40 leading-snug">
                      {item.descriptor}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right fade mask */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-10"
            style={{
              background: 'linear-gradient(270deg, rgba(18, 20, 22, 0.8) 0%, transparent 100%)'
            }}
          />
        </div>
      </div>
    </div>
  );
});

InventoryTray.displayName = 'InventoryTray';