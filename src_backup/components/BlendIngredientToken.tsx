import React from 'react';
import type { BlendIngredientTokenProps } from '../types';

export function BlendIngredientToken({
  strain,
  role,
  percentage,
  isAnimatingIn
}: BlendIngredientTokenProps) {
  const roleColors = {
    driver: 'bg-rose-100 text-rose-700 border-rose-300',
    modulator: 'bg-amber-100 text-amber-700 border-amber-300',
    anchor: 'bg-blue-100 text-blue-700 border-blue-300'
  };

  const roleLabels = {
    driver: 'Driver',
    modulator: 'Modulator',
    anchor: 'Anchor'
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full border-2
        ${roleColors[role]}
        transition-all duration-500
        ${isAnimatingIn ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}
      `}
    >
      <span className="text-xs font-semibold uppercase">{roleLabels[role]}</span>
      <span className="text-sm font-bold">{strain.name}</span>
      <span className="text-sm font-medium">{percentage}%</span>
    </div>
  );
}
