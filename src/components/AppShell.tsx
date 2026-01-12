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
import { assembleBlends } from '../engine/scoring';
import type { BlendRecommendation } from '../types/blend';
import { MOCK_COAS } from '../../data/mockCoas';

// Generate blend recommendations using the engine (canonical source)
const blendRecommendations = assembleBlends([]);

type VoiceState = 'idle' | 'listening' | 'analyzing' | 'resolved' | 'assembling' | 'committed';
type AppMode = 'voice' | 'operator' | 'business';

export function AppShell() {
  const [hasVerifiedAge, setHasVerifiedAge] = useState(false);
  const [mode, setMode] = useState<AppMode>('voice');
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [selectedBlendId, setSelectedBlendId] = useState(1);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showBusinessWalkthrough, setShowBusinessWalkthrough] = useState(false);

  // New State for compatibility with updated components
  const [inventory, setInventory] = useState(MOCK_COAS);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // Animation State
  const [cardsArrived, setCardsArrived] = useState(false);
  const [committedBlend, setCommittedBlend] = useState<BlendRecommendation | null>(null);

  const inventoryRef = useRef<InventoryTrayHandle>(null);

  const handleAgeVerified = () => {
    setHasVerifiedAge(true);
  };

  const handleVoiceActivate = () => {
    setVoiceState('listening');
    // Simulate flow
    setTimeout(() => setVoiceState('analyzing'), 2000);
    setTimeout(() => {
      setVoiceState('resolved');
    }, 4500);
  };

  const handleReset = () => {
    setVoiceState('idle');
    setCardsArrived(false);
    setCommittedBlend(null);
    setSelectedBlendId(1);
  };

  const handleCommitBlend = (blend: BlendRecommendation) => {
    setVoiceState('assembling');
    setCommittedBlend(blend);
    setTimeout(() => setVoiceState('committed'), 2000);
  };

  const handleAnimationComplete = () => {
    setCardsArrived(true);
  };

  // Find selected blend safely
  const selectedBlend = blendRecommendations.find(b => b.id === selectedBlendId) || blendRecommendations[0];

  return (
    <div className="fixed inset-0 bg-[#0A0A0B] text-white overflow-hidden font-sans selection:bg-[#D4AF37]/30">
      <AmbientBackground state={voiceState} />

      {/* Age Gate */}
      <AnimatePresence>
        {!hasVerifiedAge && (
          <AgeGateOverlay
            onEnterNewUser={handleAgeVerified}
            onEnterReturningUser={handleAgeVerified}
            onEnterOperator={() => {
              handleAgeVerified();
              setMode('operator');
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {mode === 'voice' ? (
          <motion.div
            key="voice-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full"
          >
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-2 opacity-50">
                <img src={logoImage} alt="GO LINE" className="h-6 w-auto" />
              </div>
              <button
                onClick={() => setMode('operator')}
                className="text-xs uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors"
              >
                Operator Mode
              </button>
            </header>

            {/* Application Flow */}
            <AnimatePresence mode="wait">
              {committedBlend ? (
                <motion.div
                  key="calculator"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full h-full pt-20"
                >
                  <BlendCalculator
                    blend={committedBlend}
                    alternateBlends={blendRecommendations}
                    onSwitchBlend={(id) => {
                      const newBlend = blendRecommendations.find(b => b.id === id);
                      if (newBlend) setCommittedBlend(newBlend);
                    }}
                    onStartOver={handleReset}
                    onBack={() => setCommittedBlend(null)}
                    onToggleQR={() => setShowQR(true)}
                  />
                </motion.div>
              ) : (
                <div className="w-full h-full flex">
                  {/* Left Sidebar - Only visible in idle/resolved states */}
                  <AnimatePresence>
                    {(voiceState === 'idle' || voiceState === 'resolved') && (
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="w-80 h-full border-r border-white/5 bg-black/20 backdrop-blur-sm z-40"
                      >
                        <PromptsSidebar
                          onPromptSelect={() => handleVoiceActivate()}
                          onTextSubmit={() => handleVoiceActivate()}
                          onStrainChase={() => handleVoiceActivate()}
                          onVoiceActivate={handleVoiceActivate}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Main Interaction Area */}
                  <div className="flex-1 relative">
                    {/* Voice Core */}
                    <VoiceInterface
                      state={voiceState}
                      onActivate={handleVoiceActivate}
                      onReset={handleReset}
                      selectedBlend={selectedBlend}
                      isProcessing={voiceState === 'analyzing'}
                    />

                    {/* Card Animation Layer */}
                    {voiceState === 'resolved' && (
                      <AnimatedCards
                        cards={[
                          { strain: 'Blue Dream', role: 'Driver', category: 'Sativa', percentage: 50, startPosition: { x: 0, y: 0 }, targetBlendIndex: 0 },
                          { strain: 'Northern Lights', role: 'Modulator', category: 'Indica', percentage: 30, startPosition: { x: 0, y: 0 }, targetBlendIndex: 0 },
                          { strain: 'OG Kush', role: 'Anchor', category: 'Hybrid', percentage: 20, startPosition: { x: 0, y: 0 }, targetBlendIndex: 0 },
                        ]}
                        logoPosition={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}
                        blendCardPositions={[]}
                        onPhaseComplete={handleAnimationComplete}
                      />
                    )}

                    {/* Blend Selection (Bottom) */}
                    <AnimatePresence>
                      {voiceState === 'resolved' && (
                        <BlendOptions
                          blends={blendRecommendations}
                          selectedId={selectedBlendId}
                          onSelect={setSelectedBlendId}
                          onCommit={() => selectedBlend && handleCommitBlend(selectedBlend)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <AdminOverlay
            key="admin-overlay"
            mode={mode}
            onClose={() => setMode('voice')}
            onShowBusinessOverview={() => setShowBusinessWalkthrough(true)}
            inventory={inventory}
            onUpdateInventory={setInventory}
            isDemoRunning={isDemoRunning}
            demoStep={demoStep}
            onStartDemo={() => setIsDemoRunning(true)}
            onStopDemo={() => setIsDemoRunning(false)}
          />
        )}
      </AnimatePresence>

      {/* Overlays */}
      <AnimatePresence>
        {showExplanation && selectedBlend && (
          <WhyPanel
            isVisible={showExplanation}
            blend={selectedBlend}
            intent={selectedBlend.targets || null}
          />
        )}
      </AnimatePresence>

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
