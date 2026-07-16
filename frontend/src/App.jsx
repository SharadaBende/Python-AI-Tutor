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
import RouteFocusHandler from "./components/RouteFocusHandler"
import PracticePage from "./pages/PracticePage"
import GuardianViewPage from "./pages/GuardianViewPage"

function App() {
  return (
    <BrowserRouter>
      {/* Skip link: invisible until focused (first Tab press), then
          jumps keyboard/screen-reader users straight past the navbar
          and controls to the page's main content — id="main-content"
          must exist on the target page's <main> element. */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "0",
          background: "#1cb0f6",
          color: "#fff",
          padding: "0.75rem 1.25rem",
          borderRadius: "0 0 10px 0",
          zIndex: 1000,
          fontWeight: 700,
          textDecoration: "none",
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = "0"
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = "-9999px"
        }}
      >
        मुख्य content पर जाएं / Skip to main content
      </a>

      {/* Moves focus to the new page's main content on every route
          change, so screen readers announce the page change. */}
      <RouteFocusHandler />

      <Routes>
        <Route path="/" element={<InstructionLanguagePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/language" element={<LanguagePage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/mcq" element={<MCQPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/certificate" element={<CertificatePage />} />
        {/* Public, read-only — no login/instructionLang required.
            Not wrapped in RouteFocusHandler's voice-first assumptions
            since GuardianViewPage is a plain sighted-user page. */}
        <Route path="/guardian/:token" element={<GuardianViewPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App