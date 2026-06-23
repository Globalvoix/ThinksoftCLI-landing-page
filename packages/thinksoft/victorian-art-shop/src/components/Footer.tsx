export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-ornament">✦ ✦ ✦</div>
      <p className="footer-text">
        &copy; {new Date().getFullYear()} Veridian Gallery. All rights reserved.
      </p>
      <p className="footer-sub">
        Est. 1883 &middot; London &middot; By appointment only
      </p>
    </footer>
  )
}
