/*
  # Cannabis Guided Outcome Calculator Schema

  ## Overview
  Production-grade schema for cannabis blend calculator with inventory management,
  blend calculations, and user preferences.

  ## Tables Created
  
  ### 1. strains
  Core inventory table storing real strain data
  - `id` (uuid, primary key) - Unique strain identifier
  - `name` (text, unique) - Strain name
  - `type` (text) - Strain type: indica, sativa, hybrid
  - `thc_percentage` (numeric) - THC content
  - `cbd_percentage` (numeric) - CBD content
  - `terpene_profile` (jsonb) - Terpene composition
  - `quantity_available` (integer) - Current inventory count
  - `is_available` (boolean) - Availability flag
  - `description` (text) - Strain description
  - `effects` (text[]) - Array of effect tags
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. blends
  Stores calculated blend recommendations with three-component structure
  - `id` (uuid, primary key) - Unique blend identifier
  - `user_id` (uuid, nullable) - Associated user (null for anonymous)
  - `driver_strain_id` (uuid) - Driver component strain
  - `driver_percentage` (numeric) - Driver ratio (0-100)
  - `modulator_strain_id` (uuid) - Modulator component strain
  - `modulator_percentage` (numeric) - Modulator ratio (0-100)
  - `anchor_strain_id` (uuid) - Anchor component strain
  - `anchor_percentage` (numeric) - Anchor ratio (0-100)
  - `confidence_min` (numeric) - Confidence range minimum
  - `confidence_max` (numeric) - Confidence range maximum
  - `vibe_emphasis` (text) - Descriptive vibe text
  - `outcome_goals` (text[]) - User's stated goals
  - `is_committed` (boolean) - Whether user committed to blend
  - `created_at` (timestamptz) - Creation timestamp

  ### 3. user_preferences
  Stores returning user data and preferences
  - `id` (uuid, primary key) - Unique preference record
  - `user_id` (uuid, unique) - User identifier
  - `has_completed_onboarding` (boolean) - Onboarding status
  - `favorite_strain_ids` (uuid[]) - Array of favorite strains
  - `preferred_effects` (text[]) - Preferred effect tags
  - `blend_history_ids` (uuid[]) - Array of past blend IDs
  - `last_visit` (timestamptz) - Last app access
  - `created_at` (timestamptz) - First visit timestamp

  ## Security
  - RLS enabled on all tables
  - Public read access for strains (product catalog)
  - Authenticated user access for blends and preferences
  - Users can only access their own data
*/

-- Create strains table
CREATE TABLE IF NOT EXISTS strains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('indica', 'sativa', 'hybrid')),
  thc_percentage numeric NOT NULL DEFAULT 0 CHECK (thc_percentage >= 0 AND thc_percentage <= 100),
  cbd_percentage numeric NOT NULL DEFAULT 0 CHECK (cbd_percentage >= 0 AND cbd_percentage <= 100),
  terpene_profile jsonb DEFAULT '{}'::jsonb,
  quantity_available integer NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
  is_available boolean NOT NULL DEFAULT true,
  description text DEFAULT '',
  effects text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blends table
CREATE TABLE IF NOT EXISTS blends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  driver_strain_id uuid NOT NULL REFERENCES strains(id),
  driver_percentage numeric NOT NULL CHECK (driver_percentage >= 0 AND driver_percentage <= 100),
  modulator_strain_id uuid NOT NULL REFERENCES strains(id),
  modulator_percentage numeric NOT NULL CHECK (modulator_percentage >= 0 AND modulator_percentage <= 100),
  anchor_strain_id uuid NOT NULL REFERENCES strains(id),
  anchor_percentage numeric NOT NULL CHECK (anchor_percentage >= 0 AND anchor_percentage <= 100),
  confidence_min numeric NOT NULL DEFAULT 0 CHECK (confidence_min >= 0 AND confidence_min <= 100),
  confidence_max numeric NOT NULL DEFAULT 100 CHECK (confidence_max >= 0 AND confidence_max <= 100),
  vibe_emphasis text NOT NULL DEFAULT '',
  outcome_goals text[] DEFAULT ARRAY[]::text[],
  is_committed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT percentages_sum_to_100 CHECK (
    driver_percentage + modulator_percentage + anchor_percentage = 100
  )
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  has_completed_onboarding boolean NOT NULL DEFAULT false,
  favorite_strain_ids uuid[] DEFAULT ARRAY[]::uuid[],
  preferred_effects text[] DEFAULT ARRAY[]::text[],
  blend_history_ids uuid[] DEFAULT ARRAY[]::uuid[],
  last_visit timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_strains_available ON strains(is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_strains_type ON strains(type);
CREATE INDEX IF NOT EXISTS idx_blends_user_id ON blends(user_id);
CREATE INDEX IF NOT EXISTS idx_blends_created_at ON blends(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Enable Row Level Security
ALTER TABLE strains ENABLE ROW LEVEL SECURITY;
ALTER TABLE blends ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for strains (public read, admin write)
CREATE POLICY "Anyone can view available strains"
  ON strains FOR SELECT
  TO anon, authenticated
  USING (is_available = true);

CREATE POLICY "Authenticated users can view all strains"
  ON strains FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for blends
CREATE POLICY "Users can view their own blends"
  ON blends FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can create blends"
  ON blends FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anonymous users can create blends"
  ON blends FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Users can update their own blends"
  ON blends FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_strains_updated_at
  BEFORE UPDATE ON strains
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();