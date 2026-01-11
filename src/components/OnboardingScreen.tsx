import logoImage from 'figma:asset/f7eabe4467f2f507507acb041076599c4b9fae68.png';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] flex items-center justify-center z-50">
      <div className="flex flex-col items-center max-w-2xl px-12">
        {/* Logo - Smaller, Top */}
        <div className="mb-12">
          <img 
            src={logoImage} 
            alt="GO LINE Logo" 
            className="w-32 h-auto opacity-90"
            style={{
              filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.3))'
            }}
          />
        </div>

        {/* Main Content - Single Screen, No Scroll */}
        <div className="space-y-8 mb-12">
          {/* Section 1: Why Blends */}
          <div className="text-center">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/70 mb-3 font-medium">
              Why Blends?
            </h2>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-lg mx-auto">
              Single-strain experiences are limited. Blends combine complementary terpene profiles 
              to achieve more nuanced outcomes that better match complex needs.
            </p>
          </div>

          {/* Section 2: Multiple Interpretations */}
          <div className="text-center">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/70 mb-3 font-medium">
              Multiple Interpretations
            </h2>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-lg mx-auto">
              The system presents several valid blend options for every request. 
              Each interpretation emphasizes different aspects of your desired outcome.
            </p>
          </div>

          {/* Section 3: Guidance, Not Certainty */}
          <div className="text-center">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/70 mb-3 font-medium">
              Guidance, Not Certainty
            </h2>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-lg mx-auto">
              This is a recommendation tool, not a prescription service. 
              Results vary based on individual chemistry, tolerance, and context.
            </p>
          </div>

          {/* Section 4: Privacy */}
          <div className="text-center">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/70 mb-3 font-medium">
              Your Privacy
            </h2>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-lg mx-auto">
              No requests are stored or logged. All processing happens locally in your browser. 
              Your data never leaves your device.
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onComplete}
          className="px-16 py-5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30
                     backdrop-blur-2xl rounded-2xl
                     shadow-[inset_0_0_0_1px_rgba(212,175,55,0.3),0_0_30px_rgba(212,175,55,0.1)]
                     hover:shadow-[inset_0_0_0_1px_rgba(212,175,55,0.5),0_0_40px_rgba(212,175,55,0.2)]
                     text-[#D4AF37]/90 hover:text-[#D4AF37] text-sm uppercase tracking-wider font-medium
                     transition-all duration-300 ease-out"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
