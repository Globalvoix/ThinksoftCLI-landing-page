import { Link, useLocation } from "react-router-dom"

export function Header() {
  const { pathname } = useLocation()

  return (
    <header className="header">
      <div className="header-border" />
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">
            Veridian <span className="logo-accent">Gallery</span>
          </span>
        </Link>
        <nav className="header-nav">
          <Link to="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
            Home
          </Link>
          <Link
            to="/gallery"
            className={`nav-link ${pathname === "/gallery" ? "active" : ""}`}
          >
            Gallery
          </Link>
        </nav>
      </div>
    </header>
  )
}
