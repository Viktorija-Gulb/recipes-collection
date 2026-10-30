export interface Recipe {
  id: string
  title: string
  description: string
  category: string
  time: number
  servings: number
  image: string
  ingredients: string[]
  instructions: string[]
  favorite: boolean
  createdAt?: number
}

export type RecipeInput = Omit<Recipe, 'id' | 'createdAt'>

export type SortOption = 'newest' | 'quickest' | 'alphabetical'