import { X, Heart, Clock3, ChefHat, Leaf } from 'lucide-react';
import type { FormEvent, MouseEvent } from 'react';
import { getCategoryLabel } from '../../constants/recipeCategories';

type Recipe = {
  id: string;
  title: string;
  description: string;
  category: string;
  time: number;
  servings: number;
  image: string;
  ingredients: string[];
  instructions: string[];
  favorite: boolean;
  createdAt?: number;
};

type RecipeDetailProps = {
  recipe: Recipe;
  onClose: () => void;
  onEdit: () => void;
  onToggleFavorite: (recipeId: string) => void;
  onDelete: () => void;
};

const fallbackImage =
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=85';

export const RecipeDetail = ({
  recipe,
  onClose,
  onEdit,
  onToggleFavorite,
  onDelete,
}: RecipeDetailProps) => {
  return (
    <div
      className="overlay detail-overlay"
      role="presentation"
      onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article
        className="modal detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        <div className="detail-image-wrap">
          <img src={recipe.image || fallbackImage} alt={recipe.title} className="detail-image" />
          <button className="detail-close icon-button" onClick={onClose} aria-label="Uždaryti receptą">
            <X />
          </button>
          <span className="category-tag detail-tag">{getCategoryLabel(recipe.category)}</span>
        </div>
        <div className="detail-content">
          <div className="detail-topline">
            <p className="eyebrow">IŠ JŪSŲ RECEPTŲ KNYGOS</p>
            <button
              className={`detail-favorite ${recipe.favorite ? 'is-favorite' : ''}`}
              onClick={() => onToggleFavorite(recipe.id)}
            >
              <Heart size={17} fill={recipe.favorite ? 'currentColor' : 'none'} />{' '}
              {recipe.favorite ? 'Išsaugota' : 'Išsaugoti'}
            </button>
          </div>
          <h2 id="detail-title" className="detail-title">
            {recipe.title}
          </h2>
          {recipe.description && <p className="detail-description">{recipe.description}</p>}
          <div className="detail-stats">
            <span>
              <Clock3 size={17} />
              <strong>{recipe.time} min.</strong>
              <small>gaminimo trukmė</small>
            </span>
            <span>
              <ChefHat size={17} />
              <strong>{recipe.servings}</strong>
              <small>porcijos</small>
            </span>
            <span>
              <Leaf size={17} />
              <strong>{getCategoryLabel(recipe.category)}</strong>
              <small>kategorija</small>
            </span>
          </div>
          <div className="detail-columns">
            <section>
              <p className="eyebrow">KO PRIREIKS</p>
              <h3>Ingredientai</h3>
              {recipe.ingredients?.length ? (
                <ul className="ingredient-list">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={`${ingredient}-${index}`}>{ingredient}</li>
                  ))}
                </ul>
              ) : (
                <p className="muted-copy">Ingredientų dar nėra.</p>
              )}
            </section>
            <section>
              <p className="eyebrow">GAMINIMO EIGA</p>
              <h3>Paruošimas</h3>
              {recipe.instructions?.length ? (
                <ol className="instruction-list">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={`${instruction}-${index}`}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <p>{instruction}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="muted-copy">Gaminimo žingsnių dar nėra.</p>
              )}
            </section>
          </div>
          <div className="detail-actions">
            <button className="button button-quiet" onClick={onEdit}>
              Redaguoti receptą
            </button>
            <button className="button button-danger" onClick={onDelete}>
              Ištrinti
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};
