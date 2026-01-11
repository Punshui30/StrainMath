import React, { useState, createContext, useContext } from 'react';

export type Route = 'age-gate' | 'first-time-onboarding' | 'returning-user' | 'calculator' | 'blend-commit' | 'admin';

interface RouterContextValue {
  currentRoute: Route;
  navigate: (route: Route) => void;
  navigationHistory: Route[];
  goBack: () => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function Router({ children }: { children: React.ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<Route>('age-gate');
  const [navigationHistory, setNavigationHistory] = useState<Route[]>(['age-gate']);

  const navigate = (route: Route) => {
    setCurrentRoute(route);
    setNavigationHistory(prev => [...prev, route]);
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = navigationHistory.slice(0, -1);
      setNavigationHistory(newHistory);
      setCurrentRoute(newHistory[newHistory.length - 1]);
    }
  };

  const value: RouterContextValue = {
    currentRoute,
    navigate,
    navigationHistory,
    goBack
  };

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterContextValue {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within Router');
  }
  return context;
}
