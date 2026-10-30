import { Heart, Leaf, Plus } from 'lucide-react'

interface HeaderProps {
  openAddForm: () => void
  setSelectedRecipeId: (value: null | string) => void
  setActiveCategory: (value: string) => void
  setFavoritesOnly: (value: boolean) => void
  setQuery: (value: string) => void
  favoritesOnly: boolean
}

export const Header = ({
  openAddForm,
  setSelectedRecipeId,
  setActiveCategory,
  setFavoritesOnly,
  setQuery,
  favoritesOnly,
}: HeaderProps) => {
  return (
    <header className="site-header">
      <a
        className="brand"
        href="#"
        onClick={(event) => {
          event.preventDefault()
          setSelectedRecipeId(null)
          setActiveCategory('All recipes')
          setFavoritesOnly(false)
          setQuery('')
        }}
        aria-label="The Sunday Table home"
      >
        <span className="brand-mark">
          <Leaf size={19} />
        </span>
        <span className="brand-name">
          the sunday <em>table</em>
        </span>
      </a>
      <nav className="header-nav" aria-label="Main navigation">
        <button
          className={!favoritesOnly ? 'nav-link active' : 'nav-link'}
          onClick={() => {
            setFavoritesOnly(false)
            setSelectedRecipeId(null)
          }}
        >
          My collection
        </button>
        <button
          className={favoritesOnly ? 'nav-link active' : 'nav-link'}
          onClick={() => {
            setFavoritesOnly(true)
            setSelectedRecipeId(null)
          }}
        >
          <Heart size={15} /> Favourites
        </button>
      </nav>
      <button
        className="button button-primary header-add"
        onClick={openAddForm}
      >
        <Plus size={17} /> <span>Add recipe</span>
      </button>
    </header>
  )
}
