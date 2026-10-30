import { useMemo, useState } from 'react'
import './App.css'
import { Footer } from './features/Footer/Footer'
import { Header } from './features/Header/Header'
import { HeroSection } from './features/HeroSection/HeroSection'
import { RecipeForm } from './features/RecipeForm/RecipeForm'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { db } from './config/firebase'
import { Bookmark, Search, SlidersHorizontal } from 'lucide-react'
import { RecipeCard } from './features/RecipeCard/RecipeCard'
import type { Recipe, RecipeInput, SortOption } from './types'
import useRecipes from './features/Hooks/useRecipes'
import { RecipeDetail } from './features/RecipeDetail/RecipeDetail'

const categories = [
  'All recipes',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snacks',
]

function App() {
  const { recipes, setRecipes } = useRecipes()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All recipes')
  const [formOpen, setFormOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const selectedRecipe =
    recipes.find((recipe) => recipe.id === selectedRecipeId) || null

  //TODO: dublicates in useRecipes
  const recipesRef = collection(db, 'all_recipes')

  const saveRecipe = async (formData: RecipeInput) => {
    if (editingRecipe) {
      await updateDoc(doc(db, 'all_recipes', editingRecipe.id), formData)
      setRecipes((current) =>
        current.map((recipe) =>
          recipe.id === editingRecipe.id ? { ...recipe, ...formData } : recipe
        )
      )
      setSelectedRecipeId(editingRecipe.id)
    } else {
      const newRecipe = {
        ...formData,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      }
      setRecipes((current) => [newRecipe, ...current])
      setSelectedRecipeId(newRecipe.id)

      await addDoc(recipesRef, newRecipe)
    }
    setFormOpen(false)
    setEditingRecipe(null)
  }

  const toggleFavorite = async (recipeId: string) => {
    const recipe = recipes.find((item) => item.id === recipeId)
    if (!recipe) return

    const favorite = !recipe.favorite

    try {
      await updateDoc(doc(db, 'all_recipes', recipeId), { favorite })
      setRecipes((current) =>
        current.map((item) =>
          item.id === recipeId ? { ...item, favorite } : item
        )
      )
    } catch (error) {
      console.error('Failed to save favorite:', error)
      window.alert('Could not save the favorite. Please try again.')
    }
  }

  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const result = recipes.filter((recipe) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          recipe.title,
          recipe.description,
          recipe.category,
          ...(recipe.ingredients || []),
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      const matchesCategory =
        activeCategory === 'All recipes' || recipe.category === activeCategory
      const matchesFavorite = !favoritesOnly || recipe.favorite
      return matchesQuery && matchesCategory && matchesFavorite
    })

    return [...result].sort((a, b) => {
      if (sortBy === 'quickest') return a.time - b.time
      if (sortBy === 'alphabetical') return a.title.localeCompare(b.title)
      return (b.createdAt || 0) - (a.createdAt || 0)
    })
  }, [recipes, query, activeCategory, favoritesOnly, sortBy])

  const openAddForm = () => {
    setSelectedRecipeId(null)
    setEditingRecipe(null)
    setFormOpen(true)
  }

  const openEditForm = () => {
    if (!selectedRecipe) return
    setEditingRecipe(selectedRecipe)
    setSelectedRecipeId(null)
    setFormOpen(true)
  }

  const deleteSelectedRecipe = async () => {
    if (!selectedRecipe) return

    try {
      const recipeRef = doc(db, 'all_recipes', selectedRecipe.id)
      setRecipes((prev) => prev.filter((task) => task.id != selectedRecipe.id))
      await deleteDoc(recipeRef)
    } catch (err) {
      // TODO: error handling
      console.log('error', err)
    }
  }

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
              <p className="eyebrow">THE RECIPE JOURNAL</p>
              <h2>
                {favoritesOnly
                  ? 'The ones you love'
                  : 'Something delicious awaits.'}
              </h2>
              <p className="section-description">
                {favoritesOnly
                  ? 'Your most-loved recipes, all in one place.'
                  : 'A growing collection of tried, treasured and soon-to-be favourites.'}
              </p>
            </div>
            <div className="collection-count">
              <span>{filteredRecipes.length.toString().padStart(2, '0')}</span>
              <small>
                RECIPES
                <br />
                AND COUNTING
              </small>
            </div>
          </div>

          <div className="collection-tools">
            <div className="search-box">
              <Search size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find a recipe or ingredient…"
                aria-label="Search recipes"
              />
              {query && (
                <button
                  className="clear-search"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              className={`filter-toggle ${mobileFiltersOpen ? 'is-open' : ''}`}
              onClick={() => setMobileFiltersOpen((open) => !open)}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            <label className="sort-control">
              <span>Sort by</span>
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as SortOption)
                }
                aria-label="Sort recipes"
              >
                <option value="newest">Recently added</option>
                <option value="quickest">Quickest first</option>
                <option value="alphabetical">A–Z</option>
              </select>
            </label>
          </div>

          <div
            className={`category-list ${mobileFiltersOpen ? 'show-mobile' : ''}`}
            aria-label="Filter by category"
          >
            {categories.map((category) => (
              <button
                key={category}
                className={`category-button ${activeCategory === category ? 'selected' : ''}`}
                onClick={() => {
                  setActiveCategory(category)
                  setMobileFiltersOpen(false)
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="recipe-grid">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onOpen={(item) => setSelectedRecipeId(item.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">
                <Bookmark size={23} />
              </span>
              <h3>Nothing simmering here just yet.</h3>
              <p>
                Try another search or add a recipe to start filling your
                collection.
              </p>
              <button
                className="button button-primary"
                onClick={
                  query || activeCategory !== 'All recipes' || favoritesOnly
                    ? () => {
                        setQuery('')
                        setActiveCategory('All recipes')
                        setFavoritesOnly(false)
                      }
                    : openAddForm
                }
              >
                {query || activeCategory !== 'All recipes' || favoritesOnly
                  ? 'Clear filters'
                  : 'Add your first recipe'}
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
            setFormOpen(false)
            setEditingRecipe(null)
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
  )
}

export default App
