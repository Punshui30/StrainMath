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
}

// The resolved vibe from user input
export const resolvedVibe = "Relaxed, alert, socially fluid";

// Multiple blend interpretations
export const blendRecommendations: BlendRecommendation[] = [
  {
    id: 1,
    name: 'Blue Dream Focus',
    vibeEmphasis: 'Alert, creative, conversational',
    confidenceRange: '94–97%',
    isPrimary: true,
    components: [
      { 
        id: 1, 
        name: 'Blue Dream', 
        type: 'Hybrid', 
        role: 'Driver',
        profile: 'Sativa Lean', 
        percentage: 50,
        arcColor: 'from-[#14B8A6] to-[#5EEAD4]',
        terpenes: ['Myrcene', 'Pinene', 'Caryophyllene'],
        description: 'Provides the foundational mood elevation and mental clarity. High myrcene content drives physical relaxation while maintaining cognitive function.',
      },
      { 
        id: 2, 
        name: 'Northern Lights', 
        type: 'Indica', 
        role: 'Modulator',
        profile: 'Caryophyllene', 
        percentage: 30,
        arcColor: 'from-[#10B981] to-[#6EE7B7]',
        terpenes: ['Caryophyllene', 'Myrcene', 'Limonene'],
        description: 'Stabilizes the blend by reducing tension and anxiety through caryophyllene. Adds body-focused relaxation without sedation.',
      },
      { 
        id: 3, 
        name: 'Blueberry', 
        type: 'Indica', 
        role: 'Anchor',
        profile: 'Caryophyllene', 
        percentage: 20,
        arcColor: 'from-[#0891B2] to-[#67E8F9]',
        terpenes: ['Myrcene', 'Caryophyllene', 'Linalool'],
        description: 'Grounds the experience with gentle physical calm. Prevents overstimulation while supporting sustained relaxation.',
      },
    ]
  },
  {
    id: 2,
    name: 'Northern Calm',
    vibeEmphasis: 'Grounded, body-forward, at ease',
    confidenceRange: '89–93%',
    isPrimary: false,
    components: [
      { 
        id: 2, 
        name: 'Northern Lights', 
        type: 'Indica', 
        role: 'Driver',
        profile: 'Caryophyllene', 
        percentage: 45,
        arcColor: 'from-[#14B8A6] to-[#5EEAD4]',
        terpenes: ['Caryophyllene', 'Myrcene', 'Limonene'],
        description: 'Leads with deep physical relaxation and anxiety reduction through caryophyllene dominance.',
      },
      { 
        id: 1, 
        name: 'Blue Dream', 
        type: 'Hybrid', 
        role: 'Modulator',
        profile: 'Sativa Lean', 
        percentage: 35,
        arcColor: 'from-[#10B981] to-[#6EE7B7]',
        terpenes: ['Myrcene', 'Pinene', 'Caryophyllene'],
        description: 'Maintains mental clarity and prevents excessive sedation while supporting the calming base.',
      },
      { 
        id: 3, 
        name: 'Blueberry', 
        type: 'Indica', 
        role: 'Anchor',
        profile: 'Caryophyllene', 
        percentage: 20,
        arcColor: 'from-[#0891B2] to-[#67E8F9]',
        terpenes: ['Myrcene', 'Caryophyllene', 'Linalool'],
        description: 'Deepens physical relaxation with linalool support for sustained calm.',
      },
    ]
  },
  {
    id: 3,
    name: 'Jack Focus',
    vibeEmphasis: 'Alert, task-oriented, energized',
    confidenceRange: '87–91%',
    isPrimary: false,
    components: [
      { 
        id: 6, 
        name: 'Jack Herer', 
        type: 'Sativa', 
        role: 'Driver',
        profile: 'Uplifting', 
        percentage: 50,
        arcColor: 'from-[#14B8A6] to-[#5EEAD4]',
        terpenes: ['Terpinolene', 'Pinene', 'Caryophyllene'],
        description: 'Delivers focused mental energy and clarity. Terpinolene provides uplifting effects without anxiety.',
      },
      { 
        id: 1, 
        name: 'Blue Dream', 
        type: 'Hybrid', 
        role: 'Modulator',
        profile: 'Sativa Lean', 
        percentage: 30,
        arcColor: 'from-[#10B981] to-[#6EE7B7]',
        terpenes: ['Myrcene', 'Pinene', 'Caryophyllene'],
        description: 'Softens the sativa edge with mild myrcene relaxation while maintaining alertness.',
      },
      { 
        id: 2, 
        name: 'Northern Lights', 
        type: 'Indica', 
        role: 'Anchor',
        profile: 'Caryophyllene', 
        percentage: 20,
        arcColor: 'from-[#0891B2] to-[#67E8F9]',
        terpenes: ['Caryophyllene', 'Myrcene', 'Limonene'],
        description: 'Prevents overstimulation and anxiety with grounding caryophyllene.',
      },
    ]
  }
];