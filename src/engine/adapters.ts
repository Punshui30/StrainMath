/**
 * Adapters to convert between app domain models (Strain, BlendOption) 
 * and engine domain models (Cultivar, BlendRecommendation, Intent)
 * 
 * HARD CONSTRAINT: Engine requires exactly 3 cultivars (Driver, Modulator, Anchor).
 * Adapters validate inputs and reject violations - they NEVER compensate or "fix" invalid states.
 */

import type { Strain } from '../types/database';
import type { BlendOption } from '../types/app-state';
import type { Cultivar, Inventory, Intent, BlendRecommendation, EngineOutput } from './calculator';

/**
 * Convert app Strain to engine Cultivar
 */
export function strainToCultivar(strain: Strain): Cultivar {
  return {
    id: strain.id,
    name: strain.name,
    thcPercent: strain.thc_percentage,
    cbdPercent: strain.cbd_percentage,
    terpenes: strain.terpene_profile || {},
    available: strain.is_available,
  };
}

/**
 * Convert app inventory (Strain[]) to engine Inventory
 * 
 * HARD CONSTRAINT: Engine requires at least 3 available cultivars.
 * This function does NOT validate - callers must validate before calling the engine.
 * The engine itself will enforce the invariant and throw if violated.
 */
export function createInventory(strains: Strain[]): Inventory {
  return {
    cultivars: strains.map(strainToCultivar),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validate inventory before engine call.
 * Returns error message if validation fails, null if valid.
 * 
 * Adapters enforce rules - they do NOT compensate for violations.
 */
export function validateInventoryForEngine(inventory: Inventory): string | null {
  if (inventory.cultivars.length === 0) {
    return "Inventory contains no cultivars";
  }
  
  const available = inventory.cultivars.filter(c => c.available);
  if (available.length === 0) {
    return "No cultivars are currently available";
  }
  
  // HARD CONSTRAINT: Engine requires exactly 3 cultivars
  if (available.length < 3) {
    return `Engine requires at least 3 available cultivars, but only ${available.length} are available. Two-cultivar blends are not valid engine inputs.`;
  }
  
  return null;
}

/**
 * Convert user goals (string array) to engine Intent
 * This is a placeholder implementation - in production, the LLM layer 
 * should handle this conversion based on user language interpretation.
 * 
 * For now, maps common goal keywords to effect vectors.
 */
export function goalsToIntent(
  userGoals: string[],
  context?: {
    timeOfDay?: "morning" | "afternoon" | "evening" | "night";
    tolerance?: "low" | "medium" | "high";
    experience?: "beginner" | "intermediate" | "expert";
  }
): Intent {
  // Default neutral intent
  let targetEffects = {
    energy: 0.0,
    focus: 0.5,
    mood: 0.5,
    body: 0.5,
    creativity: 0.5,
  };

  // Map goal keywords to effect vectors
  const goalMap: Record<string, typeof targetEffects> = {
    'Relaxation': { energy: -0.5, focus: -0.2, body: 0.7, mood: 0.3, creativity: 0.3 },
    'Focus': { energy: 0.3, focus: 0.8, creativity: 0.2, mood: 0.4, body: 0.2 },
    'Creativity': { energy: 0.2, focus: 0.4, creativity: 0.8, mood: 0.6, body: 0.3 },
    'Sleep': { energy: -0.8, focus: -0.5, body: 0.8, mood: 0.2, creativity: 0.0 },
    'Pain Relief': { body: 0.9, energy: -0.4, mood: 0.3, focus: 0.2, creativity: 0.2 },
    'Energy': { energy: 0.8, focus: 0.6, creativity: 0.4, mood: 0.6, body: 0.2 },
    'Anxiety Relief': { mood: 0.7, energy: -0.2, focus: -0.1, body: 0.4, creativity: 0.3 },
    'Social': { mood: 0.8, energy: 0.4, creativity: 0.5, focus: 0.3, body: 0.3 },
  };

  // If goals are provided, average their effect vectors
  if (userGoals.length > 0) {
    const matchingGoals = userGoals.filter(g => g in goalMap);
    if (matchingGoals.length > 0) {
      const sum = { energy: 0, focus: 0, mood: 0, body: 0, creativity: 0 };
      matchingGoals.forEach(goal => {
        const effects = goalMap[goal];
        sum.energy += effects.energy;
        sum.focus += effects.focus;
        sum.mood += effects.mood;
        sum.body += effects.body;
        sum.creativity += effects.creativity;
      });
      
      // Average the effects
      const count = matchingGoals.length;
      targetEffects = {
        energy: sum.energy / count,
        focus: sum.focus / count,
        mood: sum.mood / count,
        body: sum.body / count,
        creativity: sum.creativity / count,
      };
    }
  }

  // Ensure values are within valid ranges
  targetEffects.energy = Math.max(-1.0, Math.min(1.0, targetEffects.energy));
  targetEffects.focus = Math.max(0.0, Math.min(1.0, targetEffects.focus));
  targetEffects.mood = Math.max(-1.0, Math.min(1.0, targetEffects.mood));
  targetEffects.body = Math.max(0.0, Math.min(1.0, targetEffects.body));
  targetEffects.creativity = Math.max(0.0, Math.min(1.0, targetEffects.creativity));

  // Determine max anxiety constraint based on goals
  let maxAnxiety = 0.3; // default
  if (userGoals.includes('Anxiety Relief')) {
    maxAnxiety = 0.2;
  } else if (userGoals.includes('Sleep') || userGoals.includes('Relaxation')) {
    maxAnxiety = 0.25;
  }

  return {
    targetEffects: accumulatedEffects,
    constraints: {
      maxAnxiety,
    },
    context,
  };
}

/**
 * Convert engine BlendRecommendation to app BlendOption
 * Engine guarantees exactly 3 components with explicit roles (driver, modulator, anchor)
 */
export function recommendationToBlendOption(
  recommendation: BlendRecommendation,
  strainMap: Map<string, Strain>,
  userGoals: string[]
): BlendOption | null {
  // Get strains - engine guarantees roles are explicit
  const driverStrain = strainMap.get(recommendation.driver.id);
  const modulatorStrain = strainMap.get(recommendation.modulator.id);
  const anchorStrain = strainMap.get(recommendation.anchor.id);

  if (!driverStrain || !modulatorStrain || !anchorStrain) {
    return null;
  }

  // Convert ratios to percentages, ensuring they sum to exactly 100
  const driverPercent = Math.round(recommendation.driver.ratio * 100);
  const modulatorPercent = Math.round(recommendation.modulator.ratio * 100);
  const anchorPercent = 100 - driverPercent - modulatorPercent; // Adjust anchor to ensure sum = 100

  return {
    id: `${recommendation.score}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    components: {
      driver: {
        strain: driverStrain,
        percentage: driverPercent,
      },
      modulator: {
        strain: modulatorStrain,
        percentage: modulatorPercent,
      },
      anchor: {
        strain: anchorStrain,
        percentage: anchorPercent,
      },
    },
    confidence_min: Math.round(Math.max(0, Math.min(1.0, recommendation.confidence - 0.1)) * 100),
    confidence_max: Math.round(Math.max(0, Math.min(1.0, recommendation.confidence + 0.1)) * 100),
    vibe_emphasis: generateVibeEmphasis(recommendation, userGoals),
    outcome_goals: userGoals,
  };
}

/**
 * Generate vibe emphasis text from recommendation and goals
 * This is a placeholder - in production, the LLM layer should generate this
 * based on the deterministic outputs without changing the strain selection or ratios.
 */
function generateVibeEmphasis(recommendation: BlendRecommendation, userGoals: string[]): string {
  const { predictedEffects } = recommendation;
  
  const vibes: string[] = [];
  
  if (predictedEffects.energy > 0.5) {
    vibes.push('energizing');
  } else if (predictedEffects.energy < -0.5) {
    vibes.push('relaxing');
  }
  
  if (predictedEffects.focus > 0.6) {
    vibes.push('focused');
  }
  
  if (predictedEffects.creativity > 0.6) {
    vibes.push('creative');
  }
  
  if (predictedEffects.body > 0.6) {
    vibes.push('body-focused');
  }
  
  if (predictedEffects.mood > 0.6) {
    vibes.push('uplifting');
  }

  if (vibes.length === 0) {
    return 'Balanced and harmonious blend';
  }

  return vibes.join(', ').replace(/,([^,]*)$/, ' and$1') + ' experience';
}

/**
 * Convert engine output to app BlendOption array
 */
export function engineOutputToBlendOptions(
  output: EngineOutput,
  strainMap: Map<string, Strain>,
  userGoals: string[]
): BlendOption[] {
  if (output.error || output.recommendations.length === 0) {
    return [];
  }

  const blendOptions: BlendOption[] = [];

  for (const recommendation of output.recommendations) {
    const blendOption = recommendationToBlendOption(recommendation, strainMap, userGoals);
    if (blendOption) {
      blendOptions.push(blendOption);
    }
  }

  return blendOptions;
}
