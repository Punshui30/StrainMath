import { MockCOA } from '../../data/mockCoas';

export interface IntentVectors {
    relaxation: number;
    focus: number;
    energy: number;
    creativity: number;
    pain_relief: number;
    anti_anxiety: number;
}

const TERPENE_MAP: Record<string, Partial<IntentVectors>> = {
    Myrcene: { relaxation: 0.8, pain_relief: 0.5, anti_anxiety: 0.3 },
    Pinene: { focus: 0.9, energy: 0.5, creativity: 0.4 },
    Limonene: { energy: 0.7, creativity: 0.6, anti_anxiety: 0.5 },
    Caryophyllene: { pain_relief: 0.8, anti_anxiety: 0.7, relaxation: 0.4 },
    Terpinolene: { energy: 0.9, creativity: 0.7, focus: 0.3 },
    Linalool: { relaxation: 0.9, anti_anxiety: 0.9 },
    Humulene: { pain_relief: 0.7, relaxation: 0.3 },
    Ocimene: { energy: 0.6, creativity: 0.5 },
};

export interface ScoredStrain extends MockCOA {
    matchScore: number;
    intentAlignment: IntentVectors;
}

/**
 * Calculates a match score (0-1) for a strain against a given intent.
 */
export function scoreStrain(coa: MockCOA, intent: IntentVectors): ScoredStrain {
    const alignment: IntentVectors = {
        relaxation: 0,
        focus: 0,
        energy: 0,
        creativity: 0,
        pain_relief: 0,
        anti_anxiety: 0,
    };

    // 1. Calculate terpene alignment
    coa.terpenes.forEach((t) => {
        const weights = TERPENE_MAP[t.name];
        if (weights) {
            Object.entries(weights).forEach(([key, value]) => {
                (alignment as any)[key] += value * t.percentage;
            });
        }
    });

    // 2. Cannabinoid modifiers
    alignment.anti_anxiety += (coa.cannabinoids.cbd / 10) * 0.2;
    alignment.pain_relief += (coa.cannabinoids.cbd / 10) * 0.2;
    alignment.energy -= (coa.cannabinoids.cbd / 10) * 0.1;

    // 3. Dot product with user intent
    let matchScore = 0;
    Object.keys(intent).forEach((key) => {
        const k = key as keyof IntentVectors;
        matchScore += alignment[k] * intent[k];
    });

    return {
        ...coa,
        matchScore,
        intentAlignment: alignment,
    };
}

/**
 * Assembles 3 distinct blends from a collection of scored strains.
 */
export function assembleBlends(scoredStrains: ScoredStrain[]) {
    // Sort by match score descending
    const sorted = [...scoredStrains].sort((a, b) => b.matchScore - a.matchScore);

    // Ensure we have enough variety. 
    // We'll build 3 blends using different permutations of the top 6-9 strains.

    const buildBlend = (id: number, indices: number[], name: string) => {
        const components = indices.map((idx, i) => {
            const s = sorted[idx];
            const role = i === 0 ? 'Driver' : i === 1 ? 'Modulator' : 'Anchor';
            const percentage = i === 0 ? 50 : i === 1 ? 30 : 20;

            return {
                id: idx,
                name: s.strainName || "Unknown Strain",
                type: s.strainName?.toLowerCase().includes('haze') || s.strainName?.toLowerCase().includes('diesel') ? 'Sativa' : 'Hybrid', // Simplified
                role,
                profile: "Dynamic",
                percentage,
                arcColor: i === 0 ? 'from-[#14B8A6] to-[#5EEAD4]' : i === 1 ? 'from-[#10B981] to-[#6EE7B7]' : 'from-[#0891B2] to-[#67E8F9]',
                terpenes: s.terpenes.slice(0, 3).map(t => t.name),
                description: `Selected as ${role} for its ${s.terpenes[0].name} dominance.`
            };
        });

        return {
            id,
            name,
            vibeEmphasis: `Custom ${sorted[indices[0]].strainName} dominant blend`,
            confidenceRange: '92–98%',
            isPrimary: id === 1,
            components,
            targets: sorted[indices[0]].intentAlignment // Use top strain as target proxy for UI
        };
    };

    // Variety logic
    return [
        buildBlend(1, [0, 1, 2], `Elite ${sorted[0].strainName} Blend`),
        buildBlend(2, [0, 3, 4], `Focused ${sorted[0].strainName} Mix`),
        buildBlend(3, [1, 2, 5], `${sorted[1].strainName} Balanced Cut`)
    ];
}
