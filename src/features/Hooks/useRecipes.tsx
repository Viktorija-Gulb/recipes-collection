import { useEffect, useState } from 'react';
import type { Recipe } from '../../types';
import { getRecipes } from '../../services/recipeService';

const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch recipes.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return { recipes, loading, error, setRecipes };
};

export default useRecipes;
