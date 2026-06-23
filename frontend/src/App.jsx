import { BrowserRouter, Routes, Route } from "react-router-dom"
import InstructionLanguagePage from "./pages/InstructionLanguagePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import IntroPage from "./pages/IntroPage"
import LanguagePage from "./pages/LanguagePage"
import LessonsPage from "./pages/LessonsPage"
import MCQPage from "./pages/MCQPage"
import AgentPage from "./pages/AgentPage"
import CertificatePage from "./pages/CertificatePage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InstructionLanguagePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/language" element={<LanguagePage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/mcq" element={<MCQPage />} />
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/certificate" element={<CertificatePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App