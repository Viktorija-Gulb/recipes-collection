import { X, Plus, ArrowUpRight } from 'lucide-react';
import { useState, type FormEvent, type MouseEvent } from 'react';

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

//TODO: duplicates in another component
const categories = ['All recipes', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks'];

//TODO: duplicate
type RecipeInput = Omit<Recipe, 'id' | 'createdAt'>;

type RecipeFormProps = {
  initialRecipe: Recipe | null;
  onSave: (recipe: RecipeInput) => void;
  onClose: () => void;
};

type RecipeFormState = Omit<Recipe, 'id' | 'createdAt'> & {
  time: number | string;
  servings: number | string;
};

type RecipeListField = 'ingredients' | 'instructions';

//TODO: duplicates in another component
const fallbackImage =
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=85';

export const RecipeForm = ({ initialRecipe, onSave, onClose }: RecipeFormProps) => {
  const [form, setForm] = useState<RecipeFormState>(() =>
    initialRecipe
      ? { ...initialRecipe }
      : {
          title: '',
          description: '',
          category: 'Dinner',
          time: 30,
          servings: 2,
          image: '',
          ingredients: [''],
          instructions: [''],
          favorite: false,
        }
  );

  const updateField = (
    field: 'title' | 'description' | 'category' | 'time' | 'servings' | 'image',
    value: string
  ) =>
    setForm(
      current =>
        ({
          ...current,
          [field]: value,
        }) as RecipeFormState
    );
  const updateListItem = (field: RecipeListField, index: number, value: string) => {
    setForm(current => ({
      ...current,
      [field]: current[field].map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
  };
  const addListItem = (field: RecipeListField) =>
    setForm(current => ({ ...current, [field]: [...current[field], ''] }));
  const removeListItem = (field: RecipeListField, index: number) =>
    setForm(current => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
    }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      time: Math.max(1, Number(form.time) || 1),
      servings: Math.max(1, Number(form.servings) || 1),
      image: form.image.trim() || fallbackImage,
      ingredients: form.ingredients.map(item => item.trim()).filter(Boolean),
      instructions: form.instructions.map(item => item.trim()).filter(Boolean),
    });
  };

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
            <p className="eyebrow">{initialRecipe ? 'MAKE IT YOURS' : 'A NEW FAVOURITE'}</p>
            <h2 id="form-title">{initialRecipe ? 'Edit recipe' : 'Add a recipe'}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close form">
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="recipe-form">
          <label>
            Recipe name
            <input
              required
              maxLength={100}
              value={form.title}
              onChange={event => updateField('title', event.target.value)}
              placeholder="e.g. Roasted tomato soup"
            />
          </label>
          <label>
            A little about it
            <textarea
              maxLength={240}
              value={form.description}
              onChange={event => updateField('description', event.target.value)}
              placeholder="What makes this recipe special?"
              rows={2}
            />
          </label>
          <div className="form-row">
            <label>
              Category
              <select
                value={form.category}
                onChange={event => updateField('category', event.target.value)}
              >
                {categories
                  .filter(category => category !== 'All recipes')
                  .map(category => (
                    <option key={category}>{category}</option>
                  ))}
              </select>
            </label>
            <label>
              Cooking time (min)
              <input
                type="number"
                min="1"
                max="1440"
                required
                value={form.time}
                onChange={event => updateField('time', event.target.value)}
              />
            </label>
            <label>
              Servings
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
          <label>
            Photo URL
            <input
              type="url"
              value={form.image}
              onChange={event => updateField('image', event.target.value)}
              placeholder="https://…"
            />
            <span className="field-hint">
              Paste an image URL. Cloud photo uploads can be added when we connect storage.
            </span>
          </label>
          <fieldset className="list-fieldset">
            <legend>Ingredients</legend>
            {form.ingredients.map((ingredient, index) => (
              <div className="list-input-row" key={`ingredient-${index}`}>
                <input
                  aria-label={`Ingredient ${index + 1}`}
                  value={ingredient}
                  onChange={event => updateListItem('ingredients', index, event.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                />
                {form.ingredients.length > 1 && (
                  <button
                    type="button"
                    className="remove-row"
                    onClick={() => removeListItem('ingredients', index)}
                    aria-label="Remove ingredient"
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
              <Plus size={15} /> Add ingredient
            </button>
          </fieldset>
          <fieldset className="list-fieldset">
            <legend>Instructions</legend>
            {form.instructions.map((instruction, index) => (
              <div className="list-input-row instruction-input-row" key={`instruction-${index}`}>
                <span className="step-number">{index + 1}</span>
                <textarea
                  aria-label={`Step ${index + 1}`}
                  rows={2}
                  value={instruction}
                  onChange={event => updateListItem('instructions', index, event.target.value)}
                  placeholder={`Describe step ${index + 1}`}
                />
                {form.instructions.length > 1 && (
                  <button
                    type="button"
                    className="remove-row"
                    onClick={() => removeListItem('instructions', index)}
                    aria-label="Remove step"
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
              <Plus size={15} /> Add step
            </button>
          </fieldset>
          <div className="form-actions">
            <button type="button" className="button button-quiet" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button-primary">
              {initialRecipe ? 'Save changes' : 'Save recipe'} <ArrowUpRight size={16} />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
