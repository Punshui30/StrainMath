export interface Strain {
  id: string;
  name: string;
  type: 'indica' | 'sativa' | 'hybrid';
  thc_percentage: number;
  cbd_percentage: number;
  terpene_profile: Record<string, number>;
  quantity_available: number;
  is_available: boolean;
  description: string;
  effects: string[];
  created_at: string;
  updated_at: string;
}

export interface Blend {
  id: string;
  user_id: string | null;
  driver_strain_id: string;
  driver_percentage: number;
  modulator_strain_id: string;
  modulator_percentage: number;
  anchor_strain_id: string;
  anchor_percentage: number;
  confidence_min: number;
  confidence_max: number;
  vibe_emphasis: string;
  outcome_goals: string[];
  is_committed: boolean;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  has_completed_onboarding: boolean;
  favorite_strain_ids: string[];
  preferred_effects: string[];
  blend_history_ids: string[];
  last_visit: string;
  created_at: string;
}

export interface BlendWithStrains extends Blend {
  driver_strain: Strain;
  modulator_strain: Strain;
  anchor_strain: Strain;
}
