import type { Strain, BlendComponent, BlendOption } from './index';

export interface InventoryTrayProps {
  strains: Strain[];
  scrollToStrainIds?: string[];
  onScrollComplete?: () => void;
  isScrolling: boolean;
}

export interface InventoryCardProps {
  strain: Strain;
  isSelected: boolean;
  isAnimating: boolean;
  onAnimationStart?: (element: HTMLElement) => void;
  onAnimationComplete?: () => void;
}

export interface GoLogoProcessorProps {
  isProcessing: boolean;
  cardsInProcessor: number;
  onProcessingComplete?: () => void;
}

export interface BlendIngredientTokenProps {
  strain: Strain;
  role: 'driver' | 'modulator' | 'anchor';
  percentage: number;
  isAnimatingIn: boolean;
}

export interface BlendResultCardProps {
  blendOption: BlendOption;
  isActive: boolean;
  onSelect: (option: BlendOption) => void;
  onCommit: (option: BlendOption) => void;
}

export interface BlendCompositionBreakdownProps {
  components: {
    driver: { strain: Strain; percentage: number };
    modulator: { strain: Strain; percentage: number };
    anchor: { strain: Strain; percentage: number };
  };
  confidenceRange: { min: number; max: number };
  vibeEmphasis: string;
}
