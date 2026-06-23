import { Routes, Route } from "react-router-dom"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { Home } from "./components/Home"
import { Gallery } from "./components/Gallery"
import { ArtworkDetail } from "./components/ArtworkDetail"

function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/artwork/:id" element={<ArtworkDetail />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
