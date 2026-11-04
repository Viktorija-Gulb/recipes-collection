import { useState } from 'react';
import { Heart, Leaf, Plus } from 'lucide-react';
import { LoginForm } from '../Auth/LoginForm';
import './Header.css';

interface HeaderProps {
  openAddForm: () => void;
  setSelectedRecipeId: (value: null | string) => void;
  setActiveCategory: (value: string) => void;
  setFavoritesOnly: (value: boolean) => void;
  setQuery: (value: string) => void;
  favoritesOnly: boolean;
  authLoading: boolean;
  isAdmin: boolean;
  onLogout: () => Promise<void>;
}

export const Header = ({
  openAddForm,
  setSelectedRecipeId,
  setActiveCategory,
  setFavoritesOnly,
  setQuery,
  favoritesOnly,
  authLoading,
  isAdmin,
  onLogout,
}: HeaderProps) => {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
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
        <div className="header-actions">
          {!authLoading &&
            (isAdmin ? (
              <div className="admin-controls">
                <span className="admin-status">Administratorius</span>
                <button className="button button-quiet header-auth" onClick={onLogout}>
                  Atsijungti
                </button>
              </div>
            ) : (
              <button
                className="button button-quiet header-auth"
                onClick={() => setLoginOpen(true)}
              >
                Admin prisijungimas
              </button>
            ))}

          {isAdmin && (
            <button className="button button-primary header-add" onClick={openAddForm}>
              <Plus size={17} /> <span>Pridėti receptą</span>
            </button>
          )}
        </div>
      </header>
      {loginOpen && <LoginForm onClose={() => setLoginOpen(false)} />}
    </>
  );
};
