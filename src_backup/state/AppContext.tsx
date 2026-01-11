import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AppState, Strain, BlendOption, AppMode, AnimationState } from '../types';
import { appStateMachine } from './AppStateMachine';
import { supabase } from '../lib/supabase';

interface AppContextValue extends AppState {
  setMode: (mode: AppMode) => void;
  setAnimationState: (state: AnimationState) => void;
  loadInventory: () => Promise<void>;
  setBlendOptions: (options: BlendOption[]) => void;
  setActiveBlend: (blend: BlendOption | null) => void;
  setUserGoals: (goals: string[]) => void;
  commitBlend: (blend: BlendOption) => Promise<void>;
  resetApp: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    mode: 'idle',
    animationState: 'none',
    inventory: [],
    blendOptions: [],
    activeBlend: null,
    userGoals: [],
    isFirstTime: true
  });

  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const unsubscribe = appStateMachine.subscribe(() => {
      setState(prev => ({
        ...prev,
        mode: appStateMachine.getMode(),
        animationState: appStateMachine.getAnimationState()
      }));
      setForceUpdate(n => n + 1);
    });

    return unsubscribe;
  }, []);

  const setMode = useCallback((mode: AppMode) => {
    appStateMachine.transitionMode(mode);
  }, []);

  const setAnimationState = useCallback((animState: AnimationState) => {
    appStateMachine.transitionAnimation(animState);
  }, []);

  const loadInventory = useCallback(async () => {
    const { data, error } = await supabase
      .from('strains')
      .select('*')
      .eq('is_available', true)
      .order('name');

    if (error) {
      console.error('Error loading inventory:', error);
      return;
    }

    setState(prev => ({ ...prev, inventory: data || [] }));
  }, []);

  const setBlendOptions = useCallback((options: BlendOption[]) => {
    setState(prev => ({ ...prev, blendOptions: options }));
  }, []);

  const setActiveBlend = useCallback((blend: BlendOption | null) => {
    setState(prev => ({ ...prev, activeBlend: blend }));
  }, []);

  const setUserGoals = useCallback((goals: string[]) => {
    setState(prev => ({ ...prev, userGoals: goals }));
  }, []);

  const commitBlend = useCallback(async (blend: BlendOption) => {
    const { error } = await supabase.from('blends').insert({
      driver_strain_id: blend.components.driver.strain.id,
      driver_percentage: blend.components.driver.percentage,
      modulator_strain_id: blend.components.modulator.strain.id,
      modulator_percentage: blend.components.modulator.percentage,
      anchor_strain_id: blend.components.anchor.strain.id,
      anchor_percentage: blend.components.anchor.percentage,
      confidence_min: blend.confidence_min,
      confidence_max: blend.confidence_max,
      vibe_emphasis: blend.vibe_emphasis,
      outcome_goals: blend.outcome_goals,
      is_committed: true
    });

    if (error) {
      console.error('Error committing blend:', error);
      return;
    }

    appStateMachine.transitionMode('committed');
  }, []);

  const resetApp = useCallback(() => {
    appStateMachine.reset();
    setState(prev => ({
      ...prev,
      blendOptions: [],
      activeBlend: null,
      userGoals: []
    }));
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const value: AppContextValue = {
    ...state,
    setMode,
    setAnimationState,
    loadInventory,
    setBlendOptions,
    setActiveBlend,
    setUserGoals,
    commitBlend,
    resetApp
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
