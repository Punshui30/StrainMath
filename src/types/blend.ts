export interface BlendComponent {
    id: number;
    name: string;
    type: string;
    role: string;
    profile: string;
    percentage: number;
    arcColor: string;
    terpenes: string[];
    description: string;
}

/**
 * Internal confidence verification metrics.
 * Used to validate blend quality without changing user-facing confidence display.
 */
export interface ConfidenceAudit {
    alignmentScore: number;        // 0-100: How well final blend matches intent
    stabilityScore: number;         // 0-100: Structural necessity of components
    hasConflicts: boolean;          // Any antagonistic patterns detected
    conflictFlags: string[];        // Specific conflict descriptions
    componentContributions: {       // Per-strain counterfactual deltas
        [strainName: string]: number;
    };
}

export interface BlendRecommendation {
    id: number;
    name: string;
    vibeEmphasis: string;
    confidenceRange: string;
    isPrimary: boolean;
    description?: string;
    components: BlendComponent[];
    similarity?: {
        score: "High" | "Medium" | "Low";
        explanation: string;
    };
    targets: {
        relaxation: number;
        focus: number;
        energy: number;
        creativity: number;
        pain_relief: number;
        anti_anxiety: number;
    };
    confidenceAudit?: ConfidenceAudit;  // Internal only, not displayed
}
