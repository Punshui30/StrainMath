import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { StrainCard } from './StrainCard';



import { MOCK_COAS } from '../../../data/mockCoas';

const getCategory = (name: string): 'Hybrid' | 'Indica' | 'Sativa' => {
  const sativas = ['Sour Diesel', 'Maui Wowie', 'Amnesia Haze', 'Jack Herer', 'Green Crack', 'Durban Poison', 'Super Lemon Haze', 'Lemon Haze', 'Tangie', 'Clementine', 'Sour Tangie'];
  const indicas = ['Northern Lights', 'Blueberry', 'Granddaddy Purple', 'Bubba Kush', 'Purple Punch', 'Purple Haze', 'Skywalker OG', 'Master Kush', 'Death Star', 'LA Confidential', 'Slurricane', 'Ice Cream Cake', 'Animal Cookies', 'Critical Kush', 'Wedding Cake'];

  if (sativas.some(s => name.includes(s))) return 'Sativa';
  if (indicas.some(i => name.includes(i))) return 'Indica';
  return 'Hybrid';
};

const inventoryItems = MOCK_COAS.map((item, index) => {
  const name = item.strainName || (item as any)["strainNameContinue8:09 PM"] || "Unknown";
  const dominantTerp = item.terpenes && item.terpenes.length > 0 ? item.terpenes[0] : null;

  return {
    id: index + 1,
    strain: name,
    category: getCategory(name),
    descriptor: dominantTerp ? `${dominantTerp.name} ${dominantTerp.percentage}%` : 'Balanced profile',
    coa: item
  };
});

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
          {/* Live Menu Label */}
          <div className="absolute top-2 left-6 pointer-events-none z-20">
            <div className="flex items-center gap-3">
              <span className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-bold">
                LIVE MENU
              </span>
              <span className="text-[8px] text-[#D4AF37]/40 font-mono px-1.5 py-0.5 rounded border border-[#D4AF37]/20 uppercase">
                v1.0.1
              </span>
            </div>
          </div>

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
                coa={item.coa}
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
