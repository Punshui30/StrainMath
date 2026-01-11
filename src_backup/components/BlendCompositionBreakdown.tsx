import React from 'react';
import type { BlendCompositionBreakdownProps } from '../types';
import { TrendingUp, Gauge, Anchor } from 'lucide-react';

export function BlendCompositionBreakdown({
  components,
  confidenceRange,
  vibeEmphasis
}: BlendCompositionBreakdownProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-4 bg-rose-50 rounded-lg border border-rose-200">
          <TrendingUp className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-rose-900">Driver</span>
              <span className="text-lg font-bold text-rose-700">{components.driver.percentage}%</span>
            </div>
            <p className="text-sm text-rose-700 font-medium">{components.driver.strain.name}</p>
            <p className="text-xs text-rose-600 mt-1">{components.driver.strain.description}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <Gauge className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-amber-900">Modulator</span>
              <span className="text-lg font-bold text-amber-700">{components.modulator.percentage}%</span>
            </div>
            <p className="text-sm text-amber-700 font-medium">{components.modulator.strain.name}</p>
            <p className="text-xs text-amber-600 mt-1">{components.modulator.strain.description}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Anchor className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-blue-900">Anchor</span>
              <span className="text-lg font-bold text-blue-700">{components.anchor.percentage}%</span>
            </div>
            <p className="text-sm text-blue-700 font-medium">{components.anchor.strain.name}</p>
            <p className="text-xs text-blue-600 mt-1">{components.anchor.strain.description}</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <div className="text-sm font-semibold text-emerald-900 mb-2">Confidence Range</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-emerald-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
              style={{ width: `${confidenceRange.max}%` }}
            />
          </div>
          <span className="text-sm font-bold text-emerald-700">
            {confidenceRange.min}%-{confidenceRange.max}%
          </span>
        </div>
      </div>

      {vibeEmphasis && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm font-semibold text-gray-900 mb-1">Vibe Emphasis</div>
          <p className="text-sm text-gray-700">{vibeEmphasis}</p>
        </div>
      )}
    </div>
  );
}
