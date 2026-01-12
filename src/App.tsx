import { useState, useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { MobileBlendView } from './components/MobileBlendView';

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
      <AppShell />
    </>
  );
}
