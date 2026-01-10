import React, { useRef, useEffect } from 'react';
import type { InventoryTrayProps } from '../types';
import { InventoryCard } from './InventoryCard';

export function InventoryTray({
  strains,
  scrollToStrainIds = [],
  onScrollComplete,
  isScrolling
}: InventoryTrayProps) {
  const trayRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (isScrolling && scrollToStrainIds.length > 0 && !hasScrolledRef.current && trayRef.current) {
      hasScrolledRef.current = true;

      const firstStrainId = scrollToStrainIds[0];
      const targetCard = trayRef.current.querySelector(`[data-strain-id="${firstStrainId}"]`);

      if (targetCard) {
        const trayRect = trayRef.current.getBoundingClientRect();
        const cardRect = targetCard.getBoundingClientRect();
        const scrollAmount = cardRect.left - trayRect.left - (trayRect.width / 2) + (cardRect.width / 2);

        trayRef.current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });

        setTimeout(() => {
          if (onScrollComplete) {
            onScrollComplete();
          }
        }, 800);
      }
    }
  }, [isScrolling, scrollToStrainIds, onScrollComplete]);

  useEffect(() => {
    if (!isScrolling) {
      hasScrolledRef.current = false;
    }
  }, [isScrolling]);

  return (
    <div
      ref={trayRef}
      className="flex gap-6 overflow-x-auto py-8 px-8 scrollbar-hide snap-x snap-mandatory"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {strains.map(strain => (
        <InventoryCard
          key={strain.id}
          strain={strain}
          isSelected={scrollToStrainIds.includes(strain.id)}
          isAnimating={false}
        />
      ))}
    </div>
  );
}
