import { BrowserRouter, Routes, Route } from "react-router-dom"
import IntroPage from "./pages/IntroPage"
import LessonsPage from "./pages/LessonsPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/lessons" element={<LessonsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App