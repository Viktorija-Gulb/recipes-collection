import { Heart, Clock3, ArrowUpRight } from 'lucide-react'

//TODO: duplicates
type Recipe = {
  id: string
  title: string
  description: string
  category: string
  time: number
  servings: number
  image: string
  ingredients: string[]
  instructions: string[]
  favorite: boolean
  createdAt?: number
}

type RecipeCardProps = {
  recipe: Recipe
  onOpen: (recipe: Recipe) => void
  onToggleFavorite: (recipeId: string) => void
}

//TODO: duplicate
const fallbackImage =
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=85'

export const RecipeCard = ({
  recipe,
  onOpen,
  onToggleFavorite,
}: RecipeCardProps) => {
  return (
    <article className="recipe-card">
      <button
        className="card-image-button"
        onClick={() => onOpen(recipe)}
        aria-label={`View ${recipe.title}`}
      >
        <img
          className="recipe-image"
          src={recipe.image || fallbackImage}
          alt={recipe.title}
          loading="lazy"
        />
        <span className="category-tag">{recipe.category}</span>
      </button>
      <button
        className={`favorite-button ${recipe.favorite ? 'is-favorite' : ''}`}
        onClick={() => onToggleFavorite(recipe.id)}
        aria-label={
          recipe.favorite ? 'Remove from favorites' : 'Add to favorites'
        }
        title={recipe.favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart size={18} fill={recipe.favorite ? 'currentColor' : 'none'} />
      </button>
      <button className="recipe-card-copy" onClick={() => onOpen(recipe)}>
        <span className="card-meta">
          <Clock3 size={14} /> {recipe.time} min{' '}
          <span className="meta-dot">·</span> {recipe.category}
        </span>
        <span className="card-title">{recipe.title}</span>
        <span className="card-description">{recipe.description}</span>
        <span className="read-recipe">
          Read recipe <ArrowUpRight size={15} />
        </span>
      </button>
    </article>
  )
}
