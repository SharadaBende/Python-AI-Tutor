import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useTheme } from "../components/useTheme"

const translations = {
  hindi: {
    greeting: (name) => `नमस्ते ${name}! दृष्टि में आपका स्वागत है। मैं Pyra हूँ, आपकी coding tutor। क्या आप lessons शुरू करना चाहते हैं? H दबाएं हाँ के लिए, R दबाएं दोबारा सुनने के लिए।`,
    confirm: "बहुत अच्छा! चलिए सीखना शुरू करते हैं!",
    subtitle: "आपकी tutor — Pyra",
    question: "क्या आप lessons शुरू करना चाहते हैं?",
    yes: "हाँ!",
    repeat: "दोबारा",
  },
  english: {
    greeting: (name) => `Hello ${name}! Welcome to Drishti. I am Pyra, your coding tutor. Are you ready to start? Press H for yes, press R to hear this again.`,
    confirm: "Great! Let's start learning!",
    subtitle: "Your tutor — Pyra",
    question: "Are you ready to start lessons?",
    yes: "Yes!",
    repeat: "Repeat",
  },
  marathi: {
    greeting: (name) => `नमस्ते ${name}! दृष्टि मध्ये आपले स्वागत आहे। मी Pyra आहे, तुमची coding tutor। तुम्ही lessons सुरू करायला तयार आहात का? H दाबा हो साठी, R दाबा पुन्हा ऐकण्यासाठी।`,
    confirm: "छान! चला शिकायला सुरुवात करूया!",
    subtitle: "तुमची tutor — Pyra",
    question: "तुम्ही lessons सुरू करायला तयार आहात का?",
    yes: "हो!",
    repeat: "पुन्हा",
  },
}

const voiceLang = { hindi: "hi-IN", english: "en-US", marathi: "hi-IN" }

function IntroPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || "Friend"
  const user_id = location.state?.user_id
  const instructionLang = location.state?.instructionLang || "english"
  const t = translations[instructionLang]
  const lang = voiceLang[instructionLang]
  const [lastMessage, setLastMessage] = useState("")
  const { bg, cardBg, cardBorder, mutedColor } = useTheme()

  function speak(text, onEnd) {
    window.speechSynthesis.cancel()
    setLastMessage(text)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = parseFloat(localStorage.getItem("speed") || "0.85")
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find(v =>
        (lang === "en-US" && v.name === "Microsoft Zira - English (United States)") ||
        (lang === "hi-IN" && v.name === "Google हिन्दी")
      ) || voices.find(v => v.lang === lang)
      if (preferred) utterance.voice = preferred
      if (onEnd) utterance.onend = onEnd
      window.speechSynthesis.speak(utterance)
    }
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = trySpeak
    } else {
      trySpeak()
    }
  }

  function goToLanguage() {
    speak(t.confirm, () => {
      navigate("/language", { state: { name, user_id, instructionLang } })
    })
  }

  useEffect(() => {
    setTimeout(() => speak(t.greeting(name)), 500)
  }, [])

  useEffect(() => {
    function handleKey(e) {
      const key = e.key.toLowerCase()
      if (key === "h") goToLanguage()
      if (key === "r") speak(lastMessage)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [lastMessage])

  return (
    <main aria-label="Drishti Intro" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1a, #1a1a3e)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "1rem"
    }}>
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "4rem" }}>🎓</div>
          <h1 style={{ color: "#a0a0ff", fontSize: "2.5rem", margin: "0.5rem 0 0" }}>दृष्टि</h1>
          <p style={{ color: "#a0a0ff", fontSize: "1rem", margin: "0.3rem 0 0", letterSpacing: "2px" }}>Drishti</p>
          <p style={{ color: "#888", margin: "0.3rem 0 0" }}>जहाँ code बोलता है</p>
          <p style={{ color: "#666", margin: "0.2rem 0 0", fontSize: "0.9rem" }}>{t.subtitle}</p>
        </div>

        <div style={{
          background: cardBg, border: "1px solid " + cardBorder,
          padding: "2rem", borderRadius: "16px", textAlign: "center", marginBottom: "1.5rem"
        }}>
          <p style={{ fontSize: "1.3rem", color: "#fff", margin: "0 0 0.5rem" }}>
            नमस्ते <strong style={{ color: "#22c55e" }}>{name}</strong>! 🎉
          </p>
          <p style={{ color: "#ccc", margin: "0 0 1rem" }}>{t.question}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <button onClick={() => speak(lastMessage)} aria-label="R — Repeat"
            style={{ padding: "1rem", borderRadius: "12px", background: "#f4a261", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>
            🔁 {t.repeat}<br /><span style={{ fontSize: "0.8rem" }}>(R)</span>
          </button>
          <button onClick={goToLanguage} aria-label="H — Yes start"
            style={{ padding: "1rem", borderRadius: "12px", background: "#22c55e", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>
            ✅ {t.yes}<br /><span style={{ fontSize: "0.8rem" }}>(H)</span>
          </button>
        </div>
      </div>
    </main>
  )
}

export default IntroPage