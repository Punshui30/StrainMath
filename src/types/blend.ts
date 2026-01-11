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

export interface BlendRecommendation {
    id: number;
    name: string;
    vibeEmphasis: string;
    confidenceRange: string;
    isPrimary: boolean;
    description?: string;
    components: BlendComponent[];
    targets: {
        relaxation: number;
        focus: number;
        energy: number;
        creativity: number;
        pain_relief: number;
        anti_anxiety: number;
    };
}
