import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { speak as speakUtil } from "../components/speak"
import { useTheme } from "../components/useTheme"

const languages = [
  { id: "python", label: "🐍 Python", desc: "सबसे आसान programming language", key: "1" },
  { id: "sql", label: "🗄️ SQL", desc: "Database की भाषा", key: "2" },
  { id: "javascript", label: "🌐 JavaScript", desc: "Web के लिए language", key: "3" },
  { id: "coming", label: "🔜 और भी जल्द", desc: "Java, C++, और भी आ रहे हैं", key: "4" },
]

function LanguagePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || "दोस्त"
  const [lastMessage, setLastMessage] = useState("")
  const { theme, bg, cardBg, cardBorder, textColor, mutedColor } = useTheme()

  function speak(text, onEnd) {
    speakUtil(text, onEnd, setLastMessage)
  }

  useEffect(() => {
    setTimeout(() => {
      speak(
        "नमस्ते " + name + "! अब आप कौन सी language सीखना चाहते हैं? " +
        "1 दबाएं Python के लिए। " +
        "2 दबाएं SQL के लिए। " +
        "3 दबाएं JavaScript के लिए। " +
        "R दबाएं दोबारा सुनने के लिए।"
      )
    }, 500)
  }, [])

  function selectLanguage(lang) {
    if (lang.id === "coming") {
      speak("यह language जल्द आ रही है! अभी Python चुनें।")
      return
    }
    speak(lang.label + " चुना! Lessons शुरू हो रहे हैं।")
    setTimeout(() => {
      navigate("/lessons", { state: { name, language: lang.id } })
    }, 1500)
  }

  useEffect(() => {
    function handleKey(e) {
      const key = e.key
      const lang = languages.find(l => l.key === key)
      if (lang) selectLanguage(lang)
      if (e.key.toLowerCase() === "r") speak(lastMessage)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [lastMessage])

  return (
    <main aria-label="Language चुनें" style={{
      minHeight: "100vh",
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "2rem"
    }}>
      <div style={{ width: "100%", maxWidth: "700px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem" }}>🌍</div>
          <h1 style={{ color: "#a0a0ff", fontSize: "2rem", margin: "0.5rem 0 0" }}>Language चुनें</h1>
          <p style={{ color: mutedColor, margin: "0.3rem 0 0" }}>नमस्ते {name}! आप क्या सीखना चाहते हैं?</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          {languages.map((lang) => (
            <button key={lang.id} onClick={() => selectLanguage(lang)}
              aria-label={lang.label + " — " + lang.key + " दबाएं"}
              style={{
                padding: "2rem", borderRadius: "16px", border: "2px solid",
                cursor: lang.id === "coming" ? "not-allowed" : "pointer",
                textAlign: "center", fontFamily: "'Segoe UI', sans-serif",
                background: lang.id === "coming" ? (theme === "dark" ? "#111" : "#f5f5f5") : cardBg,
                borderColor: lang.id === "coming" ? (theme === "dark" ? "#333" : "#ddd") : "#a0a0ff",
                opacity: lang.id === "coming" ? 0.5 : 1,
                transition: "all 0.2s"
              }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{lang.label.split(" ")[0]}</div>
              <div style={{ color: lang.id === "coming" ? mutedColor : "#a0a0ff", fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.3rem" }}>
                {lang.label.split(" ").slice(1).join(" ")}
              </div>
              <div style={{ color: mutedColor, fontSize: "0.85rem" }}>{lang.desc}</div>
              <div style={{ color: "#a0a0ff", fontSize: "0.75rem", marginTop: "0.5rem" }}>({lang.key} दबाएं)</div>
            </button>
          ))}
        </div>

        <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "1rem", textAlign: "center" }}>
          <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0 0 0.5rem" }}>Keyboard Shortcuts</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            {languages.map(lang => (
              <div key={lang.key} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={{ background: "#2a2a5e", color: "#a0a0ff", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "bold" }}>{lang.key}</span>
                <span style={{ color: mutedColor, fontSize: "0.85rem" }}>{lang.label.split(" ").slice(1).join(" ")}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ background: "#2a2a5e", color: "#a0a0ff", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "bold" }}>R</span>
              <span style={{ color: mutedColor, fontSize: "0.85rem" }}>दोबारा सुनें</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default LanguagePage