import type { MouseEvent } from 'react';
import { X, Plus, ArrowUpRight } from 'lucide-react';
import { recipeCategories } from '../../constants/recipeCategories';
import type { Recipe, RecipeInput } from '../../types';
import useRecipeForm from './useRecipeForm';

import './RecipeForm.css';

type RecipeFormProps = {
  initialRecipe: Recipe | null;
  onSave: (recipe: RecipeInput) => Promise<void>;
  onClose: () => void;
};

export const RecipeForm = ({ initialRecipe, onSave, onClose }: RecipeFormProps) => {
  const {
    form,
    imagePreview,
    formError,
    isSaving,
    handleImageChange,
    handleSubmit,
    updateField,
    updateListItem,
    addListItem,
    removeListItem,
  } = useRecipeForm({ initialRecipe, onSave });

  return (
    <div
      className="overlay"
      role="presentation"
      onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="modal form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">
              {initialRecipe ? 'PRITAIKYKITE SAU' : 'NAUJAS MĖGSTAMAS RECEPTAS'}
            </p>
            <h2 id="form-title">{initialRecipe ? 'Redaguoti receptą' : 'Pridėti receptą'}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Uždaryti formą">
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="recipe-form">
          <label>
            Recepto pavadinimas
            <input
              required
              maxLength={100}
              value={form.title}
              onChange={event => updateField('title', event.target.value)}
              placeholder="pvz., keptų pomidorų sriuba"
            />
          </label>
          <label>
            Trumpai apie receptą
            <textarea
              maxLength={240}
              value={form.description}
              onChange={event => updateField('description', event.target.value)}
              placeholder="Kuo šis receptas ypatingas?"
              rows={2}
            />
          </label>
          <div className="form-row">
            <label>
              Kategorija
              <select
                value={form.category}
                onChange={event => updateField('category', event.target.value)}
              >
                {recipeCategories
                  .filter(category => category.value !== 'All recipes')
                  .map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Gaminimo trukmė (min.)
              <input
                type="number"
                min="1"
                max="1440"
                required
                value={form.cooking_time}
                onChange={event => updateField('cooking_time', event.target.value)}
              />
            </label>
            <label>
              Porcijos
              <input
                type="number"
                min="1"
                max="100"
                required
                value={form.servings}
                onChange={event => updateField('servings', event.target.value)}
              />
            </label>
          </div>
          <div className="image-upload-field">
            <label htmlFor="recipe-image">Recepto nuotrauka</label>

            <input
              id="recipe-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />

            {imagePreview && (
              <img src={imagePreview} alt="Recepto nuotraukos peržiūra" className="image-preview" />
            )}

            <span className="field-hint">Pasirinkite JPG, PNG arba WebP nuotrauką (iki 5 MB).</span>

            {formError && (
              <p className="upload-error" role="alert">
                {formError}
              </p>
            )}
          </div>
          <fieldset className="list-fieldset">
            <legend>Ingredientai</legend>
            {form.ingredients.map((ingredient, index) => (
              <div className="list-input-row" key={`ingredient-${index}`}>
                <input
                  aria-label={`Ingredientas ${index + 1}`}
                  value={ingredient}
                  onChange={event => updateListItem('ingredients', index, event.target.value)}
                  placeholder={`Ingredientas ${index + 1}`}
                />
                {form.ingredients.length > 1 && (
                  <button
                    type="button"
                    className="remove-row"
                    onClick={() => removeListItem('ingredients', index)}
                    aria-label="Pašalinti ingredientą"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-button"
              onClick={() => addListItem('ingredients')}
            >
              <Plus size={15} /> Pridėti ingredientą
            </button>
          </fieldset>
          <fieldset className="list-fieldset">
            <legend>Gaminimo eiga</legend>
            {form.instructions.map((instruction, index) => (
              <div className="list-input-row instruction-input-row" key={`instruction-${index}`}>
                <span className="step-number">{index + 1}</span>
                <textarea
                  aria-label={`Žingsnis ${index + 1}`}
                  rows={2}
                  value={instruction}
                  onChange={event => updateListItem('instructions', index, event.target.value)}
                  placeholder={`Aprašykite ${index + 1} žingsnį`}
                />
                {form.instructions.length > 1 && (
                  <button
                    type="button"
                    className="remove-row"
                    onClick={() => removeListItem('instructions', index)}
                    aria-label="Pašalinti žingsnį"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-button"
              onClick={() => addListItem('instructions')}
            >
              <Plus size={15} /> Pridėti žingsnį
            </button>
          </fieldset>
          <div className="form-actions">
            <button type="button" className="button button-quiet" onClick={onClose}>
              Atšaukti
            </button>
            <button type="submit" className="button button-primary" disabled={isSaving}>
              {isSaving
                ? 'Išsaugoma...'
                : initialRecipe
                  ? 'Išsaugoti pakeitimus'
                  : 'Išsaugoti receptą'}
              {!isSaving && <ArrowUpRight size={16} />}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
