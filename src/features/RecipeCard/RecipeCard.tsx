import { Heart, Clock3, ArrowUpRight } from 'lucide-react';
import { getCategoryLabel } from '../../utils/constants';
import type { Recipe } from '../../types';
import fallbackImage from '../../assets/images/fallback-image.webp';
import './RecipeCard.css';

type RecipeCardProps = {
  recipe: Recipe;
  onOpen: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: string) => void;
};

export const RecipeCard = ({ recipe, onOpen, onToggleFavorite }: RecipeCardProps) => {
  return (
    <article className="recipe-card">
      <button
        className="card-image-button"
        onClick={() => onOpen(recipe)}
        aria-label={`Peržiūrėti receptą „${recipe.title}“`}
      >
        <img
          className="recipe-image"
          src={recipe.image_url || fallbackImage}
          alt={recipe.title}
          loading="lazy"
          decoding="async"
        />
        <span className="category-tag">{getCategoryLabel(recipe.category)}</span>
      </button>
      <button
        className={`favorite-button ${recipe.favorite ? 'is-favorite' : ''}`}
        onClick={() => onToggleFavorite(recipe.id)}
        aria-label={recipe.favorite ? 'Pašalinti iš mėgstamiausių' : 'Įtraukti į mėgstamiausius'}
        title={recipe.favorite ? 'Pašalinti iš mėgstamiausių' : 'Įtraukti į mėgstamiausius'}
      >
        <Heart size={18} fill={recipe.favorite ? 'currentColor' : 'none'} />
      </button>
      <button className="recipe-card-copy" onClick={() => onOpen(recipe)}>
        <span className="card-meta">
          <Clock3 size={14} /> {recipe.cooking_time} min. <span className="meta-dot">·</span>{' '}
          {getCategoryLabel(recipe.category)}
        </span>
        <span className="card-title">{recipe.title}</span>
        <span className="card-description">{recipe.description}</span>
        <span className="read-recipe">
          Peržiūrėti receptą <ArrowUpRight size={15} />
        </span>
      </button>
    </article>
  );
};
