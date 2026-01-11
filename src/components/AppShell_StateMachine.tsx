import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollContainer, type ScrollContainerHandle } from './InventoryTray/ScrollContainer';
import { ProcessorStateMachine } from './GoLogo/ProcessorStateMachine';
import { IngredientCardLifting } from './IngredientCardLifting';
import { BlendResultCard } from './BlendResultCard';
import { BlendCalculator } from './BlendCalculator';
import { WhyPanel } from './WhyPanel';
import { PromptsSidebar } from './PromptsSidebar';
import { BusinessOverview } from './BusinessOverview';
import { AdminOverlay } from './AdminOverlay';
import { HowItWorks } from './HowItWorks';
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

type AppMode = 'voice' | 'operator' | 'business';

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

  // LLM States
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [currentIntent, setCurrentIntent] = useState<IntentVectors | null>(null);
  const [lastUserText, setLastUserText] = useState("");
  const [transcribedText, setTranscribedText] = useState("");
  const [showQR, setShowQR] = useState(false);
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

  // Demo Lifecycle Loop
  useEffect(() => {
    if (!isDemoRunning) return;

    // Orchestration Logic: Force UI State based on Step
    if (demoStep <= 4 && mode !== 'operator') {
      setMode('operator');
    } else if (demoStep === 5 && mode !== 'voice') {
      // Step 5: "Every recommendation can be saved..." -> Show Result
      setMode('voice');
      // Trigger a clean blend sequence for visual context
      // We use a small timeout to let the mode switch settle
      setTimeout(() => {
        startBlendSequence('Visual Demonstration');
      }, 500);
    }

    const timer = setTimeout(() => {
      if (demoStep < DEMO_STEPS.length - 1) {
        setDemoStep(prev => prev + 1);
      } else {
        setIsDemoRunning(false); // End demo
      }
    }, 6000); // Step Duration

    return () => clearTimeout(timer);
  }, [isDemoRunning, demoStep, mode, startBlendSequence]);

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
      const structuredIntent = await response.json();
      console.log("✨ API Response:", structuredIntent);
      console.log("⚙️ Engine Input Vectors:", structuredIntent);
      setCurrentIntent(structuredIntent);
      return structuredIntent;
    } catch (error) {
      console.error("❌ Interpretation failed:", error);
      return null;
    } finally {
      setIsInterpreting(false);
    }
  };

  /**
   * startBlendSequence
   * Updated to handle real interpretation or direct intent injection
   */
  const startBlendSequence = useCallback(async (userInput?: string, overrideIntent?: IntentVectors) => {
    // [CRITICAL FIX] Allow re-triggering from any state (removed idle check)
    // if (animationState !== 'STATE_0_IDLE') return; 

    // [CRITICAL FIX] Force Reset UI State
    if (userInput || overrideIntent) {
      setCommittedBlend(null);
      // We don't reset animationState immediately here, we let the sequence drive it to STATE_1
    }

    let intent: any = null;
    let selectedId = selectedBlendId;
    let activeBlends = visibleBlends;

    if (overrideIntent) {
      intent = overrideIntent;
    } else if (userInput) {
      intent = await interpretOutcome(userInput);
    }

    if (intent && typeof intent === 'object') {
      // [CRITICAL FIX] Normalize & Guard Data Shape
      console.log("🛡️ Validating Intent Shape:", intent);

      // Score across all 60+ strains in MOCK_COAS
      // Ensure intent has minimal required keys or fallback
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

      setVisibleBlends(newBlends);
      activeBlends = newBlends;
      selectedId = newBlends[0].id;
      setSelectedBlendId(selectedId);
    }

    // [CRITICAL FIX] Safe Access - using local variable to prevent race condition
    const blend = activeBlends.find(b => b.id === selectedId) || activeBlends[0] || (userInput ? null : activeBlends[0]);

    // If we're processing new input but failed to get a blend, abort sequence
    if (!blend || !blend.components) {
      console.error("❌ No valid blend found to animate in active set", activeBlends);
      return;
    }

    // [CRITICAL FIX] Animate ALL Ingredients (Intent Tiles)
    // Flatten components from all blends to get the full list (usually 9 items)
    const allComponents = activeBlends.flatMap(b => b.components || []);

    const cards: IngredientCard[] = allComponents.map(c => ({
      strain: c.name,
      color: getStrainColor(c.name),
      percentage: c.percentage,
      role: c.role,
      category: c.type as 'Hybrid' | 'Indica' | 'Sativa',
    }));

    setIngredientCards(cards);

    // Use unique strains for efficient scrolling
    const strainNames = cards.map(c => c.strain);
    const uniqueStrains = Array.from(new Set(strainNames));

    // ========================================
    // STATE 1: INVENTORY ALIGNMENT & IMMEDIATE RESULT
    // ========================================
    setAnimationState('STATE_1_INVENTORY_ALIGNED');

    // Scroll inventory to center selected strains (Visual feedback only)
    await inventoryRef.current?.scrollToCenter(uniqueStrains);

    // Short processing delay for "Compute" feel
    await new Promise(resolve => setTimeout(resolve, 600));

    // Direct transition to Results - NO Assembly Animation
    setAnimationState('STATE_3_RECOMMENDATION_OUTPUT');

  }, [animationState, selectedBlendId, inventory]);

  const handleReset = () => {
    setAnimationState('STATE_0_IDLE');
    setSelectedBlendId(1);
    setCommittedBlend(null);
    setIngredientCards([]);
    setCurrentLiftingIndex(-1);
    setCardsArrived(0);
    setLiftingCardPositions([]);
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

  // Determine which strains are highlighted (STATE 1 & 2)
  const highlightedStrains =
    (animationState === 'STATE_1_INVENTORY_ALIGNED' ||
      animationState === 'STATE_2_INGREDIENT_LIFT')
      ? ingredientCards.map(c => c.strain)
      : [];

  // Get logo position for card lifting
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
          setOnboardingComplete(false); // Show Onboarding
          setMode('voice');
        }}
        onEnterReturningUser={() => {
          setUserTypeSelected(true);
          setOnboardingComplete(true); // Skip Onboarding
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
      {/* Ambient Background */}
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
            style={{
              filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.4))'
            }}
          />
          <h1 className="text-base tracking-[0.3em] uppercase font-light text-white/90">GO LINE</h1>
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

          {/* [FLIGHT CHECK] Dev Reset Button */}
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

      {/* Main Application */}
      {mode === 'voice' && (
        <div className="flex-1 relative overflow-hidden">
          {isMobile ? (
            <div className="w-full h-full flex flex-col items-center justify-between p-6 pb-12 relative z-10">
              <div className="flex flex-col items-center mt-4">
                <img src={logoImage} alt="GO CA" className="w-10 h-auto opacity-90" />
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-3">Mobile Viewer</div>
              </div>
              <div className="flex-1 w-full flex flex-col items-center justify-center gap-8">
                {visibleBlends.length > 0 ? (
                  <div className="w-full max-w-[320px] flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
                    <BlendResultCard
                      blend={visibleBlends[0]}
                      isSelected={true}
                      index={0}
                      onSelect={() => { }}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleReset}
                        className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs uppercase"
                      >
                        Reset
                      </button>
                      <button
                        className="flex-[2] py-4 rounded-xl bg-[#D4AF37] text-black font-bold tracking-wide uppercase text-sm shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                      >
                        Share
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <button
                      onClick={() => startBlendSequence("I want to feel relaxed and creative")}
                      className="w-20 h-20 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.1)] active:scale-95 transition-all"
                    >
                      <div className="w-3 h-3 bg-[#D4AF37] rounded-full animate-pulse" />
                    </button>
                    <p className="text-white/40 text-xs uppercase tracking-widest">Tap to Analyze</p>
                  </div>
                )}
              </div>
            </div>
          ) : mode === 'voice' ? (
            <div className="w-full h-full flex">
              {/* Left Sidebar - Visible in IDLE and RESULTS, but disabled in RESULTS */}
              <div className={`transition-all duration-700 ease-out ${animationState === 'STATE_0_IDLE' ? 'w-80' : 'w-0'
                } overflow-hidden ${animationState === 'STATE_3_RECOMMENDATION_OUTPUT' ? 'pointer-events-none opacity-40 grayscale' : ''
                }`}>
                <PromptsSidebar
                  onPromptSelect={(text) => startBlendSequence(text)}
                  onTextSubmit={(text) => startBlendSequence(text)}
                  onVoiceActivate={() => {
                    console.log("🎤 Voice activation triggered");
                    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                    if (!Recognition) {
                      alert("Speech recognition not supported in this browser.");
                      return;
                    }
                    const recognition = new Recognition();
                    recognition.lang = 'en-US';
                    recognition.onresult = (event: any) => {
                      const transcript = event.results[0][0].transcript;
                      console.log("🗣️ Voice Transcript captured:", transcript);
                      setTranscribedText(transcript);
                      startBlendSequence(transcript);
                    };
                    recognition.start();
                  }}
                />
              </div>

              {/* Center Content */}
              <div className="flex-1 flex flex-col" style={{ paddingBottom: '20px' }}>
                {committedBlend ? (
                  /* Committed State - Blend Calculator */
                  <div className="flex-1 flex items-center justify-center">
                    <BlendCalculator
                      blend={committedBlend}
                      alternateBlends={visibleBlends}
                      onStartOver={handleReset}
                      onSwitchBlend={handleSwitchBlendInCalculator}
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center relative">
                    {/* Logo / Processor */}
                    <div
                      ref={goLogoRef}
                      className={`transition-all duration-700 ${animationState === 'STATE_3_RECOMMENDATION_OUTPUT' ? 'scale-75 -translate-y-8' : 'scale-100'}`}
                    >
                      <ProcessorStateMachine
                        state={animationState}
                        cardsArrived={cardsArrived}
                        totalCards={ingredientCards.length}
                        isInterpreting={isInterpreting}
                      />
                    </div>

                    {(isInterpreting || transcribedText) && !committedBlend && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        className="mt-4 text-sm font-light text-white/60 italic max-w-md text-center"
                      >
                        "{transcribedText || lastUserText}"
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Blend Result Cards - Show only when animation completes */}
              {visibleBlends.length > 0 && animationState === 'STATE_3_RECOMMENDATION_OUTPUT' && (
                <div className="flex-shrink-0 pb-32 px-12 relative z-[100]">
                  <div className="flex flex-col items-center w-full">
                    <div className="flex gap-6 justify-center mb-12">
                      {(visibleBlends || []).map((blend, index) => (
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

                    <div className="flex gap-4">
                      {/* View QR Button */}
                      <button
                        onClick={() => setShowQR(true)}
                        className="px-8 py-4 bg-white/5 hover:bg-white/10
                                    backdrop-blur-xl rounded-2xl
                                    border border-white/10 hover:border-white/20
                                    text-white/60 hover:text-white_80 text-sm uppercase tracking-wider font-medium
                                    transition-all duration-200"
                      >
                        View QR
                      </button>

                      {/* Make Blend Button - Always visible */}
                      <button
                        onClick={handleMakeBlend}
                        className="group relative px-12 py-4 bg-white/[0.08] hover:bg-white/[0.12]
                                     backdrop-blur-2xl rounded-2xl overflow-hidden
                                     shadow-[inset_0_0_0_1px_rgba(212,175,55,0.3)]
                                     hover:shadow-[inset_0_0_0_1px_rgba(212,175,55,0.6),0_8px_32px_rgba(212,175,55,0.25)]
                                     text-white/90 hover:text-white text-base uppercase tracking-wider font-medium
                                     transition-all duration-300 ease-out
                                     hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        <span className="relative z-10">Make This Blend</span>
                      </button>
                    </div>
                  </div>

                  {/* [FLIGHT CHECK] Manual Trigger for Recommendations */}
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => startBlendSequence('Refresh blends')}
                      className="text-xs uppercase tracking-widest text-white/20 hover:text-[#D4AF37] transition-colors"
                    >
                      ↻ Refresh Blends
                    </button>
                  </div>
                </div>
              )}
            </div>
    </div>
      )}

      {/* Demo Mode Banner (Global) */}
      <AnimatePresence>
        {isDemoRunning && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center"
          >
            <div className="bg-[#D4AF37] text-black px-6 py-3 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.4)] flex items-center gap-4 border border-white/20">
              <span className="font-bold text-xs tracking-wider">DEMO {demoStep + 1}/{DEMO_STEPS.length}</span>
              <div className="w-px h-4 bg-black/10" />
              <span className="font-medium text-sm">{DEMO_STEPS[demoStep].text.split('\n')[0]}</span>
              <button
                onClick={() => setIsDemoRunning(false)}
                className="ml-2 w-6 h-6 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 text-[10px] text-[#D4AF37]/80 uppercase tracking-widest font-medium bg-black/80 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
              Visual Walkthrough Active
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How It Works Modal */}
      <AnimatePresence>
        {
          showHowItWorks && (
            <HowItWorks onClose={() => setShowHowItWorks(false)} />
          )
        }
      </AnimatePresence >

      {/* Safe Tile Animation (Visual Only) */}


      {/* Floating Why Panel */}
      {
        animationState === 'STATE_3_RECOMMENDATION_OUTPUT' && mode === 'voice' && !committedBlend && (() => {
          const selectedBlend = visibleBlends.find(b => b.id === selectedBlendId) || visibleBlends[0];
          return (
            <WhyPanel
              isVisible={true}
              blend={selectedBlend}
              intent={currentIntent}
            />
          );
        })()
      }

      <QRCodeModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        blend={committedBlend || visibleBlends.find(b => b.id === selectedBlendId) || visibleBlends[0]!}
      />

      {/* Inventory Tray */}
      {
        mode === 'voice' && !committedBlend && (
          <ScrollContainer
            ref={inventoryRef}
            highlightedStrains={highlightedStrains}
          />
        )
      }

      {
        mode === 'operator' && (
          <AdminOverlay
            mode={mode}
            onShowBusinessOverview={() => setMode('business')}
            onPresetSelect={handlePresetSelect}
            inventory={inventory}
            onUpdateInventory={setInventory}
            isDemoRunning={isDemoRunning}
            demoStep={demoStep}
            onStartDemo={() => {
              setDemoStep(0);
              setIsDemoRunning(true);
            }}
            onStopDemo={() => setIsDemoRunning(false)}
          />
        )
      }

      {
        mode === 'business' && (
          <BusinessOverview
            onClose={() => setMode('operator')}
          />
        )
      }
    </div >
  );
}