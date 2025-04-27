/*
  # Initial schema for BrewLog

  1. New Tables
    - `caffeine_logs` - Stores user's coffee consumption records
    - `recipes` - Stores coffee recipes
    - `brew_guides` - Stores brewing guides
    - `brew_steps` - Stores steps for brew guides
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Caffeine Logs Table
CREATE TABLE IF NOT EXISTS caffeine_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  coffee_type text NOT NULL,
  brew_method text NOT NULL,
  serving_size numeric NOT NULL,
  serving_unit text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  notes text,
  caffeine_amount int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE caffeine_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own logs"
  ON caffeine_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own logs"
  ON caffeine_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs"
  ON caffeine_logs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs"
  ON caffeine_logs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Recipes Table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  ingredients jsonb NOT NULL,
  instructions jsonb NOT NULL,
  brew_method text NOT NULL,
  prep_time int,
  difficulty text,
  image_url text,
  is_favorite boolean DEFAULT false,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own recipes"
  ON recipes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own recipes"
  ON recipes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public recipes"
  ON recipes
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can update their own recipes"
  ON recipes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes"
  ON recipes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Brew Guides Table
CREATE TABLE IF NOT EXISTS brew_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  brew_method text NOT NULL,
  description text,
  total_time int,
  difficulty text,
  image_url text,
  created_by uuid,
  is_official boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE brew_guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view brew guides"
  ON brew_guides
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create custom brew guides"
  ON brew_guides
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own brew guides"
  ON brew_guides
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own brew guides"
  ON brew_guides
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Brew Steps Table
CREATE TABLE IF NOT EXISTS brew_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid NOT NULL REFERENCES brew_guides(id) ON DELETE CASCADE,
  order_num int NOT NULL,
  title text NOT NULL,
  description text,
  duration int,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE brew_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view brew steps"
  ON brew_steps
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create brew steps for their guides"
  ON brew_steps
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brew_guides
      WHERE id = guide_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update brew steps for their guides"
  ON brew_steps
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brew_guides
      WHERE id = guide_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete brew steps for their guides"
  ON brew_steps
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brew_guides
      WHERE id = guide_id AND created_by = auth.uid()
    )
  );

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_caffeine_logs_updated_at
BEFORE UPDATE ON caffeine_logs
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_recipes_updated_at
BEFORE UPDATE ON recipes
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_brew_guides_updated_at
BEFORE UPDATE ON brew_guides
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_brew_steps_updated_at
BEFORE UPDATE ON brew_steps
FOR EACH ROW EXECUTE FUNCTION update_updated_at();