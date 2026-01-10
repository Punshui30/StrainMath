import React, { useState, useEffect } from 'react';
import { useApp } from '../state/AppContext';
import { useRouter } from '../router/Router';
import { InventoryTray } from '../components/InventoryTray';
import { GoLogoProcessor } from '../components/GoLogoProcessor';
import { BlendResultCard } from '../components/BlendResultCard';
import { Mic, Loader, AlertCircle } from 'lucide-react';
import type { BlendOption } from '../types';
import { calculateBlends } from '../engine/calculator';
import { createInventory, goalsToIntent, engineOutputToBlendOptions, validateInventoryForEngine } from '../engine/adapters';

export function Calculator() {
  const {
    mode,
    animationState,
    inventory,
    blendOptions,
    activeBlend,
    userGoals,
    setMode,
    setAnimationState,
    setBlendOptions,
    setActiveBlend,
    commitBlend
  } = useApp();

  const { navigate } = useRouter();

  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollToStrainIds, setScrollToStrainIds] = useState<string[]>([]);
  const [cardsInProcessor, setCardsInProcessor] = useState(0);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  const handleStartListening = () => {
    setMode('listening');
    setCalculationError(null);

    setTimeout(() => {
      setMode('analyzing');

      setTimeout(() => {
        calculateBlendsForIntent();
      }, 1500);
    }, 2000);
  };

  const calculateBlendsForIntent = () => {
    try {
      // Convert app inventory to engine inventory
      const engineInventory = createInventory(inventory);
      
      // Validate inventory before engine call (adapter enforces constraints, doesn't compensate)
      const validationError = validateInventoryForEngine(engineInventory);
      if (validationError) {
        setCalculationError(validationError);
        setMode('idle');
        return;
      }

      // Convert user goals to engine Intent
      const intent = goalsToIntent(userGoals);

      // Run deterministic engine (will throw if invariant violated)
      const output = calculateBlends(engineInventory, intent);

      // Handle engine errors (non-invariant violations)
      if (output.error) {
        let errorMessage = 'Unable to calculate blends';
        switch (output.error) {
          case 'NO_INVENTORY':
            errorMessage = 'No inventory available';
            break;
          case 'NO_AVAILABLE_CULTIVARS':
            errorMessage = 'No available strains in inventory';
            break;
          case 'NO_VALID_BLEND':
            errorMessage = 'No blends found that satisfy constraints. Try adjusting your goals or anxiety tolerance.';
            break;
          default:
            errorMessage = output.errorReason || errorMessage;
        }
        setCalculationError(errorMessage);
        setMode('idle');
        return;
      }

      // Convert engine output to app BlendOptions
      const strainMap = new Map(inventory.map(s => [s.id, s]));
      const blendOptions = engineOutputToBlendOptions(output, strainMap, userGoals);

      if (blendOptions.length === 0) {
        setCalculationError('No valid blends found. Ensure you have at least 3 available strains and that your goals can be satisfied.');
        setMode('idle');
        return;
      }

      // Take top 5 options (or fewer if less available)
      const topOptions = blendOptions.slice(0, 5);
      setBlendOptions(topOptions);
      setMode('assembling');

      // Collect strain IDs from all recommendations for scrolling
      const selectedStrainIds = new Set<string>();
      topOptions.forEach(option => {
        selectedStrainIds.add(option.components.driver.strain.id);
        selectedStrainIds.add(option.components.modulator.strain.id);
        selectedStrainIds.add(option.components.anchor.strain.id);
      });
      setScrollToStrainIds(Array.from(selectedStrainIds));
      setIsScrolling(true);
    } catch (error) {
      console.error('Error calculating blends:', error);
      // Engine throws on invariant violations - display the error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An error occurred during calculation. Please try again.';
      setCalculationError(errorMessage);
      setMode('idle');
    }
  };

  const handleScrollComplete = () => {
    setIsScrolling(false);
    setAnimationState('cards_lifting');

    setTimeout(() => {
      setAnimationState('cards_moving_to_logo');
      setCardsInProcessor(1);

      setTimeout(() => {
        setCardsInProcessor(2);

        setTimeout(() => {
          setCardsInProcessor(3);
          setAnimationState('logo_processing');
        }, 300);
      }, 300);
    }, 600);
  };

  const handleProcessingComplete = () => {
    setAnimationState('cards_emitting');

    setTimeout(() => {
      setAnimationState('complete');
      setCardsInProcessor(0);

      setTimeout(() => {
        setAnimationState('none');
      }, 500);
    }, 1000);
  };

  const handleSelectBlend = (blend: BlendOption) => {
    setActiveBlend(blend);
  };

  const handleCommitBlend = async (blend: BlendOption) => {
    await commitBlend(blend);
    navigate('blend-commit');
  };

  useEffect(() => {
    if (animationState === 'inventory_scrolling') {
      setIsScrolling(true);
    }
  }, [animationState]);

  const isProcessing = animationState === 'logo_processing' || animationState === 'cards_moving_to_logo';
  const showResults = mode === 'assembling' && (animationState === 'complete' || animationState === 'none') && blendOptions.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 py-6 px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Guided Outcome Calculator</h1>
          <div className="flex items-center gap-4">
            <span className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${mode === 'idle' ? 'bg-gray-100 text-gray-700' : ''}
              ${mode === 'listening' ? 'bg-blue-100 text-blue-700' : ''}
              ${mode === 'analyzing' ? 'bg-amber-100 text-amber-700' : ''}
              ${mode === 'assembling' ? 'bg-emerald-100 text-emerald-700' : ''}
              ${mode === 'committed' ? 'bg-green-100 text-green-700' : ''}
            `}>
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-8">
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Available Inventory</h2>
              <span className="text-sm text-gray-600">{inventory.length} strains available</span>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <InventoryTray
                strains={inventory}
                scrollToStrainIds={scrollToStrainIds}
                onScrollComplete={handleScrollComplete}
                isScrolling={isScrolling}
              />
            </div>
          </section>

          <section className="flex justify-center py-8">
            <GoLogoProcessor
              isProcessing={isProcessing}
              cardsInProcessor={cardsInProcessor}
              onProcessingComplete={handleProcessingComplete}
            />
          </section>

          {mode === 'idle' && (
            <section className="flex justify-center">
              <button
                onClick={handleStartListening}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all flex items-center gap-3 shadow-lg"
              >
                <Mic className="w-5 h-5" />
                Start Guided Session
              </button>
            </section>
          )}

          {(mode === 'listening' || mode === 'analyzing') && (
            <section className="flex justify-center">
              <div className="bg-white rounded-xl shadow-lg p-8 flex items-center gap-4">
                <Loader className="w-6 h-6 text-emerald-600 animate-spin" />
                <span className="text-lg font-medium text-gray-900">
                  {mode === 'listening' ? 'Listening to your preferences...' : 'Analyzing best matches...'}
                </span>
              </div>
            </section>
          )}

          {calculationError && (
            <section className="flex justify-center">
              <div className="bg-red-50 border border-red-200 rounded-xl shadow-lg p-6 max-w-2xl w-full">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Calculation Error</h3>
                    <p className="text-red-700 mb-4">{calculationError}</p>
                    <button
                      onClick={() => {
                        setCalculationError(null);
                        handleStartListening();
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {showResults && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Personalized Blends</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {blendOptions.map(option => (
                  <BlendResultCard
                    key={option.id}
                    blendOption={option}
                    isActive={activeBlend?.id === option.id}
                    onSelect={handleSelectBlend}
                    onCommit={handleCommitBlend}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
