import { useMemo } from 'react';
import type { Recipe, SortOption } from '../../types';

type Options = {
  query: string;
  activeCategory: string;
  favoritesOnly: boolean;
  sortBy: SortOption;
};

const useFilteredRecipes = (recipes: Recipe[], options: Options) => {
  const { query, activeCategory, favoritesOnly, sortBy } = options;

  return useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return recipes
      .filter(recipe => {
        const matchesQuery =
          !normalizedQuery ||
          [recipe.title, recipe.description, recipe.category, ...recipe.ingredients]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery);

        const matchesCategory =
          activeCategory === 'All recipes' || recipe.category === activeCategory;
        const matchesFavorite = !favoritesOnly || recipe.favorite;

        return matchesQuery && matchesCategory && matchesFavorite;
      })
      .sort((a, b) => {
        if (sortBy === 'quickest') return a.cooking_time - b.cooking_time;
        if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
        return (b.created_at ?? 0) - (a.created_at ?? 0);
      });
  }, [recipes, query, activeCategory, favoritesOnly, sortBy]);
};

export default useFilteredRecipes;
