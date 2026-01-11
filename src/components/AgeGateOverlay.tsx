import { useState } from 'react';
import logoImage from '../assets/logo.png';

interface AgeGateOverlayProps {
  onEnterConsumer: () => void;
  onEnterOperator: () => void;
}

export function AgeGateOverlay({ onEnterConsumer, onEnterOperator }: AgeGateOverlayProps) {
  const [hasVerifiedAge, setHasVerifiedAge] = useState(false);

  return (
    <div className="fixed inset-0 bg-[#050505] flex items-center justify-center z-[200]">
      <div className="flex flex-col items-center max-w-md px-8 w-full">
        {/* Static Logo - No Animation */}
        <img
          src={logoImage}
          alt="GO LINE Logo"
          className="w-48 h-auto mb-6 opacity-90"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
        />

        <h1 className="text-sm tracking-[0.2em] uppercase font-light text-[#D4AF37] text-center mb-16">
          Guided Outcome Calculator
        </h1>

        {!hasVerifiedAge ? (
          /* Step 1: Age Verification */
          <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
            <p className="text-sm text-white/40 text-center mb-12 font-light">
              Age verification required. 21+
            </p>

            <button
              onClick={() => setHasVerifiedAge(true)}
              className="w-full px-12 py-5 bg-white/[0.06] hover:bg-white/[0.10]
                         border border-white/5 rounded-2xl
                         text-white/80 hover:text-white text-sm uppercase tracking-wider font-medium
                         transition-all duration-200"
            >
              Verify Age
            </button>

            <button
              onClick={() => window.close()}
              className="mt-6 text-xs uppercase tracking-wider text-white/30 hover:text-white/50 transition-colors"
            >
              Exit
            </button>
          </div>
        ) : (
          /* Step 2: Role Selection (Explicit Routing) */
          <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards">
            <button
              onClick={onEnterConsumer}
              className="w-full py-5 bg-white/[0.06] hover:bg-white/[0.10]
                         border border-white/5 rounded-xl
                         text-white/90 text-sm uppercase tracking-wider font-medium
                         transition-all hover:border-white/20"
            >
              Return User
            </button>

            <button
              onClick={onEnterOperator}
              className="w-full py-5 bg-transparent hover:bg-white/[0.03]
                         border border-white/10 rounded-xl
                         text-[#D4AF37]/80 hover:text-[#D4AF37] text-sm uppercase tracking-wider font-medium
                         transition-all hover:border-[#D4AF37]/30"
            >
              Operator Console
            </button>
          </div>
        )}
      </div>
    </div>
  );
}