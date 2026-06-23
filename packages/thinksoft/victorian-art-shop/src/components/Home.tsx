import { Link } from "react-router-dom"

export function Home() {
  return (
    <main className="home">
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Veridian Gallery</h1>
          <p className="hero-subtitle">
            Fine Victorian &amp; Pre-Raphaelite Art
          </p>
          <p className="hero-description">
            Discover a curated collection of original works from the
            late nineteenth century&mdash;where gaslight meets
            imagination, and every brushstroke tells a story.
          </p>
          <Link to="/gallery" className="btn btn-primary">
            Enter the Gallery
          </Link>
        </div>
        <div className="hero-scroll">
          <span className="scroll-arrow">⌄</span>
        </div>
      </section>

      <section className="features-section">
        <div className="feature">
          <span className="feature-icon">◈</span>
          <h3>Original Works</h3>
          <p>
            Every piece is an authentic original, sourced directly from
            private collections and estate sales.
          </p>
        </div>
        <div className="feature">
          <span className="feature-icon">◈</span>
          <h3>Curated Collection</h3>
          <p>
            Each artwork is hand-selected for its historical
            significance, craft, and emotional resonance.
          </p>
        </div>
        <div className="feature">
          <span className="feature-icon">◈</span>
          <h3>Certificate of Authenticity</h3>
          <p>
            Every purchase includes a detailed provenance document and
            certificate signed by our curator.
          </p>
        </div>
      </section>

      <section className="teaser-section">
        <h2 className="section-title">Featured Artists</h2>
        <div className="teaser-grid">
          <div className="teaser-card">
            <div className="teaser-image-wrapper">
              <img
                src="https://picsum.photos/seed/eleanor/400/500"
                alt="Eleanor Blackwood"
                className="teaser-image"
              />
            </div>
            <h3 className="teaser-name">Eleanor Blackwood</h3>
            <p className="teaser-bio">
              Known for her dramatic portraits and symbolist
              compositions. Her work bridges the Pre-Raphaelite and
              Aesthetic movements.
            </p>
          </div>
          <div className="teaser-card">
            <div className="teaser-image-wrapper">
              <img
                src="https://picsum.photos/seed/sebastian/400/500"
                alt="Sebastian Thorne"
                className="teaser-image"
              />
            </div>
            <h3 className="teaser-name">Sebastian Thorne</h3>
            <p className="teaser-bio">
              Master of nocturnes and urban melancholy. Thorne&rsquo;s
              London scenes capture the poetry of gaslit streets.
            </p>
          </div>
          <div className="teaser-card">
            <div className="teaser-image-wrapper">
              <img
                src="https://picsum.photos/seed/clara/400/500"
                alt="Clara Whitby"
                className="teaser-image"
              />
            </div>
            <h3 className="teaser-name">Clara Whitby</h3>
            <p className="teaser-bio">
              A botanical illustrator of extraordinary precision. Her
              watercolours rival the finest scientific studies of the
              Royal Horticultural Society.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
