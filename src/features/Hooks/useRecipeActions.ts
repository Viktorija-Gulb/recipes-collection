import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  setRecipeFavorite,
  deleteRecipe as persistDeleteRecipe,
  uploadRecipe,
  getRecipes,
} from '../../services/recipeService';
import type { RecipeInput } from '../../types';

export const recipesQueryKey = ['recipes'] as const;

export const useGetRecipes = () => {
  const query = useQuery({
    queryKey: recipesQueryKey,
    queryFn: getRecipes,
  });

  return {
    recipes: query.data ?? [],
    loading: query.isPending,
    error: query.error?.message ?? null,
  };
};

type SaveRecipeVariables = {
  recipe: RecipeInput;
  recipeId?: string;
};

export const useSaveRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipe, recipeId }: SaveRecipeVariables) => uploadRecipe(recipe, recipeId),

    onSuccess: () => queryClient.invalidateQueries({ queryKey: recipesQueryKey }),
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipeId: string) => persistDeleteRecipe(recipeId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recipesQueryKey }),
  });
};

const favoriteSaveErrorMessage = 'Nepavyko išsaugoti mėgstamiausio recepto. Bandykite dar kartą.';

type ToggleFavoriteVariables = {
  recipeId: string;
  favorite: boolean;
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipeId, favorite }: ToggleFavoriteVariables) =>
      setRecipeFavorite(recipeId, favorite),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: recipesQueryKey }),
    onError: (error: unknown) => {
      console.error('Failed to save favorite:', error);
      window.alert(favoriteSaveErrorMessage);
    },
  });
};
