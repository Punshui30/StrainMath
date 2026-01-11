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

export const blendRecommendations: BlendRecommendation[] = [
  {
    id: 1,
    name: 'Blue Dream Focus',
    vibeEmphasis: 'Alert, creative, conversational',
    confidenceRange: '94–97%',
    isPrimary: true,
    targets: { relaxation: 0.3, focus: 0.9, energy: 0.7, creativity: 0.8, pain_relief: 0.4, anti_anxiety: 0.5 },
    components: [
      { id: 1, name: 'Blue Dream', type: 'Hybrid', role: 'Driver', profile: 'Sativa Lean', percentage: 50, arcColor: 'from-[#14B8A6] to-[#5EEAD4]', terpenes: ['Myrcene', 'Pinene', 'Caryophyllene'], description: 'Foundational mood elevation and mental clarity.' },
      { id: 2, name: 'White Widow', type: 'Hybrid', role: 'Modulator', profile: 'Balanced', percentage: 30, arcColor: 'from-[#10B981] to-[#6EE7B7]', terpenes: ['Myrcene', 'Pinene', 'Caryophyllene'], description: 'Enhances cognitive sharpness and precision.' },
      { id: 3, name: 'Strawberry Cough', type: 'Sativa', role: 'Anchor', profile: 'Uplifting', percentage: 20, arcColor: 'from-[#0891B2] to-[#67E8F9]', terpenes: ['Myrcene', 'Pinene'], description: 'Adds creative spark and prevents mental fatigue.' }
    ]
  },
  {
    id: 2,
    name: 'Northern Calm',
    vibeEmphasis: 'Grounded, body-forward, at ease',
    confidenceRange: '89–93%',
    isPrimary: false,
    targets: { relaxation: 0.9, focus: 0.2, energy: 0.1, creativity: 0.3, pain_relief: 0.6, anti_anxiety: 0.9 },
    components: [
      { id: 4, name: 'Northern Lights', type: 'Indica', role: 'Driver', profile: 'Pure Calm', percentage: 50, arcColor: 'from-[#14B8A6] to-[#5EEAD4]', terpenes: ['Caryophyllene', 'Myrcene', 'Limonene'], description: 'Deep physical relaxation and anxiety reduction.' },
      { id: 5, name: 'Granddaddy Purple', type: 'Indica', role: 'Modulator', profile: 'Sedative', percentage: 30, arcColor: 'from-[#10B981] to-[#6EE7B7]', terpenes: ['Myrcene', 'Caryophyllene', 'Linalool'], description: 'Grounds the body and promotes restful calm.' },
      { id: 6, name: 'Blueberry', type: 'Indica', role: 'Anchor', profile: 'Sweet Ease', percentage: 20, arcColor: 'from-[#0891B2] to-[#67E8F9]', terpenes: ['Myrcene', 'Caryophyllene', 'Linalool'], description: 'Deepens the physical relaxation without full sedation.' }
    ]
  },
  {
    id: 3,
    name: 'Jack Energizer',
    vibeEmphasis: 'Sparkling, task-oriented, bright',
    confidenceRange: '87–91%',
    isPrimary: false,
    targets: { relaxation: 0.1, focus: 0.8, energy: 0.9, creativity: 0.6, pain_relief: 0.2, anti_anxiety: 0.3 },
    components: [
      { id: 7, name: 'Jack Herer', type: 'Sativa', role: 'Driver', profile: 'Uplifting', percentage: 50, arcColor: 'from-[#14B8A6] to-[#5EEAD4]', terpenes: ['Terpinolene', 'Pinene', 'Caryophyllene'], description: 'Focused mental energy and clarity.' },
      { id: 8, name: 'Sour Diesel', type: 'Sativa', role: 'Modulator', profile: 'Energizing', percentage: 30, arcColor: 'from-[#10B981] to-[#6EE7B7]', terpenes: ['Caryophyllene', 'Limonene', 'Myrcene'], description: 'Adds social confidence and physical drive.' },
      { id: 9, name: 'Durban Poison', type: 'Sativa', role: 'Anchor', profile: 'Stimulating', percentage: 20, arcColor: 'from-[#0891B2] to-[#67E8F9]', terpenes: ['Terpinolene', 'Myrcene'], description: 'Maintains sustained alertness and task focus.' }
    ]
  },
  {
    id: 4,
    name: 'Sour Relief',
    vibeEmphasis: 'Numbing, focused, functional',
    confidenceRange: '92–95%',
    isPrimary: false,
    targets: { relaxation: 0.5, focus: 0.6, energy: 0.5, creativity: 0.4, pain_relief: 0.9, anti_anxiety: 0.4 },
    components: [
      { id: 10, name: 'Sour Diesel', type: 'Sativa', role: 'Driver', profile: 'Active Relief', percentage: 40, arcColor: 'from-[#14B8A6] to-[#5EEAD4]', terpenes: ['Caryophyllene', 'Limonene'], description: 'Attacks physical tension while maintaining high energy.' },
      { id: 11, name: 'White Widow', type: 'Hybrid', role: 'Modulator', profile: 'Balanced', percentage: 40, arcColor: 'from-[#10B981] to-[#6EE7B7]', terpenes: ['Myrcene', 'Caryophyllene'], description: 'Stabilizes the focus and provides mental clarity for the day.' },
      { id: 12, name: 'AK-47', type: 'Hybrid', role: 'Anchor', profile: 'Euphoric Relief', percentage: 20, arcColor: 'from-[#0891B2] to-[#67E8F9]', terpenes: ['Terpinolene', 'Caryophyllene'], description: 'Grounds the pain relief with subtle mood elevation.' }
    ]
  },
  {
    id: 5,
    name: 'Cookies Gourmet',
    vibeEmphasis: 'Comforting, sensory, appetite-inducing',
    confidenceRange: '90–94%',
    isPrimary: false,
    targets: { relaxation: 0.7, focus: 0.3, energy: 0.4, creativity: 0.5, pain_relief: 0.6, anti_anxiety: 0.6 },
    components: [
      { id: 13, name: 'Girl Scout Cookies', type: 'Hybrid', role: 'Driver', profile: 'Flavor-Forward', percentage: 45, arcColor: 'from-[#14B8A6] to-[#5EEAD4]', terpenes: ['Caryophyllene', 'Limonene'], description: 'Stimulates appetite and provides deep physical comfort.' },
      { id: 14, name: 'Purple Punch', type: 'Indica', role: 'Modulator', profile: 'Soothing', percentage: 35, arcColor: 'from-[#10B981] to-[#6EE7B7]', terpenes: ['Myrcene', 'Linalool'], description: 'Reduces nausea and deepens sensory enjoyment.' },
      { id: 15, name: 'Zkittlez', type: 'Indica', role: 'Anchor', profile: 'Relaxing', percentage: 20, arcColor: 'from-[#0891B2] to-[#67E8F9]', terpenes: ['Myrcene', 'Linalool'], description: 'Ensures the body is at ease during and after intake.' }
    ]
  },
  {
    id: 6,
    name: 'Wedding Zen',
    vibeEmphasis: 'Social, anti-anxiety, fluid',
    confidenceRange: '95–98%',
    isPrimary: false,
    targets: { relaxation: 0.6, focus: 0.5, energy: 0.4, creativity: 0.6, pain_relief: 0.3, anti_anxiety: 0.95 },
    components: [
      { id: 16, name: 'Wedding Cake', type: 'Hybrid', role: 'Driver', profile: 'Euphoric', percentage: 50, arcColor: 'from-[#14B8A6] to-[#5EEAD4]', terpenes: ['Limonene', 'Caryophyllene'], description: 'Eliminates social friction and racing thoughts.' },
      { id: 17, name: 'Gelato', type: 'Hybrid', role: 'Modulator', profile: 'Smooth', percentage: 30, arcColor: 'from-[#10B981] to-[#6EE7B7]', terpenes: ['Caryophyllene', 'Limonene'], description: 'Maintains conversational rhythm with physical calm.' },
      { id: 18, name: 'Do-Si-Dos', type: 'Indica', role: 'Anchor', profile: 'Grounding', percentage: 20, arcColor: 'from-[#0891B2] to-[#67E8F9]', terpenes: ['Limonene', 'Linalool'], description: 'Prevents anxiety peaks with deep stabilizing terpenes.' }
    ]
  },
  {
    id: 7,
    name: 'Granddaddy Night',
    vibeEmphasis: 'Heavy, sedative, restorative',
    confidenceRange: '96–99%',
    isPrimary: false,
    targets: { relaxation: 0.95, focus: 0.1, energy: 0.0, creativity: 0.2, pain_relief: 0.8, anti_anxiety: 0.9 },
    components: [
      { id: 19, name: 'Granddaddy Purple', type: 'Indica', role: 'Driver', profile: 'Sedative', percentage: 60, arcColor: 'from-[#14B8A6] to-[#5EEAD4]', terpenes: ['Myrcene', 'Caryophyllene', 'Linalool'], description: 'Full body shutdown for deep restorative rest.' },
      { id: 20, name: 'Bubba Kush', type: 'Indica', role: 'Modulator', profile: 'Heavy', percentage: 25, arcColor: 'from-[#10B981] to-[#6EE7B7]', terpenes: ['Myrcene', 'Humulene'], description: 'Reinforces the physical release and anti-spasmodic needs.' },
      { id: 21, name: 'Skywalker OG', type: 'Indica', role: 'Anchor', profile: 'Numbing', percentage: 15, arcColor: 'from-[#0891B2] to-[#67E8F9]', terpenes: ['Myrcene', 'Limonene'], description: 'Seals the relaxation with localized pain relief.' }
    ]
  },
  {
    id: 8,
    name: 'Super Lemon Spark',
    vibeEmphasis: 'Bright, citrus, high-noon',
    confidenceRange: '88–92%',
    isPrimary: false,
    targets: { relaxation: 0.2, focus: 0.7, energy: 0.95, creativity: 0.8, pain_relief: 0.3, anti_anxiety: 0.4 },
    components: [
      { id: 22, name: 'Super Lemon Haze', type: 'Sativa', role: 'Driver', profile: 'Citrus Energy', percentage: 50, arcColor: 'from-[#14B8A6] to-[#5EEAD4]', terpenes: ['Limonene', 'Terpinolene'], description: 'Instant mood uplift and cerebral stimulation.' },
      { id: 23, name: 'Maui Wowie', type: 'Sativa', role: 'Modulator', profile: 'Tropical', percentage: 30, arcColor: 'from-[#10B981] to-[#6EE7B7]', terpenes: ['Myrcene', 'Limonene'], description: 'Smooths the high-energy edges with euphoric clarity.' },
      { id: 24, name: 'Mimosa', type: 'Sativa', role: 'Anchor', profile: 'Optimistic', percentage: 20, arcColor: 'from-[#0891B2] to-[#67E8F9]', terpenes: ['Limonene', 'Myrcene'], description: 'Keeps the focus bright and prevents a afternoon crash.' }
    ]
  },
  {
    id: 9,
    name: 'Precision Widow',
    vibeEmphasis: 'Laser-focused, analytical, cold',
    confidenceRange: '91–95%',
    isPrimary: false,
    targets: { relaxation: 0.3, focus: 0.95, energy: 0.6, creativity: 0.5, pain_relief: 0.4, anti_anxiety: 0.6 },
    components: [
      { id: 25, name: 'White Widow', type: 'Hybrid', role: 'Driver', profile: 'Clinical', percentage: 50, arcColor: 'from-[#14B8A6] to-[#5EEAD4]', terpenes: ['Myrcene', 'Pinene'], description: 'Superior mental sharpness for analytical tasks.' },
      { id: 26, name: 'Trainwreck', type: 'Sativa', role: 'Modulator', profile: 'Impactful', percentage: 30, arcColor: 'from-[#10B981] to-[#6EE7B7]', terpenes: ['Terpinolene', 'Myrcene'], description: 'Adds high-bandwidth cognitive capacity.' },
      { id: 27, name: 'Chemdawg', type: 'Hybrid', role: 'Anchor', profile: 'Intense', percentage: 20, arcColor: 'from-[#0891B2] to-[#67E8F9]', terpenes: ['Caryophyllene', 'Myrcene'], description: 'Grounds the mental intensity with physical stability.' }
    ]
  },
  {
    id: 10,
    name: 'Balanced CBD Lift',
    vibeEmphasis: 'Mellow, clear, anti-tension',
    confidenceRange: '97–100%',
    isPrimary: false,
    targets: { relaxation: 0.8, focus: 0.4, energy: 0.3, creativity: 0.4, pain_relief: 0.7, anti_anxiety: 0.99 },
    components: [
      { id: 28, name: 'Harlequin', type: 'Sativa', role: 'Driver', profile: 'CBD Dominant', percentage: 60, arcColor: 'from-[#14B8A6] to-[#5EEAD4]', terpenes: ['Myrcene', 'Pinene'], description: 'Gentle cerebral uplift without the psychoactive edge.' },
      { id: 29, name: 'Blue Dream', type: 'Hybrid', role: 'Modulator', profile: 'Balanced', percentage: 25, arcColor: 'from-[#10B981] to-[#6EE7B7]', terpenes: ['Myrcene', 'Pinene'], description: 'Adds just enough mood elevation for social comfort.' },
      { id: 30, name: 'Strawberry Cough', type: 'Sativa', role: 'Anchor', profile: 'Anti-Anxiety', percentage: 15, arcColor: 'from-[#0891B2] to-[#67E8F9]', terpenes: ['Pinene', 'Caryophyllene'], description: 'Subtle creative spark with grounding terpene modulators.' }
    ]
  }
];