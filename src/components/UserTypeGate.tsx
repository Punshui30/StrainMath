import logoImage from '../assets/logo.png';

interface UserTypeGateProps {
  onFirstTime: () => void;
  onReturning: () => void;
}

export function UserTypeGate({ onFirstTime, onReturning }: UserTypeGateProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] flex items-center justify-center z-50">
      <div className="flex flex-col items-center max-w-md px-8">
        {/* Logo + Subtitle Lockup */}
        <div className="flex flex-col items-center mb-16">
          {/* Logo - Primary, Dominant */}
          <div className="mb-4 relative">
            <img
              src={logoImage}
              alt="GO LINE Logo"
              className="w-44 h-auto"
              style={{
                filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.4))'
              }}
            />
          </div>

          {/* Subtitle - Secondary, Editorial */}
          <h1 className="text-sm tracking-[0.08em] uppercase font-normal text-white/50 text-center">
            Guided Outcome Calculator
          </h1>
        </div>

        {/* Message */}
        <p className="text-sm text-white/40 text-center mb-10 leading-relaxed font-light">
          Have you used GO LINE before?
        </p>

        {/* Actions */}
        <div className="w-full space-y-3">
          <button
            onClick={onFirstTime}
            className="w-full px-12 py-5 bg-white/[0.06] hover:bg-white/[0.10]
                       backdrop-blur-2xl rounded-2xl
                       shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]
                       hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15),0_8px_32px_rgba(255,255,255,0.06)]
                       text-white/80 hover:text-white/95 text-sm uppercase tracking-wider font-medium
                       transition-all duration-200 ease-out"
          >
            First Time
          </button>

          <button
            onClick={onReturning}
            className="w-full px-12 py-5 bg-white/[0.04] hover:bg-white/[0.08]
                       backdrop-blur-2xl rounded-2xl
                       shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]
                       hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]
                       text-white/60 hover:text-white/80 text-sm uppercase tracking-wider font-medium
                       transition-all duration-200 ease-out"
          >
            Returning User
          </button>
        </div>
      </div>
    </div>
  );
}
