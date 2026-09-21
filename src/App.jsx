import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
// import LandingPage from "./pages/Landing"
import LandingPage from "./pages/Landingpage1"
import GalleryPage from "./pages/Gallery"

function App() {
  return (
    <BrowserRouter> 

      <Routes>
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/gallery" element={<GalleryPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App