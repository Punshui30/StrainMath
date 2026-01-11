/**
 * BLEND ANIMATION RUNTIME CONTRACT
 * 
 * This application uses state-driven rendering, not motion chains.
 * 
 * FRAME A: inventory_resolved
 * - Inventory tray is visible and scrolled to center selected strains
 * - Selected strain cards have gold outline + glow
 * - No movement occurs
 * - User can see which strains will be used
 * 
 * FRAME B: blending_in_progress  
 * - Inventory remains visible and stable
 * - Logo enters "processing" state
 * - Three ingredient tokens visible inside logo region
 * - Token count MUST equal blend.components.length
 * - Tokens are labeled with strain names
 * 
 * FRAME C: blend_output
 * - Three blend recommendation cards visible
 * - Inventory markings dimmed or removed
 * - Logo returns to idle state
 * - User can select between blend options
 * 
 * MOTION CONTRACT:
 * 1. Inventory tray is a horizontal scroll container (x-axis only)
 * 2. On blend resolution, system determines blendIngredients[]
 * 3. Inventory MUST scroll to center all ingredient cards BEFORE any animation
 * 4. Only after scroll completion may cards animate toward logo
 * 5. Exactly one animation per ingredient (count = blendIngredients.length)
 * 6. Cards must originate from real DOM position, not proxies
 * 7. After ingredients enter logo, result cards materialize from logo region
 * 8. No animation if ingredient card is not visible
 */

export type BlendAnimationState = 
  | 'idle'                    // Default state - no blend active
  | 'inventory_resolved'      // FRAME A - Strains marked in inventory
  | 'blending_in_progress'    // FRAME B - Logo processing, tokens visible
  | 'blend_output';           // FRAME C - Recommendation cards shown

export interface BlendIngredient {
  strain: string;
  role: string;
  category: 'Hybrid' | 'Indica' | 'Sativa';
  percentage: number;
}
