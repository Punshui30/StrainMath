import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { useApp } from '../state/AppContext';
import { Sparkles, ArrowRight } from 'lucide-react';

const COMMON_GOALS = [
  'Relaxation',
  'Focus',
  'Creativity',
  'Sleep',
  'Pain Relief',
  'Energy',
  'Anxiety Relief',
  'Social'
];

export function FirstTimeOnboarding() {
  const { navigate } = useRouter();
  const { setUserGoals } = useApp();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleContinue = () => {
    setUserGoals(selectedGoals);
    navigate('calculator');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Guided Outcomes</h1>
          <p className="text-gray-600">
            Let's personalize your experience. What are you looking to achieve?
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Select your goals (optional)</h2>
          <div className="grid grid-cols-2 gap-3">
            {COMMON_GOALS.map(goal => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`
                  py-3 px-4 rounded-xl font-medium transition-all
                  ${selectedGoals.includes(goal)
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          Continue to Calculator
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
