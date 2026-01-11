import { useState } from 'react';
import type { BlendRecommendation } from '../types/blend';
import { getStrainColor } from '../utils/strainColors';
import { ShareActions } from './ShareActions';

interface BlendCalculatorProps {
  blend: BlendRecommendation;
  alternateBlends: BlendRecommendation[];
  onSwitchBlend: (id: number) => void;
  onStartOver: () => void;
  onBack: () => void;
  onToggleQR: () => void;
}

type PreRollSize = 0.35 | 0.5 | 1.0 | number;
type WasteFactor = 0 | 0.03 | 0.05;

export function BlendCalculator({
  blend,
  alternateBlends,
  onSwitchBlend,
  onStartOver,
  onBack,
  onToggleQR
}: BlendCalculatorProps) {
  const [preRollSize, setPreRollSize] = useState<PreRollSize>(0.5);
  const [count, setCount] = useState(10);
  const [wasteFactor, setWasteFactor] = useState<WasteFactor>(0);
  const [customSize, setCustomSize] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const effectiveSize = isCustom && customSize ? parseFloat(customSize) : preRollSize;
  const totalMass = effectiveSize * count * (1 + wasteFactor);

  const calculateGrams = (percentage: number) => {
    return (percentage / 100) * totalMass;
  };

  const handleCountChange = (delta: number) => {
    setCount(Math.max(1, count + delta));
  };

  const handleSizeSelect = (size: PreRollSize | 'custom') => {
    if (size === 'custom') {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setPreRollSize(size as PreRollSize);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-12 py-6 md:py-8 overflow-y-auto h-full">
      {/* Alternate Interpretations Row */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-2 mb-3">
          <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-medium">
            Other Interpretations
          </div>
          <button
            onClick={onBack}
            className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors font-medium"
          >
            ← Back to Results
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-2">
          {alternateBlends.map((alt) => {
            const isActive = alt.id === blend.id;
            return (
              <button
                key={alt.id}
                type="button"
                onClick={() => onSwitchBlend(alt.id)}
                className={`px-5 py-2.5 rounded-xl backdrop-blur-xl transition-all duration-200 text-sm font-light whitespace-nowrap
                  ${isActive
                    ? 'bg-white/[0.12] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.4)] text-white/90'
                    : 'bg-white/[0.05] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] text-white/50 hover:bg-white/[0.08] hover:text-white/70'
                  }`}
              >
                {alt.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Calculator Card */}
      <div className="rounded-3xl backdrop-blur-2xl bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_20px_60px_rgba(0,0,0,0.4)] p-6 md:p-10 mb-20">
        {/* Top - Blend Info */}
        <div className="mb-8 pb-8 border-b border-white/[0.08]">
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-3 font-medium">
            Committed Blend
          </div>
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
            <h2 className="text-2xl md:text-3xl font-light text-white/95">{blend.name}</h2>
            <div className="text-sm text-[#D4AF37]/80 font-light">
              {blend.confidenceRange}
            </div>
          </div>
          <p className="text-sm text-white/50 font-light mt-2">{blend.vibeEmphasis}</p>
        </div>

        {/* Middle - Calculator Controls */}
        <div className="mb-10">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-5 font-medium">
            Configure Batch
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Size Selector */}
            <div className="space-y-4">
              <div className="text-xs text-white/50 font-light">Pre-roll Size</div>
              <div className="flex flex-wrap gap-2">
                {[0.35, 0.5, 1.0, 'custom'].map((size) => {
                  const isActive = size === 'custom' ? isCustom : !isCustom && preRollSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeSelect(size as PreRollSize | 'custom')}
                      className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-light transition-all duration-200
                        ${isActive
                          ? 'bg-[#D4AF37]/20 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.4)] text-[#D4AF37]/90'
                          : 'bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] text-white/60 hover:bg-white/[0.08]'
                        }`}
                    >
                      {size === 'custom' ? 'Custom' : `${size}g`}
                    </button>
                  );
                })}
              </div>
              {isCustom && (
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="Enter grams"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  className="w-full mt-2 px-3 py-2 rounded-lg bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] text-white/90 text-sm font-light placeholder:text-white/30 focus:outline-none focus:shadow-[inset_0_0_0_1px_rgba(212,175,55,0.3)]"
                />
              )}
            </div>

            {/* Count Stepper */}
            <div>
              <div className="text-xs text-white/50 mb-3 font-light">Quantity</div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCountChange(-1)}
                  className="w-10 h-10 rounded-lg bg-white/[0.06] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] text-white/70 hover:bg-white/[0.1] hover:text-white/90 transition-all duration-200 flex items-center justify-center text-lg"
                >
                  −
                </button>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-light text-white/90">{count}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">units</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCountChange(1)}
                  className="w-10 h-10 rounded-lg bg-white/[0.06] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] text-white/70 hover:bg-white/[0.1] hover:text-white/90 transition-all duration-200 flex items-center justify-center text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Waste Factor */}
            <div>
              <div className="text-xs text-white/50 mb-3 font-light">Waste Factor</div>
              <div className="flex gap-2">
                {[
                  { label: 'None', value: 0 },
                  { label: '+3%', value: 0.03 },
                  { label: '+5%', value: 0.05 },
                ].map((option) => {
                  const isActive = wasteFactor === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setWasteFactor(option.value as WasteFactor)}
                      className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-light transition-all duration-200
                        ${isActive
                          ? 'bg-[#D4AF37]/20 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.4)] text-[#D4AF37]/90'
                          : 'bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] text-white/60 hover:bg-white/[0.08]'
                        }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom - Results Table */}
        <div className="rounded-2xl backdrop-blur-xl bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] p-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-5 font-medium">
            Exact Measurements
          </div>

          <div className="space-y-4 mb-6">
            {blend.components.map((comp) => {
              const grams = calculateGrams(comp.percentage);
              const strainColor = getStrainColor(comp.name);

              return (
                <div key={comp.id} className="flex items-center justify-between group">
                  {/* Left: Role + Strain + Color Indicator */}
                  <div className="flex items-center gap-4">
                    {/* Color Indicator */}
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: strainColor,
                        boxShadow: `0 0 8px ${strainColor}80`
                      }}
                    />

                    {/* Role Label */}
                    <div
                      className="text-[10px] uppercase tracking-[0.15em] font-medium w-24"
                      style={{ color: strainColor }}
                    >
                      {comp.role}
                    </div>

                    {/* Strain Name */}
                    <div className="text-base font-light text-white/90">
                      {comp.name}
                    </div>
                  </div>

                  {/* Right: Gram Amount */}
                  <div className="text-xl font-light text-white/95 tabular-nums">
                    {grams.toFixed(2)}g
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="pt-4 border-t border-white/[0.08] flex items-baseline justify-between">
            <div className="text-xs text-white/50 font-light">
              Total batch: {count} × {effectiveSize.toFixed(2)}g
              {wasteFactor > 0 && ` (+${(wasteFactor * 100).toFixed(0)}% waste)`}
            </div>
            <div className="text-2xl font-light text-[#D4AF37]/90 tabular-nums">
              {totalMass.toFixed(2)}g
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 rounded-xl backdrop-blur-xl bg-white/[0.06] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] text-sm uppercase tracking-wider text-white/40 hover:text-white/70 hover:bg-white/[0.1] transition-all duration-300 font-medium"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onToggleQR}
          className="px-8 py-3 rounded-xl backdrop-blur-xl bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] text-sm uppercase tracking-wider text-white/60 hover:text-white/90 hover:bg-white/[0.08] transition-all duration-300 font-medium"
        >
          View QR
        </button>

        <button
          type="button"
          className="px-8 py-3 rounded-xl backdrop-blur-xl bg-[#D4AF37]/20 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.3),0_0_30px_rgba(212,175,55,0.15)] text-sm uppercase tracking-wider text-[#D4AF37]/90 hover:bg-[#D4AF37]/30 hover:shadow-[inset_0_0_0_1px_rgba(212,175,55,0.5),0_0_40px_rgba(212,175,55,0.25)] transition-all duration-300 font-medium"
        >
          Print Label
        </button>
      </div>

      {/* Share Actions */}
      <div className="mt-6">
        <ShareActions blend={blend} />
      </div>
    </div>
  );
}
