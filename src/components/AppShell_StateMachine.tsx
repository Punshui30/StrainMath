import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollContainer, type ScrollContainerHandle } from './InventoryTray/ScrollContainer';
import { ProcessorStateMachine } from './GoLogo/ProcessorStateMachine';
import { BlendResultCard } from './BlendResultCard';
import { BlendCalculator } from './BlendCalculator';
import { BlendExplanationPanel } from './BlendExplanationPanel';
import { VisualFlyInOverlay } from './VisualFlyInOverlay';
import { PromptsSidebar } from './PromptsSidebar';
import { AdminOverlay } from './AdminOverlay';
import { HowItWorks } from './HowItWorks';
import { BusinessWalkthrough } from './BusinessWalkthrough';
import { useIsMobile } from '../hooks/useIsMobile';
import { AgeGateOverlay } from './AgeGateOverlay';
import { OnboardingScreen } from './OnboardingScreen';
import { AmbientBackground } from './AmbientBackground';
import { QRCodeModal } from './QRCodeModal';
import logoImage from '../assets/logo.png';
import { MOCK_COAS } from '../../data/mockCoas';
import { scoreStrain, assembleBlends, type IntentVectors } from '../engine/scoring';
import { getStrainColor } from '../utils/strainColors';
import type { AnimationState, IngredientCard } from '../types/animationStates';
import { ANIMATION_TIMINGS } from '../types/animationStates';
import type { BlendRecommendation } from '../types/blend';
import { generateExplanation } from '../utils/explanationGenerator';

import { DEMO_STEPS } from '../data/demoSteps';

// Blend trigger types to prevent LLM contamination
type BlendTrigger =
  | { type: 'user'; text: string }
  | { type: 'strain-chase'; strainName: string; lovedEffects?: string }
  | { type: 'system' };

type AppMode = 'voice' | 'operator' | 'business';

// Screen states for single render authority (mobile-first architecture)
type ScreenState =
  | 'INPUT'           // Text input, voice, presets
  | 'PROCESSING'      // Animation states 0-2
  | 'RESULTS'         // Blend cards visible
  | 'EXPLANATION'     // Explanation modal (exclusive)
  | 'CALCULATOR';     // Blend calculator (exclusive)

/**
 * AppShell_StateMachine
 */
export function AppShell_StateMachine() {

  const isMobile = useIsMobile();
  const [userTypeSelected, setUserTypeSelected] = useState(false);
  /* 
   * [FLIGHT CHECK] Fix 1: Do NOT read onboardingComplete on app init 
   * logic: User must explicitly choose First Time or Returning in session
   */
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [animationState, setAnimationState] = useState<AnimationState>('STATE_0_IDLE');
  const [mode, setMode] = useState<AppMode>('voice');
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Reset onboarding via URL query param (e.g., ?resetOnboarding=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('resetOnboarding') === 'true') {
      localStorage.removeItem('hasOnboarded');
      setOnboardingComplete(false);
      setUserTypeSelected(false);
      console.log('Onboarding reset via query param');
    }
  }, []);
  const [selectedBlendId, setSelectedBlendId] = useState(1);
  const [committedBlend, setCommittedBlend] = useState<any | null>(null);

  // Mobile Strain Chaser UI State
  const [mobileStrainName, setMobileStrainName] = useState('');
  const [mobileLovedEffects, setMobileLovedEffects] = useState('');

  // LLM States
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [currentIntent, setCurrentIntent] = useState<IntentVectors | null>(null);
  const [lastUserText, setLastUserText] = useState("");
  const [transcribedText, setTranscribedText] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [blendExplanationText, setBlendExplanationText] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [chaseModeData, setChaseModeData] = useState<{
    strainName: string;
    similarityScore: "High" | "Medium" | "Low";
    explanation: string;
  } | null>(null);

  const [showBusinessWalkthrough, setShowBusinessWalkthrough] = useState(false);

  // Initialize with top 3 strains based on a neutral intent
  // Initialize empty - waiting for user intent
  // [CRITICAL] Initial state MUST be empty to ensure only Logo is shown on load.
  const [visibleBlends, setVisibleBlends] = useState<BlendRecommendation[]>([]);

  // STATE 2 tracking
  const [ingredientCards, setIngredientCards] = useState<IngredientCard[]>([]);
  const [currentLiftingIndex, setCurrentLiftingIndex] = useState(-1);
  const [cardsArrived, setCardsArrived] = useState(0);
  const [liftingCardPositions, setLiftingCardPositions] = useState<DOMRect[]>([]);

  const inventoryRef = useRef<ScrollContainerHandle>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const goLogoRef = useRef<HTMLDivElement>(null); // Anchor for animation
  const [logoRect, setLogoRect] = useState<DOMRect | null>(null);

  // Demo State & Orchestration
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // Measure Logo on mount/resize
  useEffect(() => {
    const updateLogoRect = () => {
      if (goLogoRef.current) {
        setLogoRect(goLogoRef.current.getBoundingClientRect());
      }
    };
    updateLogoRect();
    window.addEventListener('resize', updateLogoRect);
    return () => window.removeEventListener('resize', updateLogoRect);
  }, [mode]); // Re-measure when layout might change

  // [CORRECTIVE FIX] Shared Inventory State (Single Source of Truth)
  const [inventory, setInventory] = useState(() => MOCK_COAS.map(coa => ({
    ...coa,
    strain: coa.name, // Compatibility
    qty: Math.floor(Math.random() * 400) + 50,
    status: 'In Stock' as const
  })));

  /**
   * interpretOutcome
   * Calls the serverless LLM route
   */
  const interpretOutcome = async (text: string) => {
    console.log("📍 API Request Receipt:", text);
    setIsInterpreting(true);
    setLastUserText(text);

    try {
      const response = await fetch('/api/interpret-outcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcomeText: text })
      });
      const structured = await response.json();
      console.log("✨ API Response:", structured);
      console.log("⚙️ Engine Input Vectors:", structured.intent);
      setCurrentIntent(structured.intent);
      setBlendExplanationText(structured.explanation || null);
      return structured.intent;
    } catch (error) {
      console.error("❌ Interpretation failed:", error);
      return null;
    } finally {
      setIsInterpreting(false);
    }
  };

  /**
   * interpretStrainChase
   * Calls the specialized LLM route for strain chasers
   */
  const interpretStrainChase = async (strainName: string, lovedEffects?: string) => {
    setIsInterpreting(true);
    try {
      const response = await fetch('/api/interpret-strain-chase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strainName, lovedEffects })
      });
      const data = await response.json();
      setChaseModeData({
        strainName,
        similarityScore: data.similarityScore,
        explanation: data.explanation
      });
      return data;
    } catch (error) {
      console.error("❌ Strain chase failed:", error);
      return null;
    } finally {
      setIsInterpreting(false);
    }
  };

  /**
   * startBlendSequence
   * Updated to handle real interpretation or direct intent injection
   */
  const startBlendSequence = useCallback(async (trigger?: BlendTrigger, overrideIntent?: IntentVectors) => {
    // [CRITICAL FIX] Force Reset UI State
    if (trigger || overrideIntent) {
      setCommittedBlend(null);
    }

    let intent: any = null;
    let selectedId = selectedBlendId;
    let activeBlends = visibleBlends;
    let localChaseData: any = null;

    if (overrideIntent) {
      intent = overrideIntent;
      setChaseModeData(null);
    } else if (trigger?.type === 'user') {
      // Only interpret user-authored language (FIX 3: LLM sanitization)
      setLastUserText(trigger.text);
      intent = await interpretOutcome(trigger.text);
      setChaseModeData(null); // Clear strain chaser if moving to free text
    } else if (trigger?.type === 'strain-chase') {
      const chaseResult = await interpretStrainChase(trigger.strainName, trigger.lovedEffects);
      if (chaseResult) {
        intent = chaseResult.intent;
        localChaseData = {
          strainName: trigger.strainName,
          similarityScore: chaseResult.similarityScore,
          explanation: chaseResult.explanation
        };
      }
      setLastUserText(`Inspired by ${trigger.strainName}`);
    }

    if (intent && typeof intent === 'object') {
      // [CRITICAL FIX] Normalize & Guard Data Shape
      console.log("🛡️ Validating Intent Shape:", intent);

      // Score across all 60+ strains in MOCK_COAS
      const safeIntent: IntentVectors = {
        relaxation: intent.relaxation ?? 0.5,
        focus: intent.focus ?? 0.5,
        energy: intent.energy ?? 0.5,
        creativity: intent.creativity ?? 0.5,
        pain_relief: intent.pain_relief ?? 0.5,
        anti_anxiety: intent.anti_anxiety ?? 0.5
      };

      // [CORRECTIVE FIX] Score against Shared Inventory State
      const scored = inventory.map(coa => scoreStrain(coa, safeIntent));

      // Assemble 3 unique blends from top scores
      const newBlends = assembleBlends(scored);

      // [CRITICAL FIX] Validate Output Shape
      if (!newBlends || newBlends.length === 0 || !newBlends[0].components) {
        console.error("❌ CRTICAL ERROR: Engine produced malformed blends", newBlends);
        return; // Abort - Do not crash UI
      }

      // If in chase mode, inject the similarity metadata into the blends
      const finalBlends = localChaseData
        ? newBlends.map(b => ({
          ...b,
          name: `${b.name.split(' ').slice(0, 1)} ${localChaseData.strainName} Match`,
          similarity: {
            score: localChaseData.similarityScore,
            explanation: localChaseData.explanation
          }
        }))
        : newBlends;

      setVisibleBlends(finalBlends);
      activeBlends = finalBlends;
      selectedId = finalBlends[0].id;
      setSelectedBlendId(selectedId);
    }

    // [CRITICAL FIX] Safe Access - using local variable to prevent race condition
    const blend = activeBlends.find(b => b.id === selectedId) || activeBlends[0];

    // If we're processing new input but failed to get a blend, abort sequence
    if (!blend || !blend.components) {
      console.error("❌ No valid blend found to animate in active set", activeBlends);
      return;
    }

    const allComponents = activeBlends.flatMap(b => b.components || []);
    const cards: IngredientCard[] = allComponents.map(c => ({
      strain: c.name,
      color: getStrainColor(c.name),
      percentage: c.percentage,
      role: c.role,
      category: c.type as 'Hybrid' | 'Indica' | 'Sativa',
    }));

    setIngredientCards(cards);

    const strainNames = cards.map(c => c.strain);
    const uniqueStrains = Array.from(new Set(strainNames));

    setAnimationState('STATE_1_INVENTORY_ALIGNED');
    await inventoryRef.current?.scrollToCenter(uniqueStrains);
    window.dispatchEvent(new Event('strain-math:trigger-fly-in'));
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAnimationState('STATE_3_RECOMMENDATION_OUTPUT');

  }, [animationState, selectedBlendId, inventory]);

  // Demo Lifecycle Loop (Legacy - Disabled for new Walkthrough Flow)
  useEffect(() => {
    if (!isDemoRunning) return;

    if (demoStep <= 4 && mode !== 'operator') {
      setMode('operator');
    } else if (demoStep === 5 && mode !== 'voice') {
      setMode('voice');
      setTimeout(() => {
        startBlendSequence({ type: 'system' });
      }, 500);
    }

    // Auto-advance is now disabled for the business narrative.
    // Logic remains for potential consumer-side automation in future.
  }, [isDemoRunning, demoStep]);

  const handleReset = () => {
    setAnimationState('STATE_0_IDLE');
    setSelectedBlendId(1);
    setCommittedBlend(null);
    setIngredientCards([]);
    setCurrentLiftingIndex(-1);
    setCardsArrived(0);
    setLiftingCardPositions([]);
    setChaseModeData(null);
  };

  const handleMakeBlend = () => {
    const selectedBlend = visibleBlends.find(b => b.id === selectedBlendId);
    if (selectedBlend) {
      setCommittedBlend(selectedBlend);
    }
  };

  const handleSelectBlend = (id: number) => {
    setSelectedBlendId(id);
  };

  const handleSwitchBlendInCalculator = (id: number) => {
    const newBlend = visibleBlends.find(b => b.id === id);
    if (newBlend) {
      setSelectedBlendId(id);
      setCommittedBlend(newBlend);
    }
  };

  const deriveScreenState = (): ScreenState => {
    if (showExplanation) return 'EXPLANATION';
    if (committedBlend) return 'CALCULATOR';
    if (animationState === 'STATE_3_RECOMMENDATION_OUTPUT' && visibleBlends.length > 0) return 'RESULTS';
    if (animationState !== 'STATE_0_IDLE') return 'PROCESSING';
    return 'INPUT';
  };

  const currentScreen = deriveScreenState();

  if (showExplanation) {
    const selectedBlend = visibleBlends.find(b => b.id === selectedBlendId) || visibleBlends[0];
    if (!selectedBlend) return null;

    return (
      <div className="fixed inset-0 bg-black z-[9999]">
        <BlendExplanationPanel
          blend={selectedBlend}
          intent={currentIntent}
          explanation={blendExplanationText}
          userText={lastUserText}
          onClose={() => setShowExplanation(false)}
        />
      </div>
    );
  }

  if (currentScreen === 'CALCULATOR') {
    const blend = committedBlend!;
    return (
      <div className="w-full h-screen bg-black text-white flex flex-col overflow-hidden relative">
        <AmbientBackground
          imageUrl="https://images.unsplash.com/photo-1582095127899-1dfb05e4e32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          opacity={0.06}
        />
        <BlendCalculator
          blend={blend}
          onStartOver={handleReset}
          onSwitchBlend={handleSwitchBlendInCalculator}
          alternateBlends={visibleBlends}
        />
        <QRCodeModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          blend={blend}
        />
      </div>
    );
  }

  const highlightedStrains =
    (animationState === 'STATE_1_INVENTORY_ALIGNED' ||
      animationState === 'STATE_2_INGREDIENT_LIFT')
      ? ingredientCards.map(c => c.strain)
      : [];

  const logoPosition = logoRef.current?.getBoundingClientRect() || new DOMRect();

  const handlePresetSelect = (intent: IntentVectors) => {
    setMode('voice');
    setLastUserText("Production Preset Active");
    setCurrentIntent(intent);
    startBlendSequence(undefined, intent);
  };

  if (!userTypeSelected) {
    return (
      <AgeGateOverlay
        onEnterNewUser={() => {
          setUserTypeSelected(true);
          setOnboardingComplete(false);
          setMode('voice');
        }}
        onEnterReturningUser={() => {
          setUserTypeSelected(true);
          setOnboardingComplete(true);
          setMode('voice');
        }}
        onEnterOperator={() => {
          setUserTypeSelected(true);
          setOnboardingComplete(true);
          setMode('operator');
        }}
      />
    );
  }

  if (!onboardingComplete) {
    return (
      <OnboardingScreen
        onComplete={() => {
          localStorage.setItem('hasOnboarded', 'true');
          setOnboardingComplete(true);
          setUserTypeSelected(true);
        }}
      />
    );
  }

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col overflow-hidden relative">
      <AmbientBackground
        imageUrl={animationState === 'STATE_3_RECOMMENDATION_OUTPUT'
          ? "https://images.unsplash.com/photo-1582095127899-1dfb05e4e32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          : "https://images.unsplash.com/photo-1714065712817-af7d54710a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        }
        opacity={animationState === 'STATE_0_IDLE' ? 0.04 : 0.06}
      />

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-8 flex-shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <img
            src={logoImage}
            alt="GO LINE"
            className="w-12 h-auto"
            style={{ filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.4))' }}
          />
          <h1 className="text-base tracking-[0.3em] uppercase font-light text-white/90">GO LINE™</h1>
        </div>

        <div className="flex items-center gap-4">
          {mode === 'voice' && animationState === 'STATE_0_IDLE' && (
            <button
              onClick={() => setShowHowItWorks(true)}
              className="text-xs uppercase tracking-wider text-white/40 hover:text-white/80 transition-colors font-medium"
            >
              How It Works
            </button>
          )}

          <button
            onClick={() => setMode(mode === 'operator' ? 'voice' : 'operator')}
            className="text-xs uppercase tracking-wider text-white/40 hover:text-white/80 transition-colors font-medium"
          >
            {mode === 'operator' ? 'Exit Console' : 'Console'}
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('hasOnboarded');
              window.location.reload();
            }}
            className="text-[10px] uppercase tracking-wider text-red-500/40 hover:text-red-500/80 transition-colors"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[10] pointer-events-none">
        <p className="text-[9px] text-white/10 tracking-wide">
          © 2026. All rights reserved.
        </p>
      </div>

      {/* Main Application */}
      {mode === 'voice' && (
        <div className="flex-1 relative overflow-hidden">
          {isMobile ? (
            <div className="w-full h-full flex flex-col relative z-10 overflow-hidden">
              {/* Fixed Header */}
              <div className="flex flex-col items-center pt-8 pb-4 bg-black/40 backdrop-blur-md">
                <img src={logoImage} alt="GO CA" className="w-8 h-auto opacity-90" />
                <div className="text-[9px] uppercase tracking-[0.3em] text-white/40 mt-2">Mobile Viewer</div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 w-full overflow-y-auto px-6 pt-4 pb-40 scroll-smooth">
                {animationState === 'STATE_0_IDLE' ? (
                  <div className="space-y-12">
                    <div className="w-full max-w-[380px] mx-auto flex flex-col gap-6 py-8">
                      <h2 className="text-center text-sm font-medium text-white/60 leading-relaxed">
                        Describe the outcome you're looking for
                      </h2>

                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Type your desired outcome..."
                          className="w-full px-4 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-base text-white/80 placeholder:text-white/20 focus:bg-white/[0.05] focus:border-[#D4AF37]/30 focus:outline-none transition-all duration-300 shadow-inner"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const value = (e.target as HTMLInputElement).value;
                              if (value.trim()) startBlendSequence({ type: 'user', text: value });
                            }
                          }}
                        />

                        <button
                          onClick={() => {
                            const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                            if (!Recognition) return;
                            const recognition = new Recognition();
                            recognition.lang = 'en-US';
                            recognition.onresult = (event: any) => {
                              const transcript = event.results[0][0].transcript;
                              setTranscribedText(transcript);
                              startBlendSequence({ type: 'user', text: transcript });
                            };
                            recognition.start();
                          }}
                          className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-xl transition-all duration-300 shadow-lg active:scale-95"
                        >
                          <span className="text-xl">🎤</span>
                          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Voice Input</span>
                        </button>
                      </div>

                      <div className="space-y-4 mt-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-medium text-center">Or try a preset</p>
                        <div className="grid grid-cols-1 gap-3">
                          {['Relaxed & Alert', 'Pain Relief', 'Focus & Creative', 'Sleep Aid'].map((preset) => (
                            <button
                              key={preset}
                              onClick={() => startBlendSequence({ type: 'user', text: preset })}
                              className="w-full px-4 py-4 text-xs text-white/70 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-2xl rounded-xl transition-all duration-200 border border-white/5 hover:border-white/20 text-center uppercase tracking-widest"
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Strain Chaser - Visually Separate */}
                    <div className="mt-8 pt-6 border-t border-white/[0.08] w-full max-w-[380px] mx-auto">
                      <div className="mb-5 px-1 text-center">
                        <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-1.5">Chasing a Strain You Loved?</h3>
                        <p className="text-[10px] text-white/40 leading-relaxed">Approximate a past experience using chemistry + effects</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-[0.2em] text-white/30 ml-1 font-medium">Remembered Strain</label>
                          <div className="relative group">
                            <input
                              type="text"
                              value={mobileStrainName}
                              onChange={(e) => setMobileStrainName(e.target.value)}
                              placeholder='e.g. "White Gummy by Don Murpho"'
                              className="w-full px-4 py-4 pr-12 rounded-xl bg-white/[0.03] border border-white/10 
                                         text-sm text-white/80 placeholder:text-white/20
                                         focus:bg-white/[0.05] focus:border-[#D4AF37]/30 focus:outline-none 
                                         transition-all duration-300"
                            />
                            <button
                              onClick={() => {
                                const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                                if (!Recognition) return;
                                const recognition = new Recognition();
                                recognition.lang = 'en-US';
                                recognition.onresult = (event: any) => {
                                  const transcript = event.results[0][0].transcript;
                                  setMobileStrainName(transcript);
                                };
                                recognition.start();
                              }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-[#D4AF37]/10 rounded-full transition-colors"
                            >
                              <span className="text-lg opacity-60">🎤</span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-[0.2em] text-white/30 ml-1 font-medium">What did you love? (Optional)</label>
                          <input
                            type="text"
                            value={mobileLovedEffects}
                            onChange={(e) => setMobileLovedEffects(e.target.value)}
                            placeholder='e.g. "calm, euphoric"'
                            className="w-full px-4 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white/80 placeholder:text-white/20 focus:bg-white/[0.05] focus:border-[#D4AF37]/30 focus:outline-none transition-all duration-300"
                          />
                        </div>

                        <button
                          onClick={() => {
                            startBlendSequence({ type: 'strain-chase', strainName: mobileStrainName, lovedEffects: mobileLovedEffects });
                          }}
                          disabled={!mobileStrainName.trim()}
                          className="w-full py-4 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 disabled:opacity-30 disabled:pointer-events-none rounded-xl text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold transition-all duration-300 active:scale-95 shadow-lg shadow-[#D4AF37]/5"
                        >
                          Find Closest Match
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-[420px] mx-auto py-4">
                    {animationState === 'STATE_3_RECOMMENDATION_OUTPUT' && visibleBlends.length > 0 ? (
                      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
                        <div className="px-2 mb-8">
                          <button
                            onClick={handleReset}
                            className="w-full py-3 rounded-xl border border-white/10 text-white/40 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                          >
                            ← Re-enter Outcome
                          </button>
                        </div>

                        <div className="space-y-6">
                          {visibleBlends.map((blend, idx) => (
                            <BlendResultCard
                              key={blend.id}
                              blend={blend}
                              isSelected={selectedBlendId === blend.id}
                              index={idx}
                              onSelect={() => setSelectedBlendId(blend.id)}
                            />
                          ))}
                        </div>

                        {/* Guardrail Microcopy */}
                        {chaseModeData && (
                          <p className="text-center text-[10px] text-white/20 italic px-6">
                            This is an approximation of the experience, not a recreation of the strain.
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-3 pt-6 pb-20">
                          <button
                            onClick={handleMakeBlend}
                            className="w-full py-5 rounded-2xl bg-[#D4AF37] text-black font-extrabold tracking-widest uppercase text-base shadow-[0_10px_40px_rgba(212,175,55,0.3)] active:scale-95 transition-all"
                          >
                            Make This Blend
                          </button>
                          <button
                            onClick={() => setShowExplanation(true)}
                            className="w-full py-4 rounded-xl border border-white/10 text-white/60 hover:text-white/90 text-[11px] uppercase tracking-widest font-bold transition-all"
                          >
                            Why this blend?
                          </button>
                          <button
                            onClick={handleReset}
                            className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[11px] uppercase tracking-widest transition-all"
                          >
                            Start Over
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-8">
                        <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.15)]">
                          <div className="w-4 h-4 bg-[#D4AF37] rounded-full animate-pulse" />
                        </div>
                        <div className="text-center space-y-2">
                          <p className="text-[#D4AF37] text-sm uppercase tracking-[0.3em] font-bold animate-pulse">Analyzing</p>
                          <p className="text-white/20 text-[10px] uppercase tracking-widest">Applying Strain Math...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex">
              <div className={`transition-all duration-700 ease-out ${animationState === 'STATE_0_IDLE' ? 'w-80' : 'w-0'} overflow-hidden ${animationState === 'STATE_3_RECOMMENDATION_OUTPUT' ? 'pointer-events-none opacity-40 grayscale' : ''}`}>
                <PromptsSidebar
                  onPromptSelect={(text) => startBlendSequence({ type: 'user', text })}
                  onTextSubmit={(text) => startBlendSequence({ type: 'user', text })}
                  onStrainChase={(strainName, lovedEffects) => startBlendSequence({ type: 'strain-chase', strainName, lovedEffects })}
                  onVoiceActivate={() => {
                    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                    if (!Recognition) return;
                    const recognition = new Recognition();
                    recognition.lang = 'en-US';
                    recognition.onresult = (event: any) => {
                      const transcript = event.results[0][0].transcript;
                      setTranscribedText(transcript);
                      startBlendSequence({ type: 'user', text: transcript });
                    };
                    recognition.start();
                  }}
                />
              </div>

              <div className="flex-1 flex flex-col" style={{ paddingBottom: '20px' }}>
                <div className="flex-1 flex flex-col items-center justify-center relative">
                  {animationState !== 'STATE_3_RECOMMENDATION_OUTPUT' && (
                    <div ref={goLogoRef} className="transition-all duration-700">
                      <ProcessorStateMachine
                        state={animationState}
                        cardsArrived={cardsArrived}
                        totalCards={ingredientCards.length}
                        isInterpreting={isInterpreting}
                      />
                    </div>
                  )}

                  {(isInterpreting || transcribedText) && !committedBlend && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} className="mt-4 text-sm font-light text-white/60 italic max-w-md text-center">
                      "{transcribedText || lastUserText}"
                    </motion.div>
                  )}
                </div>
              </div>

              {visibleBlends.length > 0 && animationState === 'STATE_3_RECOMMENDATION_OUTPUT' && !committedBlend && (
                <div className="absolute inset-0 flex items-center justify-center pb-32 z-[100] pointer-events-auto">
                  <div className="flex flex-col items-center w-full">
                    <div className="flex gap-6 justify-center mb-12">
                      {visibleBlends.map((blend, index) => (
                        <BlendResultCard
                          key={blend.id}
                          blend={blend}
                          isSelected={blend.id === selectedBlendId}
                          onSelect={() => handleSelectBlend(blend.id)}
                          index={index}
                          animationAnchor={logoRect}
                        />
                      ))}
                    </div>

                    {/* Desktop Guardrail Microcopy */}
                    {chaseModeData && (
                      <p className="mb-8 text-[11px] text-white/30 italic">
                        This is an approximation of the experience, not a recreation of the strain.
                      </p>
                    )}

                    <div className="flex gap-4">
                      <button onClick={() => setShowQR(true)} className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/20 text-white/60 hover:text-white_80 text-sm uppercase tracking-wider font-medium transition-all duration-200">View QR</button>
                      <button onClick={handleMakeBlend} className="group relative px-12 py-4 bg-white/[0.08] hover:bg-white/[0.12] backdrop-blur-2xl rounded-2xl overflow-hidden shadow-[inset_0_0_0_1px_rgba(212,175,55,0.3)] hover:shadow-[inset_0_0_0_1px_rgba(212,175,55,0.6),0_8px_32px_rgba(212,175,55,0.25)] text-white/90 hover:text-white text-base uppercase tracking-wider font-medium transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]">
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        <span className="relative z-10">Make This Blend</span>
                      </button>
                      <button onClick={() => setShowExplanation(true)} className="px-6 py-3 text-sm text-white/60 hover:text-white/90 underline underline-offset-4 transition-all duration-200">Why this blend?</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modals & Overlays */}
      {showHowItWorks && <HowItWorks isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />}

      {mode === 'operator' && !showBusinessWalkthrough && (
        <AdminOverlay
          isDemoRunning={isDemoRunning}
          demoStep={demoStep}
          onStartDemo={() => setShowBusinessWalkthrough(true)}
          onStopDemo={() => setIsDemoRunning(false)}
          inventory={inventory}
          onUpdateInventory={setInventory}
          onPresetSelect={handlePresetSelect}
          onShowBusinessOverview={() => setShowBusinessWalkthrough(true)}
        />
      )}

      {showBusinessWalkthrough && (
        <BusinessWalkthrough
          onClose={() => setShowBusinessWalkthrough(false)}
          onEnterConsole={() => {
            setShowBusinessWalkthrough(false);
            setMode('operator');
          }}
        />
      )}
    </div>
  );
}
