import { useParams, Link } from "react-router-dom"
import { artworks } from "../data/artworks"

export function ArtworkDetail() {
  const { id } = useParams<{ id: string }>()
  const artwork = artworks.find((a) => a.id === Number(id))

  if (!artwork)
    return (
      <main className="not-found">
        <h1>Artwork not found</h1>
        <Link to="/gallery" className="btn btn-primary">
          Return to Gallery
        </Link>
      </main>
    )

  return (
    <main className="detail-page">
      <Link to="/gallery" className="back-link">
        &larr; Back to Gallery
      </Link>

      <div className="detail-layout">
        <div className="detail-image-wrapper">
          <div className="detail-image-frame">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="detail-image"
            />
          </div>
        </div>

        <div className="detail-info">
          <h1 className="detail-title">{artwork.title}</h1>
          <p className="detail-artist">{artwork.artist}</p>
          <p className="detail-year">{artwork.year}</p>

          <div className="detail-divider" />

          <p className="detail-description">{artwork.description}</p>

          <div className="detail-meta">
            <div className="meta-row">
              <span className="meta-label">Medium</span>
              <span className="meta-value">{artwork.medium}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Dimensions</span>
              <span className="meta-value">{artwork.dimensions}</span>
            </div>
            <div className="meta-row meta-price">
              <span className="meta-label">Price</span>
              <span className="meta-value">
                &pound;{artwork.price.toLocaleString()}
              </span>
            </div>
          </div>

          <button className="btn btn-primary btn-enquire" disabled>
            Enquire About This Piece
          </button>
          <p className="enquire-note">
            For purchase inquiries, please contact us directly.
          </p>
        </div>
      </div>
    </main>
  )
}
