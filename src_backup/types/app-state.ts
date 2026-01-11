import type { Strain, Blend, BlendWithStrains } from './database';

export type AppMode = 'idle' | 'listening' | 'analyzing' | 'assembling' | 'committed';

export type AnimationState =
  | 'none'
  | 'inventory_scrolling'
  | 'cards_lifting'
  | 'cards_moving_to_logo'
  | 'logo_processing'
  | 'cards_emitting'
  | 'complete';

export interface BlendComponent {
  role: 'driver' | 'modulator' | 'anchor';
  strain: Strain;
  percentage: number;
}

export interface BlendOption {
  id: string;
  components: {
    driver: { strain: Strain; percentage: number };
    modulator: { strain: Strain; percentage: number };
    anchor: { strain: Strain; percentage: number };
  };
  confidence_min: number;
  confidence_max: number;
  vibe_emphasis: string;
  outcome_goals: string[];
}

export interface AppState {
  mode: AppMode;
  animationState: AnimationState;
  inventory: Strain[];
  blendOptions: BlendOption[];
  activeBlend: BlendOption | null;
  userGoals: string[];
  isFirstTime: boolean;
}

export interface AnimationPosition {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface CardAnimationData {
  strainId: string;
  role: 'driver' | 'modulator' | 'anchor';
  startPosition: AnimationPosition;
  logoPosition: AnimationPosition;
  endPosition: AnimationPosition;
}
