export interface ClimateAction {
  id: string;
  title: string;
  description: string;
  category: 'energy' | 'transport' | 'food' | 'waste' | 'shopping' | 'water' | 'advocacy';
  difficulty: 'easy' | 'medium' | 'hard';
  co2Reduction: number; // kg CO2 saved
  points: number;
  estimatedTime: number; // minutes
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  icon: string;
  tags: string[];
  locationBased: boolean;
  resources?: string[];
  aiPrompt?: string; // For AI recommendations
}

export interface UserPreference {
  userId: string;
  location: string;
  lifestyle: {
    hasCar: boolean;
    diet: 'omnivore' | 'vegetarian' | 'vegan';
    homeType: 'apartment' | 'house';
    energyProvider: string;
  };
  interests: string[];
  completedActions: string[];
  avoidedActions: string[];
  skillLevel: 'beginner' | 'intermediate' | 'expert';
}

export interface ActionCompletion {
  actionId: string;
  userId: string;
  completedAt: Date;
  co2Saved: number;
  notes?: string;
  evidence?: string; // Photo URL for verification
}