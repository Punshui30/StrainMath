import React, { useRef, useEffect } from 'react';
import type { InventoryCardProps } from '../types';
import { Package } from 'lucide-react';

export function InventoryCard({
  strain,
  isSelected,
  isAnimating,
  onAnimationStart,
  onAnimationComplete
}: InventoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAnimating && cardRef.current && onAnimationStart) {
      onAnimationStart(cardRef.current);
    }
  }, [isAnimating, onAnimationStart]);

  return (
    <div
      ref={cardRef}
      data-strain-id={strain.id}
      className={`
        flex-shrink-0 w-64 h-80 rounded-xl overflow-hidden
        border-2 transition-all duration-300
        ${isSelected ? 'border-emerald-500 shadow-xl shadow-emerald-500/20' : 'border-gray-200'}
        ${isAnimating ? 'z-50' : 'z-0'}
        bg-white
      `}
    >
      <div className="h-full flex flex-col p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-emerald-50">
            <Package className="w-6 h-6 text-emerald-600" />
          </div>
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${strain.type === 'indica' ? 'bg-purple-100 text-purple-700' : ''}
            ${strain.type === 'sativa' ? 'bg-amber-100 text-amber-700' : ''}
            ${strain.type === 'hybrid' ? 'bg-blue-100 text-blue-700' : ''}
          `}>
            {strain.type}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{strain.name}</h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{strain.description}</p>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">THC</div>
            <div className="text-lg font-bold text-gray-900">{strain.thc_percentage}%</div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">CBD</div>
            <div className="text-lg font-bold text-gray-900">{strain.cbd_percentage}%</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {strain.effects.slice(0, 3).map(effect => (
            <span
              key={effect}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {effect}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">In stock:</span>
            <span className="font-medium text-gray-900">{strain.quantity_available}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
