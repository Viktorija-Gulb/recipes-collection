import { supabase } from '../config/supabase';
import type { RecipeInput } from '../types';

export const getRecipes = async () => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

export const saveRecipe = async (recipe: RecipeInput, recipeId?: string) => {
  const recipeData = {
    title: recipe.title,
    description: recipe.description,
    category: recipe.category,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    cooking_time: recipe.cooking_time,
    servings: recipe.servings,
    image_url: recipe.image_url,
    // updated_at: new Date().toISOString(),
    favorite: recipe.favorite,
  };

  if (recipeId) {
    // Update an existing recipe
    const { data, error } = await supabase
      .from('recipes')
      .update(recipeData)
      .eq('id', recipeId)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Recipe was not updated: no matching row or update permission.');

    return data;
  }

  // Insert a new recipe
  const { data, error } = await supabase.from('recipes').insert(recipeData).select().single();

  if (error) throw error;

  return data;
};

export const deleteRecipe = async (recipeId: string) => {
  const { error } = await supabase.from('recipes').delete().eq('id', recipeId);

  if (error) throw error;
};

export const setRecipeFavorite = async (recipeId: string, favorite: boolean): Promise<void> => {
  const { error } = await supabase.from('recipes').update({ favorite }).eq('id', recipeId);

  if (error) throw error;
};
