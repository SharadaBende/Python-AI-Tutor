import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { speak as speakUtil } from "../components/speak"
import { useTheme } from "../components/useTheme"

const instructionLanguages = [
  { id: "hindi", label: "हिंदी", desc: "Hindi medium — सबसे popular", key: "1", flag: "🇮🇳", voiceLang: "hi-IN" },
  { id: "english", label: "English", desc: "English medium — for all users", key: "2", flag: "🌍", voiceLang: "en-US" },
  { id: "marathi", label: "मराठी", desc: "Marathi + English mix", key: "3", flag: "🇮🇳", voiceLang: "mr-IN" },
]

function InstructionLanguagePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || "Friend"
  const [lastMessage, setLastMessage] = useState("")
  const { theme, bg, cardBg, cardBorder, textColor, mutedColor } = useTheme()

  function speak(text, lang, onEnd) {
    window.speechSynthesis.cancel()
    setLastMessage({ text, lang })
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang || "hi-IN"
    utterance.rate = parseFloat(localStorage.getItem("speed") || "0.85")
    if (onEnd) utterance.onend = onEnd
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    setTimeout(() => {
      speak(
        "नमस्ते " + name + "! कृपया अपनी भाषा चुनिए। " +
        "1 दबाएं हिंदी के लिए। " +
        "2 दबाएं English के लिए। " +
        "3 दबाएं मराठी के लिए।",
        "hi-IN"
      )
    }, 500)
  }, [])

  function selectLanguage(lang) {
    const messages = {
      hindi: { text: "हिंदी चुना! चलिए शुरू करते हैं।", voice: "hi-IN" },
      english: { text: "English selected! Let's get started.", voice: "en-US" },
      marathi: { text: "मराठी निवडली! चला सुरू करूया।", voice: "mr-IN" },
    }
    const msg = messages[lang.id]
    speak(msg.text, msg.voice, () => {
      navigate("/language", { state: { name, instructionLang: lang.id } })
    })
  }

  useEffect(() => {
    function handleKey(e) {
      const lang = instructionLanguages.find(l => l.key === e.key)
      if (lang) selectLanguage(lang)
      if (e.key.toLowerCase() === "r") {
        if (lastMessage) speak(lastMessage.text, lastMessage.lang)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [lastMessage])

  return (
    <main aria-label="Instruction Language Selection" style={{
      minHeight: "100vh",
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "2rem"
    }}>
      <div style={{ width: "100%", maxWidth: "700px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem" }}>🗣️</div>
          <h1 style={{ color: "#a0a0ff", fontSize: "2rem", margin: "0.5rem 0 0" }}>Choose Your Language</h1>
          <p style={{ color: "#a0a0ff", margin: "0.3rem 0 0" }}>अपनी भाषा चुनें / Choose your language</p>
          <p style={{ color: mutedColor, margin: "0.3rem 0 0", fontSize: "0.9rem" }}>नमस्ते {name}!</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          {instructionLanguages.map((lang) => (
            <button key={lang.id} onClick={() => selectLanguage(lang)}
              aria-label={lang.label + " — press " + lang.key}
              style={{
                padding: "2rem 1rem", borderRadius: "16px",
                border: "2px solid #a0a0ff",
                cursor: "pointer", textAlign: "center",
                fontFamily: "'Segoe UI', sans-serif",
                background: cardBg,
                transition: "all 0.2s"
              }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{lang.flag}</div>
              <div style={{ color: "#a0a0ff", fontWeight: "bold", fontSize: "1.3rem", marginBottom: "0.3rem" }}>{lang.label}</div>
              <div style={{ color: mutedColor, fontSize: "0.85rem", marginBottom: "0.5rem" }}>{lang.desc}</div>
              <div style={{ color: "#a0a0ff", fontSize: "0.75rem" }}>(Press {lang.key})</div>
            </button>
          ))}
        </div>

        <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "1rem", textAlign: "center" }}>
          <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0 0 0.5rem" }}>Keyboard Shortcuts / कीबोर्ड शॉर्टकट</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            {instructionLanguages.map(lang => (
              <div key={lang.key} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={{ background: "#2a2a5e", color: "#a0a0ff", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "bold" }}>{lang.key}</span>
                <span style={{ color: mutedColor, fontSize: "0.85rem" }}>{lang.label}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ background: "#2a2a5e", color: "#a0a0ff", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "bold" }}>R</span>
              <span style={{ color: mutedColor, fontSize: "0.85rem" }}>Repeat / दोबारा</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default InstructionLanguagePage