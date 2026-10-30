import { Heart, Leaf, Plus } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  openAddForm: () => void;
  setSelectedRecipeId: (value: null | string) => void;
  setActiveCategory: (value: string) => void;
  setFavoritesOnly: (value: boolean) => void;
  setQuery: (value: string) => void;
  favoritesOnly: boolean;
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
        onClick={event => {
          event.preventDefault();
          setSelectedRecipeId(null);
          setActiveCategory('All recipes');
          setFavoritesOnly(false);
          setQuery('');
        }}
        aria-label="Sekmadienio stalo pradinis puslapis"
      >
        <span className="brand-mark">
          <Leaf size={19} />
        </span>
        <span className="brand-name">
          sekmadienio <em>stalas</em>
        </span>
      </a>
      <nav className="header-nav" aria-label="Pagrindinė navigacija">
        <button
          className={!favoritesOnly ? 'nav-link active' : 'nav-link'}
          onClick={() => {
            setFavoritesOnly(false);
            setSelectedRecipeId(null);
          }}
        >
          Mano kolekcija
        </button>
        <button
          className={favoritesOnly ? 'nav-link active' : 'nav-link'}
          onClick={() => {
            setFavoritesOnly(true);
            setSelectedRecipeId(null);
          }}
        >
          <Heart size={15} /> Mėgstamiausi
        </button>
      </nav>
      <button className="button button-primary header-add" onClick={openAddForm}>
        <Plus size={17} /> <span>Pridėti receptą</span>
      </button>
    </header>
  );
};
