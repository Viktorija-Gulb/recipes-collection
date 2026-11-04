import type { Dispatch, SetStateAction } from 'react';
import {
  setRecipeFavorite,
  saveRecipe as persistRecipe,
  deleteRecipe as persistDeleteRecipe,
} from '../../services/recipeService';
import type { Recipe, RecipeInput } from '../../types';

const favoriteSaveErrorMessage = 'Nepavyko išsaugoti mėgstamiausio recepto. Bandykite dar kartą.';

const useRecipeActions = (recipes: Recipe[], setRecipes: Dispatch<SetStateAction<Recipe[]>>) => {
  const toggleFavorite = async (recipeId: string): Promise<void> => {
    const recipe = recipes.find(item => item.id === recipeId);
    if (!recipe) return;

    const favorite = !recipe.favorite;

    try {
      await setRecipeFavorite(recipeId, favorite);
      setRecipes(current =>
        current.map(item => (item.id === recipeId ? { ...item, favorite } : item))
      );
    } catch (error) {
      console.error('Failed to save favorite:', error);
      window.alert(favoriteSaveErrorMessage);
    }
  };

  const saveRecipe = async (formData: RecipeInput, recipeId?: string): Promise<string> => {
    const savedRecipe: Recipe = await persistRecipe(formData, recipeId);

    setRecipes(current =>
      recipeId
        ? current.map(recipe => (recipe.id === savedRecipe.id ? savedRecipe : recipe))
        : [savedRecipe, ...current]
    );

    return savedRecipe.id;
  };

  const deleteRecipe = async (recipeId: string): Promise<void> => {
    await persistDeleteRecipe(recipeId);
    setRecipes(current => current.filter(recipe => recipe.id !== recipeId));
  };

  return { toggleFavorite, saveRecipe, deleteRecipe };
};

export default useRecipeActions;
