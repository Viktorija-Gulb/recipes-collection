import { Leaf } from 'lucide-react';
import React from 'react';
import './Brand.css';

interface Props {
  reset?: () => void;
}

export const Brand: React.FC<Props> = ({ reset }) => {
  return (
    <a
      className="brand"
      href="#"
      onClick={event => {
        event.preventDefault();
        reset?.();
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
  );
};
