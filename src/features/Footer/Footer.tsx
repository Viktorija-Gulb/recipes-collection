import { Leaf } from 'lucide-react';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <a className="brand footer-brand" href="#" onClick={event => event.preventDefault()}>
        <span className="brand-mark">
          <Leaf size={17} />
        </span>
        <span className="brand-name">
          the sunday <em>table</em>
        </span>
      </a>
      <span>MADE SLOWLY, SHARED GENEROUSLY.</span>
      <span>© {new Date().getFullYear()} THE SUNDAY TABLE</span>
    </footer>
  );
};
