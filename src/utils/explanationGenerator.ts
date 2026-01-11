import { IntentVectors } from '../engine/scoring';
import type { BlendRecommendation } from '../types/blend';

const TERPENE_INTENT_MAP: Record<string, string[]> = {
    Myrcene: ['relaxation', 'pain relief', 'anti-anxiety'],
    Pinene: ['focus', 'energy', 'creativity', 'alertness'],
    Limonene: ['energy', 'creativity', 'anti-anxiety', 'mood elevation'],
    Caryophyllene: ['pain relief', 'anti-anxiety', 'anti-inflammatory'],
    Terpinolene: ['energy', 'creativity', 'focus'],
    Linalool: ['relaxation', 'anti-anxiety', 'stress relief'],
    Humulene: ['pain relief', 'appetite suppression'],
    Ocimene: ['energy', 'creativity'],
};

/**
 * Generate a dynamic explanation based on user intent, selected blend, and terpene data
 */
export function generateExplanation(
    userText: string,
    intent: IntentVectors | null,
    blend: BlendRecommendation
): string {
    if (!intent || !userText) {
        return "This blend was selected based on available inventory and general wellness principles.";
    }

    // Extract dominant intent dimensions
    const intentEntries = Object.entries(intent)
        .filter(([_, value]) => value > 0.4)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2);

    if (intentEntries.length === 0) {
        return `Based on your request "${userText}", this blend offers a balanced profile using our current inventory.`;
    }

    // Get dominant terpenes from the blend's driver component
    const driverComponent = blend.components.find(c => c.role.toLowerCase() === 'driver');
    const dominantTerpenes = driverComponent?.terpenes || [];

    // Build explanation
    const intentDescriptions = intentEntries.map(([key, value]) => {
        const readableKey = key.replace(/_/g, ' ');
        return readableKey;
    });

    const terpeneExplanations = dominantTerpenes
        .filter(terp => TERPENE_INTENT_MAP[terp])
        .map(terp => {
            const effects = TERPENE_INTENT_MAP[terp];
            return `${terp} (${effects.slice(0, 2).join(', ')})`;
        });

    let explanation = `Your request mentioned "${userText}". `;

    if (intentDescriptions.length > 0) {
        explanation += `We identified your primary needs as ${intentDescriptions.join(' and ')}. `;
    }

    if (terpeneExplanations.length > 0) {
        explanation += `This blend features ${terpeneExplanations.join(', ')}, which directly support those outcomes. `;
    }

    // Add role-based composition note
    const driver = blend.components.find(c => c.role.toLowerCase() === 'driver');
    const modulator = blend.components.find(c => c.role.toLowerCase() === 'modulator');

    if (driver && modulator) {
        explanation += `${driver.name} serves as the primary driver (${driver.percentage}%), while ${modulator.name} modulates the effect (${modulator.percentage}%).`;
    }

    return explanation;
}
