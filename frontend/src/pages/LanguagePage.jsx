import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useTheme } from "../components/useTheme"

const languagesByInstructionLang = {
  hindi: [
    { id: "python", label: "🐍 Python", name: "Python", desc: "सबसे आसान programming language", key: "1" },
    { id: "sql", label: "🗄️ SQL", name: "SQL", desc: "Database की भाषा", key: "2" },
    { id: "javascript", label: "🌐 JavaScript", name: "JavaScript", desc: "Web के लिए language", key: "3" },
    { id: "coming", label: "🔜 और भी जल्द", name: "और भी जल्द", desc: "Java, C++, और भी आ रहे हैं", key: "4" },
  ],
  english: [
    { id: "python", label: "🐍 Python", name: "Python", desc: "The easiest programming language", key: "1" },
    { id: "sql", label: "🗄️ SQL", name: "SQL", desc: "The language of databases", key: "2" },
    { id: "javascript", label: "🌐 JavaScript", name: "JavaScript", desc: "The language of the web", key: "3" },
    { id: "coming", label: "🔜 Coming Soon", name: "Coming Soon", desc: "Java, C++, and more on the way", key: "4" },
  ],
  marathi: [
    { id: "python", label: "🐍 Python", name: "Python", desc: "सर्वात सोपी programming language", key: "1" },
    { id: "sql", label: "🗄️ SQL", name: "SQL", desc: "Database ची भाषा", key: "2" },
    { id: "javascript", label: "🌐 JavaScript", name: "JavaScript", desc: "Web साठी language", key: "3" },
    { id: "coming", label: "🔜 लवकरच येत आहे", name: "लवकरच येत आहे", desc: "Java, C++, आणखी भाषा येत आहेत", key: "4" },
  ],
}

const voiceLangMap = { hindi: "hi-IN", english: "en-US", marathi: "hi-IN" }

const uiText = {
  hindi: {
    title: "Language चुनें",
    sub: (name) => `नमस्ते ${name}! आप क्या सीखना चाहते हैं?`,
    welcome: (name) =>
      "नमस्ते " + name + "! अब आप कौन सी language सीखना चाहते हैं? " +
      "1 दबाएं Python के लिए। 2 दबाएं SQL के लिए। 3 दबाएं JavaScript के लिए। R दबाएं दोबारा सुनने के लिए।",
    comingSoon: "यह language जल्द आ रही है! अभी Python चुनें।",
    selected: (label) => label + " चुना! Lessons शुरू हो रहे हैं।",
    shortcuts: "Keyboard Shortcuts",
    repeat: "दोबारा सुनें",
  },
  english: {
    title: "Choose a Language",
    sub: (name) => `Hello ${name}! What would you like to learn?`,
    welcome: (name) =>
      "Hello " + name + "! Which language would you like to learn? " +
      "Press 1 for Python. Press 2 for SQL. Press 3 for JavaScript. Press R to hear this again.",
    comingSoon: "This language is coming soon! Please choose Python for now.",
    selected: (label) => label + " selected! Starting lessons.",
    shortcuts: "Keyboard Shortcuts",
    repeat: "Repeat",
  },
  marathi: {
    title: "Language निवडा",
    sub: (name) => `नमस्कार ${name}! तुम्हाला काय शिकायचे आहे?`,
    welcome: (name) =>
      "नमस्कार " + name + "! तुम्हाला कोणती language शिकायची आहे? " +
      "1 दाबा Python साठी। 2 दाबा SQL साठी। 3 दाबा JavaScript साठी। R दाबा पुन्हा ऐकण्यासाठी।",
    comingSoon: "ही language लवकरच येत आहे! आता Python निवडा.",
    selected: (label) => label + " निवडली! Lessons सुरू होत आहेत.",
    shortcuts: "Keyboard Shortcuts",
    repeat: "पुन्हा ऐका",
  },
}

function LanguagePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || "Friend"
  const instructionLang = location.state?.instructionLang || "hindi"
  const [lastMessage, setLastMessage] = useState("")
  const { theme, bg, cardBg, cardBorder, textColor, mutedColor } = useTheme()

  const languages = languagesByInstructionLang[instructionLang]
  const ui = uiText[instructionLang]
  const voiceLang = voiceLangMap[instructionLang]

  function speak(text, onEnd) {
    window.speechSynthesis.cancel()
    setLastMessage(text)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = voiceLang
    utterance.rate = parseFloat(localStorage.getItem("speed") || "0.85")

    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find(v =>
        (voiceLang === "en-US" && v.name === "Microsoft Zira - English (United States)") ||
        (voiceLang === "hi-IN" && v.name === "Google हिन्दी")
      ) || voices.find(v => v.lang === voiceLang)
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

  useEffect(() => {
    setTimeout(() => {
      speak(ui.welcome(name))
    }, 500)
  }, [])

  function selectLanguage(lang) {
    if (lang.id === "coming") {
      speak(ui.comingSoon)
      return
    }
    speak(ui.selected(lang.name), () => {
      navigate("/lessons", { state: { name, language: lang.id, instructionLang } })
    })
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
          <h1 style={{ color: "#a0a0ff", fontSize: "2rem", margin: "0.5rem 0 0" }}>{ui.title}</h1>
          <p style={{ color: mutedColor, margin: "0.3rem 0 0" }}>{ui.sub(name)}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
          {languages.map((lang) => (
            <button key={lang.id} onClick={() => selectLanguage(lang)}
              aria-label={lang.label + " — " + lang.key}
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
              <div style={{ color: "#a0a0ff", fontSize: "0.75rem", marginTop: "0.5rem" }}>({lang.key})</div>
            </button>
          ))}
        </div>

        <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "1rem", textAlign: "center" }}>
          <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0 0 0.5rem" }}>{ui.shortcuts}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            {languages.map(lang => (
              <div key={lang.key} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={{ background: "#2a2a5e", color: "#a0a0ff", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "bold" }}>{lang.key}</span>
                <span style={{ color: mutedColor, fontSize: "0.85rem" }}>{lang.label.split(" ").slice(1).join(" ")}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ background: "#2a2a5e", color: "#a0a0ff", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "bold" }}>R</span>
              <span style={{ color: mutedColor, fontSize: "0.85rem" }}>{ui.repeat}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default LanguagePage






























