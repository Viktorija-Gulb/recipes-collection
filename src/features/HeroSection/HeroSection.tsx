import { ArrowDownRight, Heart, Sparkles } from 'lucide-react'

export const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">
          <Sparkles size={14} /> YOUR LITTLE CORNER OF THE KITCHEN
        </p>
        <h1>
          Good food.
          <br />
          <em>Good memories.</em>
        </h1>
        <p className="hero-description">
          A home for the recipes you love, the ones you can't wait to make
          again, and the new favourites still waiting to happen.
        </p>
        <button
          className="button button-dark"
          onClick={() =>
            document
              .getElementById('recipe-collection')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          Explore the collection <ArrowDownRight size={17} />
        </button>
        <div className="hero-note">
          <span className="note-line" /> Collected with love, made to be shared.
        </div>
      </div>
      <div className="hero-visual">
        <img
          src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=90"
          alt="Fresh seasonal ingredients laid out on a kitchen table"
          fetchPriority="high"
        />
        <div className="hero-stamp">
          <span>MADE WITH</span>
          <Heart size={19} fill="currentColor" />
          <span>A LITTLE LOVE</span>
        </div>
        <div className="hero-caption">
          <span>01 / THE EVERYDAY EDIT</span>
          <span>Simple things, done beautifully.</span>
        </div>
      </div>
      <div className="hero-bottom-rule">
        <span>SEASONAL • SIMPLE • ALWAYS DELICIOUS</span>
        <span>VOL. 01 — YOUR RECIPE JOURNAL</span>
      </div>
    </section>
  )
}
