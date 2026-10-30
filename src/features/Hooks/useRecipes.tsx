import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import type { Recipe } from '../../types';
import { db } from '../../config/firebase';

const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async (): Promise<void> => {
      try {
        const querySnapshot = await getDocs(collection(db, 'all_recipes'));

        console.log(querySnapshot);

        const recipesData: Recipe[] = querySnapshot.docs.map(
          recipe =>
            ({
              ...recipe.data(),
              // Override id to firestore generated id for future crud operations
              id: recipe.id,
            }) as Recipe
        );

        setRecipes(recipesData);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Failed to fetch recipes.');
      } finally {
        setLoading(false);
      }
    };

    void fetchRecipes();
  }, []);

  return { recipes, loading, error, setRecipes };
};

export default useRecipes;
