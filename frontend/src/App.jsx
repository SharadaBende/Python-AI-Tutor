import { BrowserRouter, Routes, Route } from "react-router-dom"
import IntroPage from "./pages/IntroPage"
import LessonsPage from "./pages/LessonsPage"
import MCQPage from "./pages/MCQPage"
import AgentPage from "./pages/AgentPage"
import CertificatePage from "./pages/CertificatePage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/mcq" element={<MCQPage />} />
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/certificate" element={<CertificatePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App