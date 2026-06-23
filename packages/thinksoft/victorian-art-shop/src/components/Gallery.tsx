import { Link } from "react-router-dom"
import { artworks } from "../data/artworks"

export function Gallery() {
  return (
    <main className="gallery-page">
      <section className="gallery-header">
        <h1 className="gallery-title">The Collection</h1>
        <p className="gallery-subtitle">
          Browse our current selection of original works
        </p>
      </section>

      <section className="gallery-grid">
        {artworks.map((artwork) => (
          <Link
            to={`/artwork/${artwork.id}`}
            key={artwork.id}
            className="gallery-card"
          >
            <div className="gallery-card-frame">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="gallery-card-image"
                loading="lazy"
              />
            </div>
            <div className="gallery-card-info">
              <h2 className="gallery-card-title">{artwork.title}</h2>
              <p className="gallery-card-artist">{artwork.artist}</p>
              <p className="gallery-card-year">{artwork.year}</p>
              <p className="gallery-card-price">
                &pound;{artwork.price.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}
