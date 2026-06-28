import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useTheme } from "../components/useTheme"

const languagesByInstructionLang = {
  hindi: [
    { id: "python",     label: "🐍 Python",      name: "Python",      desc: "सबसे आसान programming language", key: "1" },
    { id: "sql",        label: "🗄️ SQL",          name: "SQL",         desc: "Database की भाषा",               key: "2" },
    { id: "javascript", label: "🌐 JavaScript",   name: "JavaScript",  desc: "Web के लिए language",             key: "3" },
    { id: "java",       label: "☕ Java",          name: "Java",        desc: "Enterprise की भाषा",             key: "4" },
    { id: "cpp",        label: "⚡ C++",           name: "C++",         desc: "Speed और power की language",     key: "5" },
    { id: "html",       label: "🌸 HTML",          name: "HTML",        desc: "Web pages की structure",         key: "6" },
    { id: "css",        label: "🎨 CSS",           name: "CSS",         desc: "Web pages का design",            key: "7" },
    { id: "tailwind",   label: "💨 Tailwind CSS",  name: "Tailwind",    desc: "Utility-first CSS framework",    key: "8" },
    { id: "typescript", label: "🔷 TypeScript",    name: "TypeScript",  desc: "JavaScript का upgraded version", key: "9" },
  ],
  english: [
    { id: "python",     label: "🐍 Python",      name: "Python",      desc: "The easiest programming language", key: "1" },
    { id: "sql",        label: "🗄️ SQL",          name: "SQL",         desc: "The language of databases",        key: "2" },
    { id: "javascript", label: "🌐 JavaScript",   name: "JavaScript",  desc: "The language of the web",          key: "3" },
    { id: "java",       label: "☕ Java",          name: "Java",        desc: "The language of enterprise",       key: "4" },
    { id: "cpp",        label: "⚡ C++",           name: "C++",         desc: "Language of speed and power",      key: "5" },
    { id: "html",       label: "🌸 HTML",          name: "HTML",        desc: "Structure of web pages",           key: "6" },
    { id: "css",        label: "🎨 CSS",           name: "CSS",         desc: "Design of web pages",              key: "7" },
    { id: "tailwind",   label: "💨 Tailwind CSS",  name: "Tailwind",    desc: "Utility-first CSS framework",      key: "8" },
    { id: "typescript", label: "🔷 TypeScript",    name: "TypeScript",  desc: "Upgraded version of JavaScript",   key: "9" },
  ],
  marathi: [
    { id: "python",     label: "🐍 Python",      name: "Python",      desc: "सर्वात सोपी programming language", key: "1" },
    { id: "sql",        label: "🗄️ SQL",          name: "SQL",         desc: "Database ची भाषा",                key: "2" },
    { id: "javascript", label: "🌐 JavaScript",   name: "JavaScript",  desc: "Web साठी language",               key: "3" },
    { id: "java",       label: "☕ Java",          name: "Java",        desc: "Enterprise ची भाषा",              key: "4" },
    { id: "cpp",        label: "⚡ C++",           name: "C++",         desc: "Speed आणि power ची language",     key: "5" },
    { id: "html",       label: "🌸 HTML",          name: "HTML",        desc: "Web pages ची structure",          key: "6" },
    { id: "css",        label: "🎨 CSS",           name: "CSS",         desc: "Web pages चे design",             key: "7" },
    { id: "tailwind",   label: "💨 Tailwind CSS",  name: "Tailwind",    desc: "Utility-first CSS framework",     key: "8" },
    { id: "typescript", label: "🔷 TypeScript",    name: "TypeScript",  desc: "JavaScript चे upgraded version",  key: "9" },
  ],
}

const voiceLangMap = { hindi: "hi-IN", english: "en-US", marathi: "hi-IN" }

const uiText = {
  hindi: {
    title: "Language चुनें",
    sub: (name) => `नमस्ते ${name}! आप क्या सीखना चाहते हैं?`,
    welcome: (name) =>
      "नमस्ते " + name + "! अब आप कौन सी language सीखना चाहते हैं? " +
      "1 दबाएं Python के लिए। 2 दबाएं SQL के लिए। 3 दबाएं JavaScript के लिए। 4 दबाएं Java के लिए। 5 दबाएं C plus plus के लिए। 6 दबाएं HTML के लिए। 7 दबाएं CSS के लिए। 8 दबाएं Tailwind CSS के लिए। 9 दबाएं TypeScripts के लिए। R दबाएं दोबारा सुनने के लिए।",
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
      "Press 1 for Python. Press 2 for SQL. Press 3 for JavaScript. Press 4 for Java. Press 5 for C++. Press 6 for HTML. Press 7 for CSS. Press 8 for Tailwind css. Press 9 for TypeScripts. Press R to hear this again.",
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
      "1 दाबा Python साठी। 2 दाबा SQL साठी। 3 दाबा JavaScript साठी। 4 दाबा Java साठी। 5 दाबा C++ साठी। 6 दाबा HTML साठी। 7 दाबा CSS साठी। 8 दाबा Tailwind css साठी। 9 दाबा TypeScripts साठी। R दाबा पुन्हा ऐकण्यासाठी।",
    comingSoon: "ही language लवकरच येत आहे! आता Python निवडा.",
    selected: (label) => label + " निवडली! Lessons सुरू होत आहेत.",
    shortcuts: "Keyboard Shortcuts",
    repeat: "पुन्हा ऐका",
  },
}

// Design tokens
const ACCENT        = "#1cb0f6"
const ACCENT_SOFT   = "rgba(28,176,246,0.10)"
const ACCENT_HOVER  = "rgba(28,176,246,0.18)"
const ACCENT_BORDER = "rgba(28,176,246,0.28)"
const ACCENT_SHADOW = "#0a8fd4"
const CREAM         = "#f1f5f9"
const MUTED         = "#94a3b8"

function LanguagePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || "Friend"
  const instructionLang = location.state?.instructionLang || "hindi"
  const userId = location.state?.user_id
  const [lastMessage, setLastMessage] = useState("")
  const [hoveredId, setHoveredId] = useState(null)
  const [pressedId, setPressedId] = useState(null)

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
    setTimeout(() => speak(ui.welcome(name)), 500)
  }, [])

  function selectLanguage(lang) {
    if (lang.id === "coming") { speak(ui.comingSoon); return }
    speak(ui.selected(lang.name), () => {
      navigate("/lessons", { state: { name, language: lang.id, instructionLang, user_id: userId } })
    })
  }

  useEffect(() => {
    function handleKey(e) {
      const lang = languages.find(l => l.key === e.key)
      if (lang) {
        setPressedId(lang.id)
        setTimeout(() => setPressedId(null), 150)
        selectLanguage(lang)
      }
      if (e.key.toLowerCase() === "r") speak(lastMessage)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [lastMessage])

  return (
    <main aria-label="Language चुनें" style={{
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(160deg, #0d1b2a 0%, #0a0a0a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "2rem",
    }}>

      {/* Glow blobs — blue */}
      <div style={{
        position: "absolute", top: "-10%", left: "-10%",
        width: "420px", height: "420px", borderRadius: "50%",
        background: ACCENT, opacity: 0.07, filter: "blur(80px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-15%", right: "-10%",
        width: "480px", height: "480px", borderRadius: "50%",
        background: ACCENT, opacity: 0.05, filter: "blur(90px)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: "680px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.8rem", marginBottom: "0.25rem" }}>🌍</div>
          <h1 style={{ color: CREAM, fontSize: "2rem", margin: "0.4rem 0 0", fontWeight: 700 }}>
            {ui.title}
          </h1>
          <p style={{ color: MUTED, margin: "0.3rem 0 0" }}>{ui.sub(name)}</p>
        </div>

        {/* Language cards — 3D press on click */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          {languages.map((lang) => {
            const isComing  = lang.id === "coming"
            const isHovered = hoveredId === lang.id && !isComing
            const isPressed = pressedId === lang.id

            const cardBorder = isComing
              ? "rgba(255,255,255,0.06)"
              : isHovered ? ACCENT : ACCENT_BORDER

            const cardBg = isComing
              ? "rgba(255,255,255,0.02)"
              : isHovered ? ACCENT_HOVER : ACCENT_SOFT

            const cardShadow = isPressed
              ? "0 0px 0 0 transparent"
              : isHovered && !isComing
              ? `0 6px 0 0 ${ACCENT_SHADOW}`
              : `0 3px 0 0 rgba(28,176,246,0.2)`

            const cardTranslate = isPressed
              ? "translateY(6px)"
              : isHovered && !isComing
              ? "translateY(-2px)"
              : "translateY(0)"

            return (
              <button
                key={lang.id}
                onClick={() => selectLanguage(lang)}
                onMouseEnter={() => !isComing && setHoveredId(lang.id)}
                onMouseLeave={() => setHoveredId(null)}
                onMouseDown={() => !isComing && setPressedId(lang.id)}
                onMouseUp={() => setPressedId(null)}
                aria-label={`${lang.label} — press ${lang.key}`}
                style={{
                  padding: "1.75rem",
                  borderRadius: "16px",
                  border: `1px solid ${cardBorder}`,
                  cursor: isComing ? "not-allowed" : "pointer",
                  textAlign: "center",
                  fontFamily: "'Segoe UI', sans-serif",
                  background: cardBg,
                  backdropFilter: "blur(10px)",
                  opacity: isComing ? 0.4 : 1,
                  transform: cardTranslate,
                  boxShadow: cardShadow,
                  transition: "transform 0.1s, box-shadow 0.1s, border-color 0.15s, background 0.15s",
                }}
              >
                <div style={{ fontSize: "2.2rem", marginBottom: "0.4rem" }}>
                  {lang.label.split(" ")[0]}
                </div>
                <div style={{
                  color: isComing ? MUTED : ACCENT,
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  marginBottom: "0.25rem",
                }}>
                  {lang.label.split(" ").slice(1).join(" ")}
                </div>
                <div style={{ color: MUTED, fontSize: "0.83rem", marginBottom: "0.4rem" }}>
                  {lang.desc}
                </div>
                <div style={{
                  color: isComing ? "#555" : "rgba(28,176,246,0.55)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}>
                  ({lang.key})
                </div>
              </button>
            )
          })}
        </div>

        {/* Keyboard shortcuts bar */}
        <div style={{
          background: "rgba(28,176,246,0.05)",
          border: `1px solid ${ACCENT_BORDER}`,
          borderRadius: "12px",
          padding: "1rem",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}>
          <p style={{ color: MUTED, fontSize: "0.8rem", margin: "0 0 0.6rem", fontWeight: 500 }}>
            {ui.shortcuts}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            {languages.map(lang => (
              <div key={lang.key} style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <span style={{
                  background: ACCENT_SOFT,
                  color: ACCENT,
                  padding: "0.2rem 0.55rem",
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  border: `1px solid ${ACCENT_BORDER}`,
                }}>
                  {lang.key}
                </span>
                <span style={{ color: MUTED, fontSize: "0.82rem" }}>
                  {lang.label.split(" ").slice(1).join(" ")}
                </span>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <span style={{
                background: ACCENT_SOFT,
                color: ACCENT,
                padding: "0.2rem 0.55rem",
                borderRadius: "6px",
                fontWeight: 700,
                fontSize: "0.85rem",
                border: `1px solid ${ACCENT_BORDER}`,
              }}>
                R
              </span>
              <span style={{ color: MUTED, fontSize: "0.82rem" }}>{ui.repeat}</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

export default LanguagePage