export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  cooking_time: number;
  servings: number;
  image_url: string;
  ingredients: string[];
  instructions: string[];
  favorite: boolean;
  created_at?: number;
}

export type RecipeInput = Omit<Recipe, 'id' | 'created_at'>;

export type SortOption = 'newest' | 'quickest' | 'alphabetical';
