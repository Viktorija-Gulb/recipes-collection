import React from 'react';
import type { Recipe, SortOption } from '../../types';
import { recipeCategories } from '../../constants/recipeCategories';
import { RecipeCard } from '../RecipeCard/RecipeCard';
import { ArrowUpRight, Bookmark, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import './RecipeCollection.css';

interface Props {
  filteredRecipes: Recipe[];
  query: string;
  setQuery: (value: string) => void;
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (value: boolean) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (value: boolean) => void;
  toggleFavorite: (recipeId: string) => void;
  openAddForm: () => void;
  setSelectedRecipeId: (recipeId: string | null) => void;
}

export const RecipesCollection: React.FC<Props> = ({
  filteredRecipes,
  query,
  setQuery,
  activeCategory,
  setActiveCategory,
  favoritesOnly,
  setFavoritesOnly,
  sortBy,
  setSortBy,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  toggleFavorite,
  openAddForm,
  setSelectedRecipeId,
}) => {
  return (
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
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
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
          <button className="add-card" onClick={openAddForm}>
            <span className="add-card-icon">
              <Plus size={24} />
            </span>
            <span className="add-card-title">
              Dar vienas gardus
              <br />
              <em>atradimas.</em>
            </span>
            <span className="add-card-bottom">
              PRIDĖKITE SAVO RECEPTĄ <ArrowUpRight size={16} />
            </span>
          </button>
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
  );
};
