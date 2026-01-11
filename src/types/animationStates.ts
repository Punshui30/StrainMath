/**
 * STATE-FRAMED ANIMATION CONTRACT (Bolt.new Compatible)
 * 
 * Four non-overlapping states with explicit spatial contracts.
 * No blended transitions. No shortcuts.
 */

export type AnimationState = 
  | 'STATE_0_IDLE'                    // Inventory visible, logo idle, no recommendations
  | 'STATE_1_INVENTORY_ALIGNED'       // Scroll complete, cards centered, NO LIFTING
  | 'STATE_2_INGREDIENT_LIFT'         // Cards lift sequentially (one at a time)
  | 'STATE_3_RECOMMENDATION_OUTPUT';  // Logo emits tokens into recommendation slots

export interface IngredientCard {
  strain: string;
  color: string;
  percentage: number;
  role: string;
  category: 'Hybrid' | 'Indica' | 'Sativa';
}

/**
 * STATE 0 — IDLE
 * - Inventory tray visible and scrollable
 * - Recommendation cards hidden
 * - Logo idle/breathing
 * - No highlighted strains
 */
export interface State0_Idle {
  state: 'STATE_0_IDLE';
  ingredientCards: IngredientCard[];
}

/**
 * STATE 1 — INVENTORY ALIGNMENT
 * - Inventory tray auto-scrolls horizontally
 * - Target strain cards centered in tray
 * - Tray motion completes and becomes stationary
 * - Cards highlighted but NOT lifted
 * 
 * HARD RULE: No card may lift or animate until horizontal scroll completes
 */
export interface State1_InventoryAligned {
  state: 'STATE_1_INVENTORY_ALIGNED';
  ingredientCards: IngredientCard[];
  scrollComplete: boolean;
}

/**
 * STATE 2 — INGREDIENT LIFT
 * - Exactly N cards (N = ingredientCards.length)
 * - Each card lifts from its ACTUAL DOM position
 * - Sequential animation: one card completes before next begins
 * - Duration: 250-350ms per card
 * - Effect: Slight scale down (0.92) + glow
 * - Logo pulses on each arrival
 * 
 * HARD RULES:
 * - No flashes, no teleporting, no extra cards
 * - Strain name must be readable during movement
 * - Cards arrive at logo sequentially, NOT simultaneously
 */
export interface State2_IngredientLift {
  state: 'STATE_2_INGREDIENT_LIFT';
  ingredientCards: IngredientCard[];
  currentLiftingIndex: number; // Which card is currently lifting (0-based)
  cardsArrived: number;         // How many cards have completed journey
}

/**
 * STATE 3 — RECOMMENDATION OUTPUT
 * - Logo emits exactly N tokens (N = ingredientCards.length)
 * - Tokens land into pre-allocated recommendation card slots
 * - Recommendation cards fade + assemble upward
 * - Tokens resolve into percentage bars/text
 * 
 * HARD RULES:
 * - No overlap between tokens
 * - No new objects created mid-flight
 * - One token = one ingredient = one color
 */
export interface State3_RecommendationOutput {
  state: 'STATE_3_RECOMMENDATION_OUTPUT';
  ingredientCards: IngredientCard[];
  tokensEmitted: boolean;
  recommendationsVisible: boolean;
}

/**
 * Union type for all animation states
 */
export type AnimationStateData = 
  | State0_Idle 
  | State1_InventoryAligned 
  | State2_IngredientLift 
  | State3_RecommendationOutput;

/**
 * Animation timing constants (milliseconds)
 */
export const ANIMATION_TIMINGS = {
  SCROLL_DURATION: 600,
  SCROLL_SETTLE: 100,
  CARD_LIFT_DURATION: 300,
  CARD_LIFT_DELAY: 150,     // Delay between sequential card lifts
  LOGO_PULSE_DURATION: 200,
  TOKEN_EMIT_DURATION: 400,
  RECOMMENDATION_FADE_IN: 500,
} as const;
