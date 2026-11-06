import './Footer.css';
import { Brand } from '../../common/Brand/Brand';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <Brand />
      <span>GAMINAME NESKUBĖDAMI, DALINAMĖS DOSNIAI.</span>
      <span>© {new Date().getFullYear()} SEKMADIENIO STALAS</span>
    </footer>
  );
};
