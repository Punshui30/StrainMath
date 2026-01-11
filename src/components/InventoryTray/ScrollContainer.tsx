import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { StrainCard } from './StrainCard';

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

interface ScrollContainerProps {
  selectedStrains?: string[];
  highlightedStrains?: string[];
  onStrainHover?: (strain: string | null) => void;
  onStrainSelect?: (strain: string) => void;
}

export interface ScrollContainerHandle {
  scrollToCenter: (strainNames: string[]) => Promise<void>;
  getStrainPosition: (strainName: string) => DOMRect | null;
}

/**
 * InventoryTray / ScrollContainer
 * 
 * Horizontal scroll container for strain inventory.
 * Exposes methods to programmatically center strain cards.
 */
export const ScrollContainer = forwardRef<ScrollContainerHandle, ScrollContainerProps>(({
  selectedStrains = [],
  highlightedStrains = [],
  onStrainHover,
  onStrainSelect,
}, ref) => {
  const [hoveredStrain, setHoveredStrain] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useImperativeHandle(ref, () => ({
    scrollToCenter: async (strainNames: string[]) => {
      if (strainNames.length === 0 || !scrollRef.current) return;

      const cardElements = strainNames
        .map(name => cardRefs.current.get(name))
        .filter((el): el is HTMLButtonElement => el !== undefined);

      if (cardElements.length === 0) return;

      const container = scrollRef.current;
      const containerRect = container.getBoundingClientRect();

      // Calculate geometric center of all selected cards
      const leftmost = Math.min(...cardElements.map(el => el.offsetLeft));
      const rightmost = Math.max(...cardElements.map(el => el.offsetLeft + el.offsetWidth));
      const groupCenter = (leftmost + rightmost) / 2;

      // Scroll to center the group
      const scrollLeft = groupCenter - (containerRect.width / 2);

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });

      // Wait for scroll animation to complete
      return new Promise((resolve) => {
        setTimeout(resolve, 700); // 600ms scroll + 100ms settle
      });
    },
    getStrainPosition: (strainName: string) => {
      const cardElement = cardRefs.current.get(strainName);
      if (cardElement) {
        return cardElement.getBoundingClientRect();
      }
      return null;
    }
  }));

  const handleMouseEnter = (strain: string) => {
    setHoveredStrain(strain);
    onStrainHover?.(strain);
  };

  const handleMouseLeave = () => {
    setHoveredStrain(null);
    onStrainHover?.(null);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10"
      style={{ height: '120px' }}>
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

        {/* Inventory Rail Container */}
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
            className="flex gap-1.5 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {inventoryItems.map((item) => (
              <StrainCard
                key={item.id}
                strain={item.strain}
                category={item.category}
                descriptor={item.descriptor}
                isSelected={selectedStrains.includes(item.strain)}
                isHighlighted={highlightedStrains.includes(item.strain)}
                isHovered={hoveredStrain === item.strain}
                isDimmed={highlightedStrains.length > 0 && !highlightedStrains.includes(item.strain)}
                onMouseEnter={() => handleMouseEnter(item.strain)}
                onMouseLeave={handleMouseLeave}
                onClick={() => onStrainSelect?.(item.strain)}
                ref={(el) => {
                  if (el) {
                    cardRefs.current.set(item.strain, el);
                  }
                }}
              />
            ))}
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

ScrollContainer.displayName = 'ScrollContainer';
