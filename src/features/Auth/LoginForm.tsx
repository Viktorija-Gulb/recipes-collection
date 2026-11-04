import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../config/supabase';
import './LoginForm.css';

type LoginFormProps = {
  onClose?: () => void;
};

export const LoginForm = ({ onClose }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      onClose?.();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Nepavyko prisijungti. Bandykite dar kartą.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="overlay login-overlay"
      role="presentation"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        className="modal login-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <div className="login-heading">
          <div>
            <p className="eyebrow">SEKMANO STALO ADMINISTRAVIMAS</p>
            <h2 id="login-title">Sveiki sugrįžę</h2>
          </div>
          {onClose && (
            <button className="icon-button" type="button" onClick={onClose} aria-label="Uždaryti">
              <X />
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            El. paštas
            <input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label>
            Slaptažodis
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button className="button button-primary login-submit" type="submit" disabled={loading}>
            {loading ? 'Jungiamasi...' : 'Prisijungti'}
          </button>
        </form>
      </section>
    </div>
  );
};
