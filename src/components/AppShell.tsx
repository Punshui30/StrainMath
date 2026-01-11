import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceInterface } from './VoiceInterface';
import { PromptsSidebar } from './PromptsSidebar';
import { InventoryTray, type InventoryTrayHandle } from './InventoryTray';
import { BlendOptions } from './BlendOptions';
import { BlendCalculator } from './BlendCalculator';
import { WhyPanel } from './WhyPanel';
import { AdminOverlay } from './AdminOverlay';
import { BusinessOverview } from './BusinessOverview';
import { HowItWorks } from './HowItWorks';
import { AnimatedCards } from './AnimatedCards';
import { AgeGateOverlay } from './AgeGateOverlay';
import { AmbientBackground } from './AmbientBackground';
import logoImage from '../assets/logo.png';
import { blendRecommendations, type BlendRecommendation } from '../data/blendRecommendations';

type VoiceState = 'idle' | 'listening' | 'analyzing' | 'resolved' | 'assembling' | 'committed';
type AppMode = 'voice' | 'operator' | 'business';

interface AnimatedCard {
  strain: string;
  role: string;
  category: 'Hybrid' | 'Indica' | 'Sativa';
  percentage: number;
  startPosition: { x: number; y: number };
  targetBlendIndex: number;
}

export function AppShell() {
  const [ageVerified, setAgeVerified] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [mode, setMode] = useState<AppMode>('voice');
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [selectedBlendId, setSelectedBlendId] = useState(1);
  const [committedBlend, setCommittedBlend] = useState<BlendRecommendation | null>(null);
  const [animatedCards, setAnimatedCards] = useState<AnimatedCard[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const inventoryRef = useRef<InventoryTrayHandle>(null);

  const handleVoiceActivation = async () => {
    if (voiceState === 'idle') {
      setVoiceState('listening');
      setTimeout(async () => {
        setVoiceState('analyzing');

        // Get the selected blend to extract ingredients
        const blend = blendRecommendations.find(b => b.id === selectedBlendId) || blendRecommendations[0];

        // **PHASE 0: Pre-alignment - Scroll inventory tray to center all strain cards**
        const strainNames = blend.components.map(c => c.name);
        await inventoryRef.current?.scrollToStrains(strainNames);

        // Wait for tray to come to complete rest (700ms scroll + 200ms settle buffer)
        await new Promise(resolve => setTimeout(resolve, 200));

        // **NOW capture card positions - tray is stationary**
        const cards: AnimatedCard[] = [];

        for (let i = 0; i < blend.components.length; i++) {
          const component = blend.components[i];

          // Get the card position AFTER scroll is complete
          const cardPosition = inventoryRef.current?.getStrainCardPosition(component.name);

          if (cardPosition) {
            cards.push({
              strain: component.name,
              role: component.role,
              category: component.type as 'Hybrid' | 'Indica' | 'Sativa',
              percentage: component.percentage,
              startPosition: {
                x: cardPosition.left + cardPosition.width / 2,
                y: cardPosition.top + cardPosition.height / 2,
              },
              targetBlendIndex: i,
            });
          }
        }

        // Start animation ONLY after inventory is aligned and stationary
        setAnimatedCards(cards);
        setIsAnimating(true);

        // Phase 1 + Phase 2: 3 ingredients × 350ms = 1050ms + 400ms processing glow = 1450ms
        setTimeout(() => {
          setIsAnimating(false);
          setAnimatedCards([]);
          setVoiceState('resolved');
        }, 1450);
      }, 2000);
    }
  };

  const handleReset = () => {
    setVoiceState('idle');
    setSelectedBlendId(1);
    setCommittedBlend(null);
    setIsAnimating(false);
    setAnimatedCards([]);
  };

  const handleMakeBlend = () => {
    const selectedBlend = blendRecommendations.find(b => b.id === selectedBlendId);
    if (selectedBlend) {
      setCommittedBlend(selectedBlend);
      setVoiceState('assembling');
      setTimeout(() => {
        setVoiceState('committed');
      }, 2500);
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

  const selectedBlend = blendRecommendations.find(b => b.id === selectedBlendId);

  if (!ageVerified) {
    return <AgeGateOverlay onVerify={() => setAgeVerified(true)} />;
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] text-white flex flex-col overflow-hidden relative">
      {/* Ambient Background - Changes based on vibe/state */}
      <AmbientBackground
        imageUrl={voiceState === 'resolved'
          ? "https://images.unsplash.com/photo-1582095127899-1dfb05e4e32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          : "https://images.unsplash.com/photo-1714065712817-af7d54710a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        }
        opacity={voiceState === 'idle' ? 0.04 : 0.06}
      />

      {/* Minimal Header */}
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
          {/* How It Works - Only visible in voice mode */}
          {mode === 'voice' && voiceState === 'idle' && (
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
            {/* Left Sidebar - Hidden by default, slides in contextually */}
            <div className={`transition-all duration-700 ease-out ${voiceState === 'idle' ? 'w-80' : 'w-0'
              } overflow-hidden`}>
              <PromptsSidebar onPromptSelect={() => handleVoiceActivation()} />
            </div>

            {/* Center - Voice Interface + Blend Options (full width) */}
            <div className="flex-1 flex flex-col" style={{ paddingBottom: '120px' }}>
              {voiceState === 'committed' && committedBlend ? (
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
                  {/* Voice Interface - Always centered */}
                  <div className="flex-1 flex items-center justify-center">
                    <VoiceInterface
                      state={voiceState}
                      onActivate={handleVoiceActivation}
                      onReset={handleReset}
                      selectedBlend={selectedBlend}
                    />
                  </div>

                  {/* Blend Options - Always visible when resolved, positioned above inventory */}
                  {voiceState === 'resolved' && (
                    <div className="flex-shrink-0 pb-8 px-12">
                      <BlendOptions
                        blends={blendRecommendations}
                        selectedBlendId={selectedBlendId}
                        onSelectBlend={handleSelectBlend}
                        onMakeBlend={handleMakeBlend}
                      />
                    </div>
                  )}

                  {/* Assembling State */}
                  {voiceState === 'assembling' && (
                    <div className="flex-[0.4] flex items-center justify-center px-12">
                      <div className="flex gap-6 items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="w-64 h-32 rounded-2xl backdrop-blur-2xl bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.4),0_0_40px_rgba(212,175,55,0.2)] flex items-center justify-center"
                        >
                          <div className="text-center">
                            <div className="text-xs uppercase tracking-wider text-[#D4AF37]/70 mb-2 font-medium">Driver</div>
                            <div className="text-lg text-white/90 font-light">Blue Dream</div>
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="w-64 h-32 rounded-2xl backdrop-blur-2xl bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.4),0_0_40px_rgba(212,175,55,0.2)] flex items-center justify-center"
                        >
                          <div className="text-center">
                            <div className="text-xs uppercase tracking-wider text-[#D4AF37]/70 mb-2 font-medium">Modulator</div>
                            <div className="text-lg text-white/90 font-light">Northern Lights</div>
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 }}
                          className="w-64 h-32 rounded-2xl backdrop-blur-2xl bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.4),0_0_40px_rgba(212,175,55,0.2)] flex items-center justify-center"
                        >
                          <div className="text-center">
                            <div className="text-xs uppercase tracking-wider text-[#D4AF37]/70 mb-2 font-medium">Anchor</div>
                            <div className="text-lg text-white/90 font-light">Blueberry</div>
                          </div>
                        </motion.div>
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

      {/* How It Works Modal - End-user education */}
      <AnimatePresence>
        {showHowItWorks && (
          <HowItWorks onClose={() => setShowHowItWorks(false)} />
        )}
      </AnimatePresence>

      {/* Floating Why Panel - Fixed width, never compresses */}
      {voiceState === 'resolved' && mode === 'voice' && (
        <WhyPanel
          confidence="98.4"
          explanation="This recommendation is driven primarily by myrcene, which provides deep physical relaxation. Caryophyllene acts as a stabilizer, helping to reduce physical tension and anxiety."
          isVisible={true}
        />
      )}

      {/* Fixed Inventory Tray - Always at bottom in voice mode */}
      {mode === 'voice' && voiceState !== 'committed' && (
        <InventoryTray ref={inventoryRef} />
      )}

      {/* Animated Cards - Flies from inventory to logo to blend positions */}
      {isAnimating && animatedCards.length > 0 && (
        <AnimatedCards
          cards={animatedCards}
          logoPosition={{
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          }}
          blendCardPositions={[
            { x: window.innerWidth / 2 - 400, y: window.innerHeight - 300 },
            { x: window.innerWidth / 2, y: window.innerHeight - 300 },
            { x: window.innerWidth / 2 + 400, y: window.innerHeight - 300 },
          ]}
          onPhaseComplete={() => {
            setIsAnimating(false);
            setAnimatedCards([]);
            setVoiceState('resolved');
          }}
        />
      )}
    </div>
  );
}
