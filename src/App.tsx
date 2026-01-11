import { useState, useEffect } from 'react';
import { AppShell_StateMachine } from './components/AppShell_StateMachine';
import { MobileBlendView } from './components/MobileBlendView';


import { VisualFlyInOverlay } from './components/VisualFlyInOverlay';

export default function App() {
  const [isBlendRoute, setIsBlendRoute] = useState(false);

  useEffect(() => {
    if (window.location.pathname === '/blend') {
      setIsBlendRoute(true);
    }
  }, []);

  if (isBlendRoute) {
    return <MobileBlendView />;
  }

  return (
    <>
      <AppShell_StateMachine />
      <VisualFlyInOverlay />
    </>
  );
}
