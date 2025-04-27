export interface CaffeineLog {
  id?: string;
  user_id: string;
  coffee_type: string;
  brew_method: string;
  serving_size: number;
  serving_unit: string;
  timestamp: string;
  notes?: string;
  created_at?: string;
}

export interface Recipe {
  id?: string;
  user_id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  brew_method: string;
  prep_time: number;
  difficulty: 'easy' | 'medium' | 'hard';
  image_url?: string;
  is_favorite: boolean;
  created_at?: string;
}

export interface BrewGuide {
  id: string;
  title: string;
  brew_method: string;
  description: string;
  steps: BrewStep[];
  total_time: number;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  image_url?: string;
}

export interface BrewStep {
  id: string;
  order: number;
  title: string;
  description: string;
  duration?: number;
  image_url?: string;
}

export type BrewMethod = 
  | 'Pour Over'
  | 'French Press'
  | 'Espresso'
  | 'Aeropress'
  | 'Cold Brew'
  | 'Moka Pot'
  | 'Chemex'
  | 'V60'
  | 'Siphon'
  | 'Turkish'
  | 'Other';

export type CoffeeType =
  | 'Arabica'
  | 'Robusta'
  | 'Blend'
  | 'Single Origin'
  | 'Espresso'
  | 'Dark Roast'
  | 'Medium Roast'
  | 'Light Roast'
  | 'Decaf'
  | 'Flavored'
  | 'Custom'
  | 'Other';