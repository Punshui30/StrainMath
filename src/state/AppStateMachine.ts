import type { AppMode, AnimationState } from '../types';

export class AppStateMachine {
  private currentMode: AppMode = 'idle';
  private currentAnimationState: AnimationState = 'none';
  private listeners: Set<() => void> = new Set();

  private validModeTransitions: Record<AppMode, AppMode[]> = {
    idle: ['listening'],
    listening: ['analyzing', 'idle'],
    analyzing: ['assembling', 'idle'],
    assembling: ['committed', 'idle'],
    committed: ['idle']
  };

  private validAnimationTransitions: Record<AnimationState, AnimationState[]> = {
    none: ['inventory_scrolling'],
    inventory_scrolling: ['cards_lifting'],
    cards_lifting: ['cards_moving_to_logo'],
    cards_moving_to_logo: ['logo_processing'],
    logo_processing: ['cards_emitting'],
    cards_emitting: ['complete'],
    complete: ['none']
  };

  getMode(): AppMode {
    return this.currentMode;
  }

  getAnimationState(): AnimationState {
    return this.currentAnimationState;
  }

  canTransitionMode(toMode: AppMode): boolean {
    const allowedTransitions = this.validModeTransitions[this.currentMode];
    return allowedTransitions.includes(toMode);
  }

  canTransitionAnimation(toState: AnimationState): boolean {
    const allowedTransitions = this.validAnimationTransitions[this.currentAnimationState];
    return allowedTransitions.includes(toState);
  }

  transitionMode(toMode: AppMode): boolean {
    if (!this.canTransitionMode(toMode)) {
      console.warn(`Invalid mode transition from ${this.currentMode} to ${toMode}`);
      return false;
    }

    this.currentMode = toMode;
    this.notifyListeners();
    return true;
  }

  transitionAnimation(toState: AnimationState): boolean {
    if (!this.canTransitionAnimation(toState)) {
      console.warn(`Invalid animation transition from ${this.currentAnimationState} to ${toState}`);
      return false;
    }

    this.currentAnimationState = toState;
    this.notifyListeners();
    return true;
  }

  reset(): void {
    this.currentMode = 'idle';
    this.currentAnimationState = 'none';
    this.notifyListeners();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const appStateMachine = new AppStateMachine();
