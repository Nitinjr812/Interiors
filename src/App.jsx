import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
// import LandingPage from "./pages/Landing"
import LandingPage from "./pages/Landingpage1"

function App() {
  return (
    <BrowserRouter> 

      <Routes>
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App