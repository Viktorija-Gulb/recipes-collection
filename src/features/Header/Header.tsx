import { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import { LoginForm } from '../Auth/LoginForm';
import './Header.css';
import { Brand } from '../../common/Brand/Brand';

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

  const reset = () => {
    setSelectedRecipeId(null);
    setActiveCategory('All recipes');
    setFavoritesOnly(false);
    setQuery('');
  };

  return (
    <>
      <header className="site-header">
        <Brand reset={reset} />
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
