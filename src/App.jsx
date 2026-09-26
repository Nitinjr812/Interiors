import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
// import LandingPage from "./pages/Landing"
import LandingPage from "./pages/Landingpage1"
import GalleryPage from "./pages/Gallery" 
import PortfolioPage from "./pages/Portfolio"

function App() {
  return (
    <BrowserRouter> 

      <Routes>
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/gallery" element={<GalleryPage/>} />
        <Route path="/Portfolio" element={<PortfolioPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App