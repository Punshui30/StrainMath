import React from 'react';
import { AppProvider } from './state/AppContext';
import { Router, useRouter } from './router/Router';
import { AgeGate } from './pages/AgeGate';
import { FirstTimeOnboarding } from './pages/FirstTimeOnboarding';
import { Calculator } from './pages/Calculator';
import { BlendCommit } from './pages/BlendCommit';

function AppRoutes() {
  const { currentRoute } = useRouter();

  switch (currentRoute) {
    case 'age-gate':
      return <AgeGate />;
    case 'first-time-onboarding':
      return <FirstTimeOnboarding />;
    case 'calculator':
      return <Calculator />;
    case 'blend-commit':
      return <BlendCommit />;
    default:
      return <AgeGate />;
  }
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
