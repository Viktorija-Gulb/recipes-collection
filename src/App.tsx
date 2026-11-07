import { useState } from 'react';
import { Footer } from './features/Footer/Footer';
import { Header } from './features/Header/Header';
import { HeroSection } from './features/HeroSection/HeroSection';
import { RecipeForm } from './features/RecipeForm/RecipeForm';
import { RecipeDetail } from './features/RecipeDetail/RecipeDetail';
import { RecipesCollection } from './features/RecipesCollection/RecipesCollection';
import type { Recipe, RecipeInput, SortOption } from './types';
import useFilteredRecipes from './features/Hooks/useFilteredRecipes';
import {
  useDeleteRecipe,
  useGetRecipes,
  useSaveRecipe,
  useToggleFavorite,
} from './features/Hooks/useRecipeActions';
import './App.css';

import { isAdmin } from './utils/isAdmin';
import { supabase } from './config/supabase';
import { useAuth } from './features/Auth/useAuth';

function App() {
  const { recipes } = useGetRecipes();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All recipes');
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { user, loading } = useAuth();
  const admin = isAdmin(user?.id);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout failed:', error);
    }
  };

  const selectedRecipe = recipes.find(recipe => recipe.id === selectedRecipeId) || null;

  const { mutate: saveRecipeMutation } = useSaveRecipe();
  const deleteRecipeMutation = useDeleteRecipe();

  const favoriteMutation = useToggleFavorite();

  const toggleFavorite = (recipeId: string) => {
    const recipe = recipes.find(item => item.id === recipeId);
    if (!recipe) return;

    favoriteMutation.mutate({
      recipeId,
      favorite: !recipe.favorite,
    });
  };

  const saveRecipe = async (formData: RecipeInput) => {
    if (!admin) {
      throw new Error('Only an admin can add or edit recipes.');
    }

    saveRecipeMutation({ recipe: formData, recipeId: editingRecipe?.id });
    setFormOpen(false);
    setEditingRecipe(null);
  };
  const filteredRecipes = useFilteredRecipes(recipes, {
    query,
    activeCategory,
    favoritesOnly,
    sortBy,
  });

  const openAddForm = () => {
    if (!admin) return;

    setSelectedRecipeId(null);
    setEditingRecipe(null);
    setFormOpen(true);
  };

  const openEditForm = () => {
    if (!admin || !selectedRecipe) return;
    setEditingRecipe(selectedRecipe);
    setSelectedRecipeId(null);
    setFormOpen(true);
  };

  const deleteSelectedRecipe = async () => {
    if (!admin || !selectedRecipe) return;

    try {
      await deleteRecipeMutation.mutateAsync(selectedRecipe.id);
      setSelectedRecipeId(null);
    } catch (error) {
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
        authLoading={loading}
        isAdmin={admin}
        onLogout={handleLogout}
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
          isAdmin={admin}
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
          isAdmin={admin}
        />
      )}
    </div>
  );
}

export default App;
