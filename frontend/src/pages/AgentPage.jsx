
import { t } from "../components/translations"
import { useState, useEffect } from "react"
import ProgressBar from "../components/ProgressBar"
import { useLocation, useNavigate } from "react-router-dom"
import { speak as speakUtil } from "../components/speak"
import Navbar from "../components/Navbar"
import { useTheme } from "../components/useTheme"

const ACCENT       = "#f4a261"
const ACCENT_SOFT  = "rgba(244, 162, 97, 0.15)"
const ACCENT_DIM   = "rgba(244, 162, 97, 0.25)"
const GREEN        = "#22c55e"
const GREEN_SOFT   = "rgba(34, 197, 94, 0.15)"

function AgentPage() {
  const location = useLocation()
  const name = location.state?.name || "दोस्त"
  const instructionLang = location.state?.instructionLang || "hindi"
  const language = location.state?.language || "python"
  const lang = t[instructionLang]
  const userId = location.state?.user_id
  const [progress, setProgress] = useState({ lessons_done: false, mcq_done: false, agent_visited: false, mcq_score: 0 })
  const [command, setCommand] = useState("")
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [status, setStatus] = useState("")
  const [lastMessage, setLastMessage] = useState("")
  const { theme, toggleTheme, bg, textColor, cardBg, cardBorder, mutedColor, codeBg, fontSize, setFontSize, speed, setSpeed } = useTheme()
  const navigate = useNavigate()

  function speak(text, onEnd) {
    window.speechSynthesis.cancel()
    setLastMessage(text)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang.voiceLang
    utterance.rate = parseFloat(localStorage.getItem("speed") || "0.85")
    utterance.pitch = 1.0
    utterance.volume = 1

    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      let preferred = null
      if (lang.voiceLang === "en-US") {
        preferred = voices.find(v => v.name === "Microsoft Zira - English (United States)")
      } else if (lang.voiceLang === "hi-IN") {
        preferred = voices.find(v => v.name === "Google हिन्दी")
      }
      if (!preferred) preferred = voices.find(v => v.lang === lang.voiceLang)
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
  if (!userId) return
  fetch(`http://127.0.0.1:8000/progress/${userId}`)
    .then(res => res.json())
    .then(data => setProgress(data))
    .catch(() => {})
}, [userId])

  useEffect(() => {
    setTimeout(() => {
      speak(
        lang.agentWelcome(name) + " " +
        lang.pressT + " " +
        lang.pressC + " " +
        lang.pressR + " " +
        lang.pressF
      )
      setStatus(lang.pressT + " | " + lang.pressC + " | " + lang.pressR + " | " + lang.pressF)
    }, 1000)
  }, [])

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      speak("Voice support नहीं है, कृपया type करें")
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = lang.voiceLang
    recognition.start()
    setListening(true)
    setStatus("सुन रही हूँ... command बोलिए")
    speak("सुन रही हूँ, command बोलिए")
    recognition.onresult = (e) => {
      const spokenCommand = e.results[0][0].transcript
      setCommand(spokenCommand)
      setListening(false)
      setStatus("Command मिली: " + spokenCommand + " — C दबाएं code बनाने के लिए")
      speak("Command मिली। C दबाएं code बनाने के लिए।")
    }
    recognition.onerror = () => {
      setListening(false)
      setStatus("सुनाई नहीं दिया, दोबारा T दबाएं")
    }
  }

  async function generateCode() {
    if (!command.trim()) {
      speak("पहले command दीजिए। T दबाएं बोलने के लिए।")
      setStatus("पहले command दीजिए")
      return
    }
    setLoading(true)
    setCode("")
    setOutput("")
    setStatus("Code बन रहा है...")
    speak("ठीक है, code बना रही हूँ")

    try {
      const res = await fetch("http://127.0.0.1:8000/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      })
      const data = await res.json()
      setCode(data.code)
      setOutput(data.output)
      setLoading(false)
      setProgress(prev => ({ ...prev, agent_visited: true }))
if (userId) {
  fetch("http://127.0.0.1:8000/progress/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, agent_visited: true }),
  }).catch(() => {})
}
      setStatus("Code तैयार है! R दबाएं सुनने के लिए।")
      speak(
        "Code तैयार है। " +
        "Output है: " + (data.output || "कोई output नहीं") +
        " R दबाएं दोबारा सुनने के लिए।"
      )
    } catch {
      setLoading(false)
      setStatus("Error आई, दोबारा C दबाएं")
      speak("कुछ गलत हुआ, दोबारा कोशिश करें")
    }
  }

  useEffect(() => {
    function handleKey(e) {
      const key = e.key.toLowerCase()
      if (key === "t") startListening()
      if (key === "c") generateCode()
      if (key === "r") speak(lastMessage)
      if (key === "m") toggleTheme()
      if (key === "1") navigate("/lessons", { state: { name, language, instructionLang, user_id: userId } })
if (key === "2") navigate("/mcq", { state: { name, language, instructionLang, user_id: userId } })
if (key === "3") navigate("/agent", { state: { name, language, instructionLang, user_id: userId } })
if (key === "f") navigate("/certificate", { state: { name, score: progress.mcq_score, instructionLang, user_id: userId } })
}
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [command, lastMessage, progress, userId])

  return (
    <main aria-label="Code Agent पृष्ठ" style={{
      minHeight: "100vh",
      background: bg,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "1rem", fontSize: fontSize + "px"
    }}>
      <div style={{ width: "100%", maxWidth: "1100px" }}>
        <Navbar
  name={name} theme={theme} toggleTheme={toggleTheme}
  fontSize={fontSize} setFontSize={setFontSize}
  speed={speed} setSpeed={setSpeed}
  language={language} instructionLang={instructionLang}
  userId={userId}
/>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", alignItems: "start" }}>
          <div>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h1 style={{ color: ACCENT, fontSize: "1.8rem", margin: "0", fontWeight: "700" }}>
                Code Agent
              </h1>
              <p style={{ color: mutedColor, margin: "0.3rem 0 0" }}>
                नमस्ते {name}! मुझे कोई भी program बनाने को कहें
              </p>
            </div>

            <ProgressBar
  lessons={progress.lessons_done}
  mcq={progress.mcq_done}
  agent={progress.agent_visited}
  theme={theme}
/>

            {/* Command input card */}
            <div
              aria-live="polite"
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                padding: "1.5rem",
                borderRadius: "16px",
                marginBottom: "1rem"
              }}
            >
              <label
                htmlFor="commandInput"
                style={{ color: mutedColor, fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}
              >
                {lang.commandPrompt}
              </label>
              <input
                id="commandInput"
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generateCode()}
                placeholder={lang.commandPlaceholder}
                aria-label="Python command लिखें"
                style={{
                  width: "100%", padding: "1rem", fontSize: "1rem", borderRadius: "12px",
                  border: `2px solid ${ACCENT_DIM}`,
                  background: codeBg, color: textColor,
                  outline: "none", boxSizing: "border-box", marginBottom: "0.5rem",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.currentTarget.style.borderColor = ACCENT}
                onBlur={e => e.currentTarget.style.borderColor = ACCENT_DIM}
              />
              {status !== "" && (
                <p
                  aria-live="assertive"
                  style={{
                    color: ACCENT, fontSize: "0.9rem",
                    background: "rgba(244, 162, 97, 0.08)",
                    border: `1px solid ${ACCENT_DIM}`,
                    padding: "0.5rem 1rem", borderRadius: "8px", margin: "0"
                  }}
                >
                  {status}
                </p>
              )}
            </div>

            {/* Code + output card */}
            {code !== "" && (
              <div style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                borderRadius: "16px", padding: "1.5rem", marginBottom: "1rem"
              }}>
                <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0 0 0.5rem" }}>Generated Code:</p>
                <pre style={{
                  color: GREEN, margin: "0 0 1rem", fontSize: "0.95rem",
                  fontFamily: "monospace", whiteSpace: "pre-wrap",
                  background: codeBg, padding: "1rem", borderRadius: "8px"
                }}>
                  {code}
                </pre>
                {output !== "" && (
                  <>
                    <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0 0 0.5rem" }}>Output:</p>
                    <pre style={{
                      color: ACCENT, margin: "0", fontSize: "0.95rem",
                      fontFamily: "monospace", whiteSpace: "pre-wrap",
                      background: codeBg, padding: "1rem", borderRadius: "8px"
                    }}>
                      {output}
                    </pre>
                  </>
                )}
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div style={{
                textAlign: "center", padding: "1rem",
                color: ACCENT, fontSize: "0.95rem"
              }}>
                ⏳ Code बन रहा है...
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.8rem" }}>

              {/* T — Listen */}
              <button
                onClick={startListening}
                disabled={listening}
                aria-label="T — आवाज़ से command बोलें"
                style={{
                  padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px",
                  background: listening ? "rgba(255,255,255,0.06)" : ACCENT_SOFT,
                  color: listening ? mutedColor : ACCENT,
                  border: `1px solid ${listening ? cardBorder : ACCENT_DIM}`,
                  cursor: listening ? "not-allowed" : "pointer", fontWeight: "bold",
                  transition: "background 0.15s"
                }}
              >
                {listening ? "🎙️ सुन रही हूँ" : "🎤 बोलें"}<br />
                <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>(T)</span>
              </button>

              {/* C — Generate */}
              <button
                onClick={generateCode}
                disabled={loading}
                aria-label="C — Code बनाएं"
                style={{
                  padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px",
                  background: loading ? "rgba(255,255,255,0.06)" : GREEN_SOFT,
                  color: loading ? mutedColor : GREEN,
                  border: `1px solid ${loading ? cardBorder : "rgba(34,197,94,0.3)"}`,
                  cursor: loading ? "not-allowed" : "pointer", fontWeight: "bold",
                  transition: "background 0.15s"
                }}
              >
                {loading ? "⏳ बन रहा है" : "⚡ Code बनाएं"}<br />
                <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>(C)</span>
              </button>

              {/* R — Repeat */}
              <button
                onClick={() => speak(lastMessage)}
                aria-label="R — दोबारा सुनें"
                style={{
                  padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px",
                  background: ACCENT, color: "#0d0d0d",
                  border: "none", cursor: "pointer", fontWeight: "bold"
                }}
              >
                🔁 दोबारा<br />
                <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>(R)</span>
              </button>

              {/* F — Certificate */}
              <button
                onClick={() => navigate("/certificate", {
  state: { name, score: progress.mcq_score, instructionLang, user_id: userId }
})}
                aria-label="F — Certificate लें"
                style={{
                  padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px",
                  background: ACCENT_SOFT, color: ACCENT,
                  border: `1px solid ${ACCENT_DIM}`,
                  cursor: "pointer", fontWeight: "bold",
                  transition: "background 0.15s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(244,162,97,0.25)"}
                onMouseLeave={e => e.currentTarget.style.background = ACCENT_SOFT}
              >
                🏆 Certificate<br />
                <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>(F)</span>
              </button>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AgentPage