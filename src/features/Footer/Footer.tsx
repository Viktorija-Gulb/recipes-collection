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
          sekmadienio <em>stalas</em>
        </span>
      </a>
      <span>GAMINAME NESKUBĖDAMI, DALINAMĖS DOSNIAI.</span>
      <span>© {new Date().getFullYear()} SEKMADIENIO STALAS</span>
    </footer>
  );
};
