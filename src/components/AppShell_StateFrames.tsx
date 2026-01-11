import { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PromptsSidebar } from './PromptsSidebar';
import { ScrollContainer, type ScrollContainerHandle } from './InventoryTray/ScrollContainer';
import { Processor } from './GoLogo/Processor';
import { BlendResultCard } from './BlendResultCard';
import { BlendCalculator } from './BlendCalculator';
import { WhyPanel } from './WhyPanel';
import { AdminOverlay } from './AdminOverlay';
import { BusinessOverview } from './BusinessOverview';
import { HowItWorks } from './HowItWorks';
import { AgeGateOverlay } from './AgeGateOverlay';
import { AmbientBackground } from './AmbientBackground';
import logoImage from '../assets/logo.png';
import { blendRecommendations, type BlendRecommendation } from '../data/blendRecommendations';
import type { BlendAnimationState, BlendIngredient } from '../types/blendStates';

type AppMode = 'voice' | 'operator' | 'business';

/**
 * AppShell - State-Driven Frames
 * 
 * Uses explicit state frames instead of motion chains:
 * - FRAME A: inventory_resolved
 * - FRAME B: blending_in_progress
 * - FRAME C: blend_output
 */
export function AppShell_StateFrames() {
  const [ageVerified, setAgeVerified] = useState(false);
  const [blendState, setBlendState] = useState<BlendAnimationState>('idle');
  const [mode, setMode] = useState<AppMode>('voice');
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [selectedBlendId, setSelectedBlendId] = useState(1);
  const [committedBlend, setCommittedBlend] = useState<BlendRecommendation | null>(null);
  const [currentIngredients, setCurrentIngredients] = useState<BlendIngredient[]>([]);

  const inventoryRef = useRef<ScrollContainerHandle>(null);

  const handleVoiceActivation = async () => {
    if (blendState === 'idle') {
      // Voice listening phase
      setBlendState('idle'); // Keep as idle during listening

      setTimeout(async () => {
        // Get selected blend ingredients
        const blend = blendRecommendations.find(b => b.id === selectedBlendId) || blendRecommendations[0];
        const strainNames = blend.components.map(c => c.name);
        const ingredients: BlendIngredient[] = blend.components.map(c => ({
          strain: c.name,
          role: c.role,
          category: c.type as 'Hybrid' | 'Indica' | 'Sativa',
          percentage: c.percentage,
        }));

        setCurrentIngredients(ingredients);

        // **FRAME A: inventory_resolved**
        // Scroll inventory to center selected strains
        await inventoryRef.current?.scrollToCenter(strainNames);

        // Hold frame to show highlighted strains
        setBlendState('inventory_resolved');

        await new Promise(resolve => setTimeout(resolve, 1200)); // Hold for visibility

        // **FRAME B: blending_in_progress**
        // Logo processes, ingredient tokens visible
        setBlendState('blending_in_progress');

        await new Promise(resolve => setTimeout(resolve, 1800)); // Processing time

        // **FRAME C: blend_output**
        // Show blend recommendation cards
        setBlendState('blend_output');

      }, 2000); // Initial listening delay
    }
  };

  const handleReset = () => {
    setBlendState('idle');
    setSelectedBlendId(1);
    setCommittedBlend(null);
    setCurrentIngredients([]);
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

  // Determine which strains should be highlighted in inventory
  const highlightedStrains = blendState === 'inventory_resolved'
    ? currentIngredients.map(i => i.strain)
    : [];

  // Determine logo/processor state
  const processorState =
    blendState === 'inventory_resolved' ? 'analyzing' :
      blendState === 'blending_in_progress' ? 'processing' :
        'idle';

  if (!ageVerified) {
    return <AgeGateOverlay onVerify={() => setAgeVerified(true)} />;
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] text-white flex flex-col overflow-hidden relative">
      {/* Ambient Background */}
      <AmbientBackground
        imageUrl={blendState === 'blend_output'
          ? "https://images.unsplash.com/photo-1582095127899-1dfb05e4e32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          : "https://images.unsplash.com/photo-1714065712817-af7d54710a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        }
        opacity={blendState === 'idle' ? 0.04 : 0.06}
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
          {mode === 'voice' && blendState === 'idle' && (
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
            <div className={`transition-all duration-700 ease-out ${blendState === 'idle' ? 'w-80' : 'w-0'
              } overflow-hidden`}>
              <PromptsSidebar onPromptSelect={() => handleVoiceActivation()} />
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
                  {/* Voice Interface + Logo Processor */}
                  <div className="flex-1 flex items-center justify-center">
                    {(blendState === 'idle' || blendState === 'inventory_resolved' || blendState === 'blending_in_progress') && (
                      <Processor
                        state={processorState}
                        ingredients={blendState === 'blending_in_progress' ? currentIngredients : []}
                      />
                    )}
                  </div>

                  {/* FRAME C: Blend Result Cards */}
                  {blendState === 'blend_output' && (
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

      {/* Floating Why Panel */}
      {blendState === 'blend_output' && mode === 'voice' && (
        <WhyPanel
          confidence="98.4"
          explanation="This recommendation is driven primarily by myrcene, which provides deep physical relaxation. Caryophyllene acts as a stabilizer, helping to reduce physical tension and anxiety."
          isVisible={true}
        />
      )}

      {/* FRAME A + B: Inventory Tray (visible, with highlighted strains) */}
      {mode === 'voice' && !committedBlend && (
        <ScrollContainer
          ref={inventoryRef}
          highlightedStrains={highlightedStrains}
        />
      )}
    </div>
  );
}
