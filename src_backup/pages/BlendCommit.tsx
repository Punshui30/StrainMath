import React from 'react';
import { useRouter } from '../router/Router';
import { useApp } from '../state/AppContext';
import { CheckCircle, Home } from 'lucide-react';
import { BlendCompositionBreakdown } from '../components/BlendCompositionBreakdown';

export function BlendCommit() {
  const { navigate } = useRouter();
  const { activeBlend, resetApp } = useApp();

  const handleStartNew = () => {
    resetApp();
    navigate('calculator');
  };

  if (!activeBlend) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No blend committed</p>
          <button
            onClick={() => navigate('calculator')}
            className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl"
          >
            Return to Calculator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blend Committed!</h1>
          <p className="text-gray-600">
            Your personalized blend has been saved
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Blend</h2>
          <BlendCompositionBreakdown
            components={activeBlend.components}
            confidenceRange={{
              min: activeBlend.confidence_min,
              max: activeBlend.confidence_max
            }}
            vibeEmphasis={activeBlend.vibe_emphasis}
          />
        </div>

        {activeBlend.outcome_goals.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Goals</h2>
            <div className="flex flex-wrap gap-2">
              {activeBlend.outcome_goals.map((goal, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full font-medium"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleStartNew}
            className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Create New Blend
          </button>
        </div>
      </div>
    </div>
  );
}
