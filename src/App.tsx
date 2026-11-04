import { useMemo, useState } from 'react';
import './App.css';
import { Footer } from './features/Footer/Footer';
import { Header } from './features/Header/Header';
import { HeroSection } from './features/HeroSection/HeroSection';
import { RecipeForm } from './features/RecipeForm/RecipeForm';
import { Bookmark, Search, SlidersHorizontal, X } from 'lucide-react';
import { RecipeCard } from './features/RecipeCard/RecipeCard';
import type { Recipe, RecipeInput, SortOption } from './types';
import useRecipes from './features/Hooks/useRecipes';
import { RecipeDetail } from './features/RecipeDetail/RecipeDetail';
import { recipeCategories } from './constants/recipeCategories';
import {
  saveRecipe as persistRecipe,
  deleteRecipe as removeRecipe,
} from './services/recipeService';

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
        <section className="collection-section" id="recipe-collection">
          <div className="section-heading">
            <div>
              <p className="eyebrow">RECEPTŲ KNYGA</p>
              <h2>{favoritesOnly ? 'Jūsų mėgstamiausi' : 'Čia laukia gardūs atradimai.'}</h2>
              <p className="section-description">
                {favoritesOnly
                  ? 'Visi jūsų mėgstamiausi receptai vienoje vietoje.'
                  : 'Vis gausėjanti išbandytų, brangių ir būsimų mėgstamiausių receptų kolekcija.'}
              </p>
            </div>
            <div className="collection-count">
              <span>{filteredRecipes.length.toString().padStart(2, '0')}</span>
              <small>
                RECEPTAI
                <br />
                IŠ VISO
              </small>
            </div>
          </div>

          <div className="collection-tools">
            <div className="search-box">
              <Search size={18} />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Ieškoti recepto ar ingrediento…"
                aria-label="Ieškoti receptų"
              />
              {query && (
                <button
                  className="clear-search"
                  onClick={() => setQuery('')}
                  aria-label="Išvalyti paiešką"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              className={`filter-toggle ${mobileFiltersOpen ? 'is-open' : ''}`}
              onClick={() => setMobileFiltersOpen(open => !open)}
            >
              <SlidersHorizontal size={16} /> Filtrai
            </button>
            <label className="sort-control">
              <span>Rikiuoti</span>
              <select
                value={sortBy}
                onChange={event => setSortBy(event.target.value as SortOption)}
                aria-label="Rikiuoti receptus"
              >
                <option value="newest">Naujausi</option>
                <option value="quickest">Greičiausi</option>
                <option value="alphabetical">Pagal abėcėlę</option>
              </select>
            </label>
          </div>

          <div
            className={`category-list ${mobileFiltersOpen ? 'show-mobile' : ''}`}
            aria-label="Filtruoti pagal kategoriją"
          >
            {recipeCategories.map(({ value, label }) => (
              <button
                key={value}
                className={`category-button ${activeCategory === value ? 'selected' : ''}`}
                onClick={() => {
                  setActiveCategory(value);
                  setMobileFiltersOpen(false);
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {filteredRecipes?.length > 0 ? (
            <div className="recipe-grid">
              {filteredRecipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onOpen={item => setSelectedRecipeId(item.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">
                <Bookmark size={23} />
              </span>
              <h3>Kol kas čia dar nieko nėra.</h3>
              <p>Pabandykite kitą paiešką arba pridėkite receptą į savo kolekciją.</p>
              <button
                className="button button-primary"
                onClick={
                  query || activeCategory !== 'All recipes' || favoritesOnly
                    ? () => {
                        setQuery('');
                        setActiveCategory('All recipes');
                        setFavoritesOnly(false);
                      }
                    : openAddForm
                }
              >
                {query || activeCategory !== 'All recipes' || favoritesOnly
                  ? 'Išvalyti filtrus'
                  : 'Pridėti pirmą receptą'}
              </button>
            </div>
          )}
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
