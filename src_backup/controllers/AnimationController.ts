import type { AnimationState, CardAnimationData } from '../types';

export class AnimationController {
  private currentState: AnimationState = 'none';
  private listeners: Set<(state: AnimationState) => void> = new Set();
  private cardData: CardAnimationData[] = [];

  setState(newState: AnimationState): void {
    this.currentState = newState;
    this.notifyListeners();
  }

  getState(): AnimationState {
    return this.currentState;
  }

  setCardData(data: CardAnimationData[]): void {
    this.cardData = data;
  }

  getCardData(): CardAnimationData[] {
    return this.cardData;
  }

  subscribe(listener: (state: AnimationState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  reset(): void {
    this.currentState = 'none';
    this.cardData = [];
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentState));
  }

  executeSequence(
    strainIds: string[],
    onComplete: () => void
  ): void {
    if (strainIds.length !== 3) {
      console.error('AnimationController: Expected exactly 3 strain IDs');
      return;
    }

    this.setState('inventory_scrolling');

    setTimeout(() => {
      this.setState('cards_lifting');

      setTimeout(() => {
        this.setState('cards_moving_to_logo');

        setTimeout(() => {
          this.setState('logo_processing');

          setTimeout(() => {
            this.setState('cards_emitting');

            setTimeout(() => {
              this.setState('complete');
              onComplete();

              setTimeout(() => {
                this.reset();
              }, 500);
            }, 1000);
          }, 2000);
        }, 800);
      }, 600);
    }, 1000);
  }
}

export const animationController = new AnimationController();
