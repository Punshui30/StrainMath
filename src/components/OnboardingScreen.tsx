import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '../assets/logo.png';

interface Step {
  title: string;
  body: string;
  cta: string;
}

const STEPS: Step[] = [
  {
    title: "Let’s start with how you want to feel",
    body: "You don’t pick strains here.\nYou describe the outcome you’re aiming for.",
    cta: "Next →"
  },
  {
    title: "There’s more than one right answer",
    body: "Most goals can be reached in different ways.\nThat’s why you’ll see a few options — not just one.",
    cta: "Next →"
  },
  {
    title: "Why blends work better",
    body: "Single strains push hard in one direction.\nBlends let us balance effects instead of guessing.",
    cta: "Next →"
  },
  {
    title: "A simple way to think about it",
    body: "THC & CBD are the gas.\nTerpenes steer.\nThis system helps navigate.",
    cta: "Start →"
  }
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] flex items-center justify-center z-50 p-6">
      <div className="w-full max-w-lg relative">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-[#D4AF37]/5 blur-[100px] rounded-full" />

        <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 shadow-2xl overflow-hidden min-h-[480px] flex flex-col items-center justify-center text-center">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <img
              src={logoImage}
              alt="GO LINE"
              className="w-20 h-auto opacity-80"
              style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.2))' }}
            />
          </motion.div>

          {/* Content with AnimatePresence for Transitions */}
          <div className="flex-1 flex flex-col items-center justify-center w-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full"
              >
                <h2 className="text-2xl md:text-3xl font-light text-white mb-6 leading-tight tracking-tight">
                  {step.title}
                </h2>
                <div className="space-y-2">
                  {step.body.split('\n').map((line, i) => (
                    <p key={i} className="text-lg text-white/50 font-light leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-2 mt-12 mb-8">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/10'
                  }`}
              />
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="w-full max-w-[240px] py-4 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20
                       border border-[#D4AF37]/30 hover:border-[#D4AF37]/50
                       rounded-2xl text-[#D4AF37] font-medium tracking-wide
                       transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.1)]
                       hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]"
          >
            {step.cta}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
