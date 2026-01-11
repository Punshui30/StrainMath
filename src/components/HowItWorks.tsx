import { motion } from 'motion/react';

interface HowItWorksProps {
  onClose: () => void;
}

export function HowItWorks({ onClose }: HowItWorksProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-30"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-30 flex items-center justify-center p-8 pointer-events-none"
      >
        <div className="max-w-2xl w-full bg-gradient-to-b from-[#121416] to-[#0A0A0B] rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] border border-white/10 p-12 pointer-events-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] transition-all flex items-center justify-center text-white/50 hover:text-white/90"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-light text-white/95 mb-4 tracking-tight">
                How GO LINE Works
              </h2>
              <p className="text-base text-white/50 font-light leading-relaxed">
                A guided outcome calculator that helps you find the right blend for your needs
              </p>
            </div>

            {/* Key Points */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-lg text-white/90 font-light mb-2">Talk naturally</h3>
                  <p className="text-sm text-white/50 font-light leading-relaxed">
                    You can talk to this like a human. Just describe what you're looking for — there's no right way to ask.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-lg text-white/90 font-light mb-2">Get multiple options</h3>
                  <p className="text-sm text-white/50 font-light leading-relaxed">
                    You'll always receive multiple valid interpretations of your request, not a single "correct" answer. 
                    Browse and choose what resonates.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-lg text-white/90 font-light mb-2">Precision blending</h3>
                  <p className="text-sm text-white/50 font-light leading-relaxed">
                    Every recommendation is grounded in real lab-tested data from the available inventory. 
                    You'll see exact gram ratios for each blend.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-sm">
                  4
                </div>
                <div>
                  <h3 className="text-lg text-white/90 font-light mb-2">Nothing is sold here</h3>
                  <p className="text-sm text-white/50 font-light leading-relaxed">
                    GO LINE is guidance only. Use the recommendations to have an informed conversation with your budtender.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-xs text-white/40 font-light text-center">
                Your privacy is protected. Conversations are not stored or shared.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
