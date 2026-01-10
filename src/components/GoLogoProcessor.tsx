import React, { useEffect } from 'react';
import type { GoLogoProcessorProps } from '../types';
import { Sparkles } from 'lucide-react';

export function GoLogoProcessor({
  isProcessing,
  cardsInProcessor,
  onProcessingComplete
}: GoLogoProcessorProps) {
  useEffect(() => {
    if (isProcessing && cardsInProcessor === 3) {
      const timer = setTimeout(() => {
        if (onProcessingComplete) {
          onProcessingComplete();
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isProcessing, cardsInProcessor, onProcessingComplete]);

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`
          w-32 h-32 rounded-full flex items-center justify-center
          transition-all duration-500
          ${isProcessing ? 'bg-gradient-to-br from-emerald-400 to-teal-600 scale-110' : 'bg-gradient-to-br from-emerald-500 to-teal-700'}
        `}
      >
        <Sparkles
          className={`
            w-16 h-16 text-white
            ${isProcessing ? 'animate-spin' : ''}
          `}
        />
      </div>

      {isProcessing && (
        <>
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-emerald-400/10 animate-pulse" />
        </>
      )}

      {cardsInProcessor > 0 && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-emerald-500">
          <span className="text-sm font-bold text-emerald-700">{cardsInProcessor}</span>
        </div>
      )}
    </div>
  );
}
