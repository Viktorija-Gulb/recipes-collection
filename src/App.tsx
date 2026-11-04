import { useMemo, useState } from 'react';
import './App.css';
import { Footer } from './features/Footer/Footer';
import { Header } from './features/Header/Header';
import { HeroSection } from './features/HeroSection/HeroSection';
import { RecipeForm } from './features/RecipeForm/RecipeForm';
import type { Recipe, RecipeInput, SortOption } from './types';
import useRecipes from './features/Hooks/useRecipes';
import { RecipeDetail } from './features/RecipeDetail/RecipeDetail';
import {
  saveRecipe as persistRecipe,
  deleteRecipe as removeRecipe,
} from './services/recipeService';
import { RecipesCollection } from './features/RecipesCollection/RecipesCollection';

function App() {
  const { recipes, setRecipes } = useRecipes();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All recipes');
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const selectedRecipe = recipes.find(recipe => recipe.id === selectedRecipeId) || null;

  const saveRecipe = async (formData: RecipeInput) => {
    if (editingRecipe) {
      await persistRecipe(formData, editingRecipe.id);
      setRecipes(current =>
        current.map(recipe =>
          recipe.id === editingRecipe.id ? { ...recipe, ...formData } : recipe
        )
      );
      setSelectedRecipeId(editingRecipe.id);
    } else {
      const savedRecipe = await persistRecipe(formData);
      setRecipes(current => [{ ...formData, id: savedRecipe.id }, ...current]);
      setSelectedRecipeId(savedRecipe.id);
    }
    setFormOpen(false);
    setEditingRecipe(null);
  };

  const toggleFavorite = async (recipeId: string) => {
    const recipe = recipes.find(item => item.id === recipeId);
    if (!recipe) return;

    const favorite = !recipe.favorite;

    try {
      await persistRecipe({ ...recipe, favorite }, recipeId);
      setRecipes(current =>
        current.map(item => (item.id === recipeId ? { ...item, favorite } : item))
      );
    } catch (error) {
      console.error('Failed to save favorite:', error);
      window.alert('Nepavyko išsaugoti mėgstamiausio recepto. Bandykite dar kartą.');
    }
  };

  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = recipes.filter(recipe => {
      const matchesQuery =
        !normalizedQuery ||
        [recipe.title, recipe.description, recipe.category, ...(recipe.ingredients || [])]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory =
        activeCategory === 'All recipes' || recipe.category === activeCategory;
      const matchesFavorite = !favoritesOnly || recipe.favorite;
      return matchesQuery && matchesCategory && matchesFavorite;
    });
    return [...result].sort((a, b) => {
      if (sortBy === 'quickest') return a.cooking_time - b.cooking_time;
      if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
      return (b.created_at || 0) - (a.created_at || 0);
    });
  }, [recipes, query, activeCategory, favoritesOnly, sortBy]);

  const openAddForm = () => {
    setSelectedRecipeId(null);
    setEditingRecipe(null);
    setFormOpen(true);
  };

  const openEditForm = () => {
    if (!selectedRecipe) return;
    setEditingRecipe(selectedRecipe);
    setSelectedRecipeId(null);
    setFormOpen(true);
  };

  const deleteSelectedRecipe = async () => {
    if (!selectedRecipe) return;

    try {
      await removeRecipe(selectedRecipe.id);
      setRecipes(current => current.filter(recipe => recipe.id !== selectedRecipe.id));
      setSelectedRecipeId(null);
    } catch (error) {
      // TODO: error handling
      console.error('Failed to delete recipe:', error);
      window.alert('Nepavyko ištrinti recepto. Bandykite dar kartą.');
    }
  };

  return (
    <div className="app-shell">
      <Header
        openAddForm={openAddForm}
        setSelectedRecipeId={setSelectedRecipeId}
        setActiveCategory={setActiveCategory}
        setFavoritesOnly={setFavoritesOnly}
        setQuery={setQuery}
        favoritesOnly={favoritesOnly}
      />
      <main>
        <HeroSection />
        <RecipesCollection
          filteredRecipes={filteredRecipes}
          query={query}
          setQuery={setQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          favoritesOnly={favoritesOnly}
          setFavoritesOnly={setFavoritesOnly}
          sortBy={sortBy}
          setSortBy={setSortBy}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          toggleFavorite={toggleFavorite}
          openAddForm={openAddForm}
          setSelectedRecipeId={setSelectedRecipeId}
        />

        <section className="quote-section">
          <span className="quote-mark">“</span>
          <p>
            Dalydamiesi receptais,
            <br />
            <em>dalijamės prisiminimais.</em>
          </p>
          <span className="quote-credit">SU MEILE IŠ MŪSŲ VIRTUVĖS</span>
        </section>
      </main>
      <Footer />

      {formOpen && (
        <RecipeForm
          initialRecipe={editingRecipe}
          onSave={saveRecipe}
          onClose={() => {
            setFormOpen(false);
            setEditingRecipe(null);
          }}
        />
      )}

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipeId(null)}
          onEdit={openEditForm}
          onToggleFavorite={toggleFavorite}
          onDelete={deleteSelectedRecipe}
        />
      )}
    </div>
  );
}

export default App;
