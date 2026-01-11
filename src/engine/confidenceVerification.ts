import type { BlendRecommendation, ConfidenceAudit } from '../types/blend';
import type { IntentVectors } from './scoring';

/**
 * Confidence Verification Layer
 * 
 * Internal validation system for blend quality.
 * Does NOT change user-facing confidence display.
 * Provides auditable metrics for developer confidence.
 */

/**
 * Known antagonistic terpene-outcome patterns
 */
const CONFLICT_PATTERNS = {
    calmWithStimulants: {
        terpenes: ['Terpinolene', 'Pinene'],
        intent: { relaxation: 0.7, anti_anxiety: 0.7 },
        message: 'Stimulant terpenes contradict calm intent'
    },
    focusWithSedatives: {
        terpenes: ['Myrcene', 'Linalool'],
        intent: { focus: 0.7, energy: 0.7 },
        message: 'Sedative terpenes contradict focus intent'
    },
    energyWithHighCBD: {
        cbdThreshold: 5,
        intent: { energy: 0.7 },
        message: 'High CBD may reduce energy effects'
    }
};

/**
 * Compute how closely the final blended effect vector matches the requested intent.
 * 
 * @param blend - The blend to evaluate
 * @param intent - The target intent vectors
 * @returns Alignment score 0-100
 */
export function computeAlignmentScore(
    blend: BlendRecommendation,
    intent: IntentVectors
): number {
    // Blend's target vector is already computed in blend.targets
    const blendVector = blend.targets;

    // Compute cosine similarity between blend and intent
    let dotProduct = 0;
    let blendMagnitude = 0;
    let intentMagnitude = 0;

    const keys = Object.keys(intent) as (keyof IntentVectors)[];

    keys.forEach(key => {
        dotProduct += blendVector[key] * intent[key];
        blendMagnitude += blendVector[key] ** 2;
        intentMagnitude += intent[key] ** 2;
    });

    blendMagnitude = Math.sqrt(blendMagnitude);
    intentMagnitude = Math.sqrt(intentMagnitude);

    // Avoid division by zero
    if (blendMagnitude === 0 || intentMagnitude === 0) {
        return 0;
    }

    const cosineSimilarity = dotProduct / (blendMagnitude * intentMagnitude);

    // Convert to 0-100 scale (cosine similarity is -1 to 1, but we expect 0 to 1)
    return Math.max(0, Math.min(100, cosineSimilarity * 100));
}

/**
 * Perform counterfactual testing to measure structural necessity of each component.
 * 
 * @param blend - The blend to evaluate
 * @param intent - The target intent vectors
 * @returns Stability score 0-100 and per-component contributions
 */
export function computeStabilityScore(
    blend: BlendRecommendation,
    intent: IntentVectors
): { score: number; contributions: { [strainName: string]: number } } {
    const contributions: { [strainName: string]: number } = {};

    // Baseline alignment with all components
    const baselineAlignment = computeAlignmentScore(blend, intent);

    // Test removing each component
    blend.components.forEach(component => {
        // Create counterfactual blend without this component
        const remainingComponents = blend.components.filter(c => c.id !== component.id);

        if (remainingComponents.length === 0) {
            // Can't remove all components
            contributions[component.name] = 100;
            return;
        }

        // Recalculate percentages (normalize to 100%)
        const totalPercentage = remainingComponents.reduce((sum, c) => sum + c.percentage, 0);
        const normalizedComponents = remainingComponents.map(c => ({
            ...c,
            percentage: (c.percentage / totalPercentage) * 100
        }));

        // Recalculate blended vector
        const counterfactualVector: IntentVectors = {
            relaxation: 0,
            focus: 0,
            energy: 0,
            creativity: 0,
            pain_relief: 0,
            anti_anxiety: 0
        };

        // This is a simplified recalculation - in reality we'd need strain-level data
        // For now, approximate by removing this component's weighted contribution
        const keys = Object.keys(intent) as (keyof IntentVectors)[];
        keys.forEach(key => {
            // Approximate: remove this component's proportional contribution
            const componentContribution = blend.targets[key] * (component.percentage / 100);
            const remainingContribution = blend.targets[key] - componentContribution;
            counterfactualVector[key] = remainingContribution / (1 - component.percentage / 100);
        });

        const counterfactualBlend = {
            ...blend,
            components: normalizedComponents,
            targets: counterfactualVector
        };

        const counterfactualAlignment = computeAlignmentScore(counterfactualBlend, intent);

        // Contribution is the delta in alignment
        const delta = Math.abs(baselineAlignment - counterfactualAlignment);
        contributions[component.name] = delta;
    });

    // Stability score: average contribution (higher = more stable)
    const avgContribution = Object.values(contributions).reduce((sum, val) => sum + val, 0) / blend.components.length;

    // If any component has negligible impact (<5%), flag as low stability
    const hasNegligibleComponent = Object.values(contributions).some(delta => delta < 5);

    const stabilityScore = hasNegligibleComponent ? Math.min(avgContribution, 60) : avgContribution;

    return {
        score: Math.max(0, Math.min(100, stabilityScore)),
        contributions
    };
}

/**
 * Detect known antagonistic patterns between terpenes, outcomes, and cannabinoids.
 * 
 * @param blend - The blend to evaluate
 * @param intent - The target intent vectors
 * @returns Conflict detection results
 */
export function detectConflicts(
    blend: BlendRecommendation,
    intent: IntentVectors
): { hasConflicts: boolean; conflictFlags: string[] } {
    const conflictFlags: string[] = [];

    // Collect all terpenes from blend components
    const allTerpenes = new Set<string>();
    blend.components.forEach(component => {
        component.terpenes.forEach(terp => allTerpenes.add(terp));
    });

    // Check: Calm intent + stimulant terpenes
    if (intent.relaxation >= 0.7 || intent.anti_anxiety >= 0.7) {
        const hasStimulants = CONFLICT_PATTERNS.calmWithStimulants.terpenes.some(
            terp => allTerpenes.has(terp)
        );
        if (hasStimulants) {
            conflictFlags.push(CONFLICT_PATTERNS.calmWithStimulants.message);
        }
    }

    // Check: Focus intent + sedative terpenes
    if (intent.focus >= 0.7 || intent.energy >= 0.7) {
        const hasSedatives = CONFLICT_PATTERNS.focusWithSedatives.terpenes.some(
            terp => allTerpenes.has(terp)
        );
        if (hasSedatives) {
            conflictFlags.push(CONFLICT_PATTERNS.focusWithSedatives.message);
        }
    }

    // Check: Energy intent + high CBD
    // Note: We don't have CBD data in components currently, so this is a placeholder
    // In a real implementation, you'd check component.cannabinoids.cbd
    // For now, we'll skip this check

    return {
        hasConflicts: conflictFlags.length > 0,
        conflictFlags
    };
}

/**
 * Orchestrates all confidence verification checks.
 * 
 * @param blend - The blend to audit
 * @param intent - The target intent vectors
 * @returns Complete confidence audit
 */
export function auditBlendConfidence(
    blend: BlendRecommendation,
    intent: IntentVectors
): ConfidenceAudit {
    const alignmentScore = computeAlignmentScore(blend, intent);
    const { score: stabilityScore, contributions } = computeStabilityScore(blend, intent);
    const { hasConflicts, conflictFlags } = detectConflicts(blend, intent);

    return {
        alignmentScore,
        stabilityScore,
        hasConflicts,
        conflictFlags,
        componentContributions: contributions
    };
}
