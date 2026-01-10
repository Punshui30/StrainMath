import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { ShieldCheck } from 'lucide-react';

export function AgeGate() {
  const { navigate } = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyAge = (isOfAge: boolean) => {
    if (isOfAge) {
      setIsVerifying(true);
      setTimeout(() => {
        navigate('first-time-onboarding');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Age Verification</h1>
          <p className="text-gray-600">
            You must be 21 or older to access this application
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleVerifyAge(true)}
            disabled={isVerifying}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {isVerifying ? 'Verifying...' : 'I am 21 or older'}
          </button>
          <button
            onClick={() => handleVerifyAge(false)}
            disabled={isVerifying}
            className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            I am under 21
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          By entering, you agree to our terms of service and privacy policy
        </p>
      </div>
    </div>
  );
}
