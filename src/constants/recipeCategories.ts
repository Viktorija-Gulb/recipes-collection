export const recipeCategories = [
  { value: 'All recipes', label: 'Visi receptai' },
  { value: 'Breakfast', label: 'Pusryčiai' },
  { value: 'Lunch', label: 'Pietūs' },
  { value: 'Dinner', label: 'Vakarienė' },
  { value: 'Dessert', label: 'Desertai' },
  { value: 'Snacks', label: 'Užkandžiai' },
]

const categoryLabels = new Map(
  recipeCategories.map(({ value, label }) => [value, label])
)

export const getCategoryLabel = (category: string) =>
  categoryLabels.get(category) ?? category
