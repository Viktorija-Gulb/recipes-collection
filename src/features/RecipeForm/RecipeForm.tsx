import { X, Plus, ArrowUpRight } from 'lucide-react';
import { useState, type FormEvent, type MouseEvent } from 'react';
import { recipeCategories } from '../../constants/recipeCategories';

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
            <p className="eyebrow">{initialRecipe ? 'PRITAIKYKITE SAU' : 'NAUJAS MĖGSTAMAS RECEPTAS'}</p>
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
                value={form.time}
                onChange={event => updateField('time', event.target.value)}
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
          <label>
            Nuotraukos nuoroda
            <input
              type="url"
              value={form.image}
              onChange={event => updateField('image', event.target.value)}
              placeholder="https://…"
            />
            <span className="field-hint">
              Įklijuokite nuotraukos nuorodą. Įkėlimo funkciją galėsime pridėti prijungę saugyklą.
            </span>
          </label>
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
            <button type="submit" className="button button-primary">
              {initialRecipe ? 'Išsaugoti pakeitimus' : 'Išsaugoti receptą'}{' '}
              <ArrowUpRight size={16} />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
