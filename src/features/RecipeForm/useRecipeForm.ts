import { useEffect, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { uploadRecipeImage } from '../../services/uploadImageService';
import type { Recipe, RecipeInput } from '../../types';
import fallbackImage from '../../assets/images/fallback-image.webp';

type RecipeFormState = Omit<Recipe, 'id' | 'created_at' | 'cooking_time' | 'servings'> & {
  cooking_time: number | string;
  servings: number | string;
};

type RecipeListField = 'ingredients' | 'instructions';
type EditableField =
  'title' | 'description' | 'category' | 'cooking_time' | 'servings' | 'image_url';

type UseRecipeFormOptions = {
  initialRecipe: Recipe | null;
  onSave: (recipe: RecipeInput) => Promise<void>;
};

const createInitialForm = (recipe: Recipe | null): RecipeFormState =>
  recipe
    ? { ...recipe }
    : {
        title: '',
        description: '',
        category: 'Dinner',
        cooking_time: 30,
        servings: 2,
        image_url: '',
        ingredients: [''],
        instructions: [''],
        favorite: false,
      };

const useRecipeForm = ({ initialRecipe, onSave }: UseRecipeFormOptions) => {
  const [form, setForm] = useState<RecipeFormState>(() => createInitialForm(initialRecipe));
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(form.image_url || fallbackImage);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setFormError('Pasirinkite JPG, PNG arba WebP nuotrauką.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Nuotrauka negali būti didesnė nei 5 MB.');
      event.target.value = '';
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setFormError('');
  };

  const updateField = <K extends EditableField>(field: K, value: RecipeFormState[K]) => {
    setForm(current => ({ ...current, [field]: value }));
  };

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

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving) return;

    setIsSaving(true);
    setFormError('');

    try {
      let imageUrl = form.image_url.trim() || fallbackImage;

      if (selectedImage) {
        const uploadedImage = await uploadRecipeImage(selectedImage);
        imageUrl = uploadedImage.publicUrl;
      }

      await onSave({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        cooking_time: Math.max(1, Number(form.cooking_time) || 1),
        servings: Math.max(1, Number(form.servings) || 1),
        category: form.category.trim(),
        image_url: imageUrl,
        ingredients: form.ingredients.map(item => item.trim()).filter(Boolean),
        instructions: form.instructions.map(item => item.trim()).filter(Boolean),
        favorite: form.favorite,
      });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Nepavyko išsaugoti recepto. Bandykite dar kartą.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
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
  };
};

export default useRecipeForm;
