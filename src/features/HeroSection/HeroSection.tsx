import { ArrowDownRight, Heart, Sparkles } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">
          <Sparkles size={14} /> JŪSŲ MAŽAS VIRTUVĖS KAMPELIS
        </p>
        <h1>
          Skanus maistas.
          <br />
          <em>Gražūs prisiminimai.</em>
        </h1>
        <p className="hero-description">
          Namai receptams, kuriuos mėgstate, kuriuos norite gaminti dar kartą, ir naujiems
          atradimams, kurie dar tik laukia savo eilės.
        </p>
        <button
          className="button button-dark"
          onClick={() =>
            document.getElementById('recipe-collection')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          Peržiūrėti kolekciją <ArrowDownRight size={17} />
        </button>
        <div className="hero-note">
          <span className="note-line" /> Su meile surinkta ir dalijimuisi skirta.
        </div>
      </div>
      <div className="hero-visual">
        <img
          src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=90"
          alt="Švieži sezoniniai produktai ant virtuvės stalo"
          fetchPriority="high"
        />
        <div className="hero-stamp">
          <span>SU</span>
          <Heart size={19} fill="currentColor" />
          <span>MEILE</span>
        </div>
        <div className="hero-caption">
          <span>01 / KASDIENIŠKI SKONIAI</span>
          <span>Paprasta, bet ypatinga.</span>
        </div>
      </div>
      <div className="hero-bottom-rule">
        <span>SEZONIŠKA • PAPRASTA • VISADA SKANU</span>
        <span>01 TOMAS — JŪSŲ RECEPTŲ KNYGA</span>
      </div>
    </section>
  );
};
