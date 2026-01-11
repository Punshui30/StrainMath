import React from 'react';
import type { BlendResultCardProps } from '../types';
import { BlendCompositionBreakdown } from './BlendCompositionBreakdown';
import { Check } from 'lucide-react';

export function BlendResultCard({
  blendOption,
  isActive,
  onSelect,
  onCommit
}: BlendResultCardProps) {
  return (
    <div
      className={`
        w-full max-w-md rounded-2xl overflow-hidden
        border-2 transition-all duration-300
        ${isActive ? 'border-emerald-500 shadow-2xl' : 'border-gray-200 shadow-lg'}
        bg-white
      `}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Blend Recommendation</h3>
          {isActive && (
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        <BlendCompositionBreakdown
          components={blendOption.components}
          confidenceRange={{
            min: blendOption.confidence_min,
            max: blendOption.confidence_max
          }}
          vibeEmphasis={blendOption.vibe_emphasis}
        />

        {blendOption.outcome_goals.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-900 mb-2">Your Goals</div>
            <div className="flex flex-wrap gap-2">
              {blendOption.outcome_goals.map((goal, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {!isActive && (
            <button
              onClick={() => onSelect(blendOption)}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors"
            >
              Select
            </button>
          )}
          {isActive && (
            <button
              onClick={() => onCommit(blendOption)}
              className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
            >
              Commit to Blend
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
