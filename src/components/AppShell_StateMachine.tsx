import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollContainer, type ScrollContainerHandle } from './InventoryTray/ScrollContainer';
import { ProcessorStateMachine } from './GoLogo/ProcessorStateMachine';
import { IngredientCardLifting } from './IngredientCardLifting';
import { BlendResultCard } from './BlendResultCard';
import { BlendCalculator } from './BlendCalculator';
import { WhyPanel } from './WhyPanel';
import { PromptsSidebar } from './PromptsSidebar';
import { AdminOverlay } from './AdminOverlay';
import { BusinessOverview } from './BusinessOverview';
import { HowItWorks } from './HowItWorks';
import { AgeGateOverlay } from './AgeGateOverlay';
import { UserTypeGate } from './UserTypeGate';
import { OnboardingScreen } from './OnboardingScreen';
import { AmbientBackground } from './AmbientBackground';
import logoImage from '../assets/logo.png';
import { blendRecommendations } from '../data/blendRecommendations';
import { getStrainColor } from '../utils/strainColors';
import type { AnimationState, IngredientCard } from '../types/animationStates';
import { ANIMATION_TIMINGS } from '../types/animationStates';

type AppMode = 'voice' | 'operator' | 'business';

/**
 * AppShell_StateMachine
 * 
 * State-framed animation implementation (Bolt.new compatible).
 * Four explicit, non-overlapping states with spatial contracts.
 */
export function AppShell_StateMachine() {
  const [ageVerified, setAgeVerified] = useState(false);
  const [userTypeSelected, setUserTypeSelected] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [animationState, setAnimationState] = useState<AnimationState>('STATE_0_IDLE');
  const [mode, setMode] = useState<AppMode>('voice');
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [selectedBlendId, setSelectedBlendId] = useState(1);
  const [committedBlend, setCommittedBlend] = useState<any | null>(null);

  // STATE 2 tracking
  const [ingredientCards, setIngredientCards] = useState<IngredientCard[]>([]);
  const [currentLiftingIndex, setCurrentLiftingIndex] = useState(-1);
  const [cardsArrived, setCardsArrived] = useState(0);
  const [liftingCardPositions, setLiftingCardPositions] = useState<DOMRect[]>([]);

  const inventoryRef = useRef<ScrollContainerHandle>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  /**
   * STATE TRANSITION: 0 → 1 → 2 → 3
   */
  const startBlendSequence = useCallback(async () => {
    if (animationState !== 'STATE_0_IDLE') return;

    // Get selected blend
    const blend = blendRecommendations.find(b => b.id === selectedBlendId) || blendRecommendations[0];

    // Prepare ingredient cards
    const cards: IngredientCard[] = blend.components.map(c => ({
      strain: c.name,
      color: getStrainColor(c.name),
      percentage: c.percentage,
      role: c.role,
      category: c.type as 'Hybrid' | 'Indica' | 'Sativa',
    }));

    setIngredientCards(cards);
    const strainNames = cards.map(c => c.strain);

    // ========================================
    // STATE 1: INVENTORY ALIGNMENT
    // ========================================
    setAnimationState('STATE_1_INVENTORY_ALIGNED');

    // Scroll inventory to center selected strains
    await inventoryRef.current?.scrollToCenter(strainNames);

    // Wait for scroll settle
    await new Promise(resolve => setTimeout(resolve, ANIMATION_TIMINGS.SCROLL_SETTLE));

    // Capture card positions from DOM
    const positions: DOMRect[] = [];
    for (const strainName of strainNames) {
      const pos = inventoryRef.current?.getStrainPosition(strainName);
      if (pos) positions.push(pos);
    }
    setLiftingCardPositions(positions);

    // Hold state to show highlighted cards
    await new Promise(resolve => setTimeout(resolve, 800));

    // ========================================
    // STATE 2: INGREDIENT LIFT (SEQUENTIAL)
    // ========================================
    setAnimationState('STATE_2_INGREDIENT_LIFT');
    setCardsArrived(0);
    setCurrentLiftingIndex(0);

    // Cards will lift sequentially via handleCardArrival

  }, [animationState, selectedBlendId]);

  /**
   * STATE 2: Handle individual card arrival
   * Triggers next card to lift
   */
  const handleCardArrival = useCallback(() => {
    setCardsArrived(prev => {
      const newCount = prev + 1;

      if (newCount < ingredientCards.length) {
        // Lift next card after delay
        setTimeout(() => {
          setCurrentLiftingIndex(newCount);
        }, ANIMATION_TIMINGS.CARD_LIFT_DELAY);
      } else {
        // All cards arrived - transition to STATE 3
        setTimeout(() => {
          setAnimationState('STATE_3_RECOMMENDATION_OUTPUT');
          setCurrentLiftingIndex(-1);
        }, ANIMATION_TIMINGS.CARD_LIFT_DELAY);
      }

      return newCount;
    });
  }, [ingredientCards.length]);

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
    const selectedBlend = blendRecommendations.find(b => b.id === selectedBlendId);
    if (selectedBlend) {
      setCommittedBlend(selectedBlend);
    }
  };

  const handleSelectBlend = (id: number) => {
    setSelectedBlendId(id);
  };

  const handleSwitchBlendInCalculator = (id: number) => {
    const newBlend = blendRecommendations.find(b => b.id === id);
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

  if (!ageVerified) {
    return <AgeGateOverlay onVerify={() => setAgeVerified(true)} />;
  }

  if (!userTypeSelected) {
    return (
      <UserTypeGate
        onFirstTime={() => setUserTypeSelected(true)}
        onReturning={() => {
          setUserTypeSelected(true);
          setOnboardingComplete(true); // Skip onboarding
        }}
      />
    );
  }

  if (!onboardingComplete) {
    return <OnboardingScreen onComplete={() => setOnboardingComplete(true)} />;
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] text-white flex flex-col overflow-hidden relative">
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
            className="w-10 h-auto"
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
        </div>
      </div>

      {/* Main Application */}
      <div className="flex-1 relative overflow-hidden">
        {mode === 'voice' ? (
          <div className="w-full h-full flex">
            {/* Left Sidebar - Hidden when not idle */}
            <div className={`transition-all duration-700 ease-out ${animationState === 'STATE_0_IDLE' ? 'w-80' : 'w-0'
              } overflow-hidden`}>
              <PromptsSidebar onPromptSelect={startBlendSequence} />
            </div>

            {/* Center Content */}
            <div className="flex-1 flex flex-col" style={{ paddingBottom: '120px' }}>
              {committedBlend ? (
                /* Committed State - Blend Calculator */
                <div className="flex-1 flex items-center justify-center">
                  <BlendCalculator
                    blend={committedBlend}
                    alternateBlends={blendRecommendations}
                    onStartOver={handleReset}
                    onSwitchBlend={handleSwitchBlendInCalculator}
                  />
                </div>
              ) : (
                <>
                  {/* Logo / Processor */}
                  <div className="flex-1 flex items-center justify-center">
                    {(animationState === 'STATE_0_IDLE' ||
                      animationState === 'STATE_1_INVENTORY_ALIGNED' ||
                      animationState === 'STATE_2_INGREDIENT_LIFT') && (
                        <div ref={logoRef}>
                          <ProcessorStateMachine
                            state={animationState}
                            cardsArrived={cardsArrived}
                            totalCards={ingredientCards.length}
                          />
                        </div>
                      )}
                  </div>

                  {/* STATE 3: Blend Result Cards */}
                  {animationState === 'STATE_3_RECOMMENDATION_OUTPUT' && (
                    <div className="flex-shrink-0 pb-8 px-12">
                      <div className="flex flex-col items-center w-full">
                        <div className="flex gap-6 justify-center mb-12">
                          {blendRecommendations.map((blend, index) => (
                            <BlendResultCard
                              key={blend.id}
                              blend={blend}
                              isSelected={blend.id === selectedBlendId}
                              onSelect={() => handleSelectBlend(blend.id)}
                              index={index}
                            />
                          ))}
                        </div>

                        {/* Make Blend Button */}
                        <button
                          onClick={handleMakeBlend}
                          className="px-12 py-4 bg-white/[0.08] hover:bg-white/[0.12]
                                   backdrop-blur-2xl rounded-2xl
                                   shadow-[inset_0_0_0_1px_rgba(212,175,55,0.3)]
                                   hover:shadow-[inset_0_0_0_1px_rgba(212,175,55,0.5),0_8px_32px_rgba(212,175,55,0.2)]
                                   text-white/90 hover:text-white text-base uppercase tracking-wider font-medium
                                   transition-all duration-200 ease-out"
                        >
                          Make This Blend
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : mode === 'operator' ? (
          <AdminOverlay
            onShowBusinessOverview={() => setMode('business')}
          />
        ) : (
          <BusinessOverview
            onClose={() => setMode('operator')}
          />
        )}
      </div>

      {/* How It Works Modal */}
      <AnimatePresence>
        {showHowItWorks && (
          <HowItWorks onClose={() => setShowHowItWorks(false)} />
        )}
      </AnimatePresence>

      {/* STATE 2: Lifting Cards (Sequential) */}
      {animationState === 'STATE_2_INGREDIENT_LIFT' &&
        currentLiftingIndex >= 0 &&
        currentLiftingIndex < ingredientCards.length &&
        liftingCardPositions[currentLiftingIndex] && (
          <IngredientCardLifting
            key={`lifting-${currentLiftingIndex}-${ingredientCards[currentLiftingIndex].strain}`}
            ingredient={ingredientCards[currentLiftingIndex]}
            startPosition={liftingCardPositions[currentLiftingIndex]}
            logoPosition={logoPosition}
            isLifting={true}
            onArrival={handleCardArrival}
          />
        )}

      {/* Floating Why Panel */}
      {animationState === 'STATE_3_RECOMMENDATION_OUTPUT' && mode === 'voice' && !committedBlend && (
        <WhyPanel
          confidence="98.4"
          explanation="This recommendation is driven primarily by myrcene, which provides deep physical relaxation. Caryophyllene acts as a stabilizer, helping to reduce physical tension and anxiety."
          isVisible={true}
        />
      )}

      {/* Inventory Tray */}
      {mode === 'voice' && !committedBlend && (
        <ScrollContainer
          ref={inventoryRef}
          highlightedStrains={highlightedStrains}
        />
      )}
    </div>
  );
}