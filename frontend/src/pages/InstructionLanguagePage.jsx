// import { useState, useEffect } from "react"
// import { useNavigate, useLocation } from "react-router-dom"
// import { speak as speakUtil } from "../components/speak"
// import { useTheme } from "../components/useTheme"

// const instructionLanguages = [
//   { id: "hindi", label: "हिंदी", desc: "Hindi medium — सबसे popular", key: "1", flag: "🇮🇳", voiceLang: "hi-IN" },
//   { id: "english", label: "English", desc: "English medium — for all users", key: "2", flag: "🌍", voiceLang: "en-US" },
//   { id: "marathi", label: "मराठी", desc: "Marathi + English mix", key: "3", flag: "🇮🇳", voiceLang: "mr-IN" },
// ]

// function InstructionLanguagePage() {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const name = location.state?.name || "Friend"
//   const [lastMessage, setLastMessage] = useState("")
//   const { theme, bg, cardBg, cardBorder, textColor, mutedColor } = useTheme()

//  function speak(text, lang, onEnd) {
//     window.speechSynthesis.cancel()
//     setLastMessage({ text, lang })
//     const targetLang = lang || "hi-IN"
//     const utterance = new SpeechSynthesisUtterance(text)
//     utterance.lang = targetLang
//     utterance.rate = parseFloat(localStorage.getItem("speed") || "0.85")

//     const trySpeak = () => {
//       const voices = window.speechSynthesis.getVoices()
//       const preferred = voices.find(v =>
//         (targetLang === "en-US" && v.name === "Microsoft Zira - English (United States)") ||
//         (targetLang === "hi-IN" && v.name === "Google हिन्दी")
//       ) || voices.find(v => v.lang === targetLang)
//       if (preferred) utterance.voice = preferred
//       if (onEnd) utterance.onend = onEnd
//       window.speechSynthesis.speak(utterance)
//     }

//     if (window.speechSynthesis.getVoices().length === 0) {
//       window.speechSynthesis.onvoiceschanged = trySpeak
//     } else {
//       trySpeak()
//     }
//   }

//   useEffect(() => {
//     setTimeout(() => {
//       const u1 = new SpeechSynthesisUtterance("1 दबाएं हिंदी के लिए।")
//       u1.lang = "hi-IN"
//       u1.rate = parseFloat(localStorage.getItem("speed") || "0.85")

//       const u2 = new SpeechSynthesisUtterance("For English, press 2.")
//       u2.lang = "en-US"
//       u2.rate = parseFloat(localStorage.getItem("speed") || "0.85")

//       const u3 = new SpeechSynthesisUtterance("मराठीसाठी 3 दाबा.")
//       u3.lang = "hi-IN"
//       u3.rate = parseFloat(localStorage.getItem("speed") || "0.85")

//       window.speechSynthesis.cancel()
//       window.speechSynthesis.speak(u1)
//       window.speechSynthesis.speak(u2)
//       window.speechSynthesis.speak(u3)
//     }, 500)
//   }, [])

//   function selectLanguage(lang) {
//     const messages = {
//       hindi: { text: "हिंदी चुना! चलिए शुरू करते हैं।", voice: "hi-IN" },
//       english: { text: "English selected! Let's get started.", voice: "en-US" },
//       marathi: { text: "मराठी निवडली! चला सुरू करूया।", voice: "hi-IN" },
//     }
//     const msg = messages[lang.id]
//     speak(msg.text, msg.voice, () => {
//       navigate("/login", { state: { instructionLang: lang.id } })
//     })
//   }

//   useEffect(() => {
//     function handleKey(e) {
//       const lang = instructionLanguages.find(l => l.key === e.key)
//       if (lang) selectLanguage(lang)
//       if (e.key.toLowerCase() === "r") {
//         if (lastMessage) speak(lastMessage.text, lastMessage.lang)
//       }
//     }
//     window.addEventListener("keydown", handleKey)
//     return () => window.removeEventListener("keydown", handleKey)
//   }, [lastMessage])

//   return (
//     <main aria-label="Instruction Language Selection" style={{
//       minHeight: "100vh",
//       background: bg,
//       display: "flex", alignItems: "center", justifyContent: "center",
//       fontFamily: "'Segoe UI', sans-serif", padding: "2rem"
//     }}>
//       <div style={{ width: "100%", maxWidth: "700px" }}>
//         <div style={{ textAlign: "center", marginBottom: "2rem" }}>
//           <div style={{ fontSize: "3rem" }}>🗣️</div>
//           <h1 style={{ color: "#a0a0ff", fontSize: "2rem", margin: "0.5rem 0 0" }}>Choose Your Language</h1>
//           <p style={{ color: "#a0a0ff", margin: "0.3rem 0 0" }}>अपनी भाषा चुनें / Choose your language</p>
//           <p style={{ color: mutedColor, margin: "0.3rem 0 0", fontSize: "0.9rem" }}>दृष्टि में आपका स्वागत है — Welcome to Drishti</p>
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
//           {instructionLanguages.map((lang) => (
//             <button key={lang.id} onClick={() => selectLanguage(lang)}
//               aria-label={lang.label + " — press " + lang.key}
//               style={{
//                 padding: "2rem 1rem", borderRadius: "16px",
//                 border: "2px solid #a0a0ff",
//                 cursor: "pointer", textAlign: "center",
//                 fontFamily: "'Segoe UI', sans-serif",
//                 background: cardBg,
//                 transition: "all 0.2s"
//               }}>
//               <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{lang.flag}</div>
//               <div style={{ color: "#a0a0ff", fontWeight: "bold", fontSize: "1.3rem", marginBottom: "0.3rem" }}>{lang.label}</div>
//               <div style={{ color: mutedColor, fontSize: "0.85rem", marginBottom: "0.5rem" }}>{lang.desc}</div>
//               <div style={{ color: "#a0a0ff", fontSize: "0.75rem" }}>(Press {lang.key})</div>
//             </button>
//           ))}
//         </div>

//         <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "1rem", textAlign: "center" }}>
//           <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0 0 0.5rem" }}>Keyboard Shortcuts / कीबोर्ड शॉर्टकट</p>
//           <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
//             {instructionLanguages.map(lang => (
//               <div key={lang.key} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
//                 <span style={{ background: "#2a2a5e", color: "#a0a0ff", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "bold" }}>{lang.key}</span>
//                 <span style={{ color: mutedColor, fontSize: "0.85rem" }}>{lang.label}</span>
//               </div>
//             ))}
//             <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
//               <span style={{ background: "#2a2a5e", color: "#a0a0ff", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "bold" }}>R</span>
//               <span style={{ color: mutedColor, fontSize: "0.85rem" }}>Repeat / दोबारा</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   )
// }

// export default InstructionLanguagePage








































import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

const instructionLanguages = [
  { id: "hindi", label: "हिंदी", desc: "Hindi medium — सबसे popular", key: "1", voiceLang: "hi-IN", emoji: "🇮🇳" },
  { id: "english", label: "English", desc: "English medium — for all users", key: "2", voiceLang: "en-US", emoji: "🌍" },
  { id: "marathi", label: "मराठी", desc: "Marathi + English mix", key: "3", voiceLang: "mr-IN", emoji: "🇮🇳" },
]

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

  .lang-card {
    background: rgba(255,255,255,0.05);
    border: 1.5px solid rgba(160,128,255,0.3);
    border-radius: 20px;
    padding: 2rem 1rem;
    cursor: pointer;
    text-align: center;
    transition: all 0.25s ease;
    backdrop-filter: blur(10px);
    font-family: 'Poppins', 'Segoe UI', sans-serif;
  }
  .lang-card:hover, .lang-card:focus {
    transform: translateY(-6px);
    border-color: #f4a261;
    background: rgba(244,162,97,0.08);
    box-shadow: 0 12px 40px rgba(244,162,97,0.2);
    outline: none;
  }
  .key-badge {
    display: inline-block;
    background: linear-gradient(135deg, #f4a261, #e76f51);
    color: #fff;
    font-weight: 700;
    font-size: 0.8rem;
    padding: 0.25rem 0.7rem;
    border-radius: 20px;
    margin-top: 0.6rem;
    letter-spacing: 1px;
  }
  .shortcut-pill {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(160,128,255,0.2);
    border-radius: 20px;
    padding: 0.35rem 0.9rem;
    font-size: 0.82rem;
  }
  .shortcut-key {
    background: linear-gradient(135deg, #a78bfa, #7c3aed);
    color: #fff;
    font-weight: 700;
    padding: 0.1rem 0.5rem;
    border-radius: 6px;
    font-size: 0.8rem;
  }
`

function InstructionLanguagePage() {
  const navigate = useNavigate()
  const [lastMessage, setLastMessage] = useState(null)
  const [selected, setSelected] = useState(null)

  function speak(text, lang, onEnd) {
    window.speechSynthesis.cancel()
    setLastMessage({ text, lang })
    const targetLang = lang || "hi-IN"
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = targetLang
    utterance.rate = parseFloat(localStorage.getItem("speed") || "0.85")
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find(v =>
        (targetLang === "en-US" && v.name === "Microsoft Zira - English (United States)") ||
        (targetLang === "hi-IN" && v.name === "Google हिन्दी")
      ) || voices.find(v => v.lang === targetLang)
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
      const rate = parseFloat(localStorage.getItem("speed") || "0.85")
      const u1 = new SpeechSynthesisUtterance("1 दबाएं हिंदी के लिए।")
      u1.lang = "hi-IN"; u1.rate = rate
      const u2 = new SpeechSynthesisUtterance("For English, press 2.")
      u2.lang = "en-US"; u2.rate = rate
      const u3 = new SpeechSynthesisUtterance("मराठीसाठी 3 दाबा.")
      u3.lang = "hi-IN"; u3.rate = rate
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u1)
      window.speechSynthesis.speak(u2)
      window.speechSynthesis.speak(u3)
    }, 500)
  }, [])

  function selectLanguage(lang) {
    setSelected(lang.id)
    const messages = {
      hindi: { text: "हिंदी चुना! चलिए शुरू करते हैं।", voice: "hi-IN" },
      english: { text: "English selected! Let's get started.", voice: "en-US" },
      marathi: { text: "मराठी निवडली! चला सुरू करूया।", voice: "hi-IN" },
    }
    const msg = messages[lang.id]
    speak(msg.text, msg.voice, () => {
      navigate("/login", { state: { instructionLang: lang.id } })
    })
  }

  useEffect(() => {
    function handleKey(e) {
      const lang = instructionLanguages.find(l => l.key === e.key)
      if (lang) selectLanguage(lang)
      if (e.key.toLowerCase() === "r" && lastMessage) {
        speak(lastMessage.text, lastMessage.lang)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [lastMessage])

  return (
    <>
      <style>{styles}</style>
      <main aria-label="Instruction Language Selection" style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 60% 20%, #2d1b69 0%, #0f0f1a 60%, #1a0a2e 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Poppins', 'Segoe UI', sans-serif", padding: "2rem",
        position: "relative", overflow: "hidden"
      }}>

        {/* decorative glow blobs */}
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(244,162,97,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ width: "100%", maxWidth: "740px", position: "relative", zIndex: 1 }}>

          {/* header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h1 style={{
              fontSize: "3rem", fontWeight: "700", margin: "0",
              color: "#f4a261",
              lineHeight: "1.3"
            }}>दृष्टि</h1>
            <p style={{ color: "#c4b5fd", fontSize: "0.95rem", margin: "0.2rem 0 0", letterSpacing: "3px", textTransform: "uppercase" }}>Drishti</p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", margin: "0.4rem 0 0" }}>जहाँ code बोलता है</p>

            <div style={{ marginTop: "1.5rem" }}>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.05rem", margin: 0 }}>
                अपनी भाषा चुनें &nbsp;·&nbsp; Choose your language &nbsp;·&nbsp; भाषा निवडा
              </p>
            </div>
          </div>

          {/* language cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.2rem", marginBottom: "2rem" }}>
            {instructionLanguages.map((lang) => (
              <button key={lang.id} className="lang-card" onClick={() => selectLanguage(lang)}
                aria-label={lang.label + " — press " + lang.key}
                style={{ border: selected === lang.id ? "2px solid #f4a261" : undefined }}>
                <div style={{ fontSize: "2.2rem", marginBottom: "0.6rem" }}>{lang.emoji}</div>
                <div style={{
                  fontSize: "1.4rem", fontWeight: "700", marginBottom: "0.3rem",
                  background: "linear-gradient(135deg, #c4b5fd, #a78bfa)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>{lang.label}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginBottom: "0.4rem" }}>{lang.desc}</div>
                <div className="key-badge">Press {lang.key}</div>
              </button>
            ))}
          </div>

          {/* shortcuts bar */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px", padding: "0.9rem 1.2rem",
            display: "flex", justifyContent: "center", gap: "0.8rem", flexWrap: "wrap"
          }}>
            {instructionLanguages.map(lang => (
              <div key={lang.key} className="shortcut-pill">
                <span className="shortcut-key">{lang.key}</span>
                <span style={{ color: "rgba(255,255,255,0.6)" }}>{lang.label}</span>
              </div>
            ))}
            <div className="shortcut-pill">
              <span className="shortcut-key">R</span>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>Repeat</span>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}

export default InstructionLanguagePage