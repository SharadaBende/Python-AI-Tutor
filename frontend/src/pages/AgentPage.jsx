import { t } from "../components/translations"
import { useState, useEffect } from "react"
import ProgressBar from "../components/ProgressBar"
import { useLocation, useNavigate } from "react-router-dom"
import { speak as speakUtil } from "../components/speak"
import Navbar from "../components/Navbar"
import { useTheme } from "../components/useTheme"

function AgentPage() {
  const location = useLocation()
  const name = location.state?.name || "दोस्त"
  const instructionLang = location.state?.instructionLang || "hindi"
  const language = location.state?.language || "python"
  const lang = t[instructionLang]
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
      if (!preferred) {
        preferred = voices.find(v => v.lang === lang.voiceLang)
      }
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
    localStorage.setItem("agent_visited", "true")
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
      if (key === "1") navigate("/lessons", { state: { name, language, instructionLang } })
      if (key === "2") navigate("/mcq", { state: { name, language, instructionLang } })
      if (key === "3") navigate("/agent", { state: { name, language, instructionLang } })
      if (key === "f") navigate("/certificate", { state: { name, score: parseInt(localStorage.getItem("mcq_score") || "0"), instructionLang } })
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [command, lastMessage])

 return (
    <main aria-label="Code Agent पृष्ठ" style={{
      minHeight: "100vh",
      background: bg,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "1rem", fontSize: fontSize + "px"
    }}>
      <div style={{ width: "100%", maxWidth: "1100px" }}>
        <Navbar name={name} theme={theme} toggleTheme={toggleTheme} fontSize={fontSize} setFontSize={setFontSize} speed={speed} setSpeed={setSpeed} language={language} instructionLang={instructionLang} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", alignItems: "start" }}>

          <div>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h1 style={{ color: "#a0a0ff", fontSize: "1.8rem", margin: "0" }}>🤖 Code Agent</h1>
              <p style={{ color: mutedColor, margin: "0.3rem 0 0" }}>नमस्ते {name}! मुझे कोई भी program बनाने को कहें</p>
            </div>

            <div aria-live="polite" style={{ background: cardBg, border: "1px solid " + cardBorder, padding: "1.5rem", borderRadius: "16px", marginBottom: "1rem" }}>
              <label htmlFor="commandInput" style={{ color: mutedColor, fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>
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
                  border: "2px solid " + cardBorder, background: codeBg, color: textColor,
                  outline: "none", boxSizing: "border-box", marginBottom: "0.5rem"
                }}
              />
              {status !== "" && (
                <p aria-live="assertive" style={{ color: "#f4a261", fontSize: "0.9rem", background: "#2a1a0e", padding: "0.5rem 1rem", borderRadius: "8px", margin: "0" }}>{status}</p>
              )}
            </div>

            {code !== "" && (
              <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "16px", padding: "1.5rem", marginBottom: "1rem" }}>
                <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0 0 0.5rem" }}>Generated Code:</p>
                <pre style={{ color: "#22c55e", margin: "0 0 1rem", fontSize: "0.95rem", fontFamily: "monospace", whiteSpace: "pre-wrap", background: codeBg, padding: "1rem", borderRadius: "8px" }}>
                  {code}
                </pre>
                {output !== "" && (
                  <>
                    <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0 0 0.5rem" }}>Output:</p>
                    <pre style={{ color: "#f4a261", margin: "0", fontSize: "0.95rem", fontFamily: "monospace", whiteSpace: "pre-wrap", background: codeBg, padding: "1rem", borderRadius: "8px" }}>
                      {output}
                    </pre>
                  </>
                )}
              </div>
            )}

            {loading && (
              <div style={{ textAlign: "center", padding: "1rem", color: "#a0a0ff" }}>
                ⏳ Code बन रहा है...
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.8rem" }}>
              <button onClick={startListening} disabled={listening} aria-label="T — आवाज़ से command बोलें"
                style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: listening ? "#333" : "#4a4af4", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                {listening ? "🎙️ सुन रही हूँ" : "🎤 बोलें"}<br /><span style={{ fontSize: "0.75rem" }}>(T)</span>
              </button>
              <button onClick={generateCode} disabled={loading} aria-label="C — Code बनाएं"
                style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: loading ? "#333" : "#22c55e", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                {loading ? "⏳ बन रहा है" : "⚡ Code बनाएं"}<br /><span style={{ fontSize: "0.75rem" }}>(C)</span>
              </button>
              <button onClick={() => speak(lastMessage)} aria-label="R — दोबारा सुनें"
                style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: "#f4a261", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                🔁 दोबारा<br /><span style={{ fontSize: "0.75rem" }}>(R)</span>
              </button>
              <button onClick={() => navigate("/certificate", { state: { name, score: parseInt(localStorage.getItem("mcq_score") || "0"), instructionLang } })}
  aria-label="F — Certificate लें"
  style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: "#a0a0ff", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold" }}>
  🏆 Certificate<br /><span style={{ fontSize: "0.75rem" }}>(F)</span>
</button>
            </div>
          </div>

          <div>
            <ProgressBar
              lessons={localStorage.getItem("lessons_done") === "true"}
              mcq={localStorage.getItem("mcq_done") === "true"}
              agent={localStorage.getItem("agent_visited") === "true"}
              theme={theme}
            />
            <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "1rem" }}>
              <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0 0 0.5rem", textAlign: "center" }}>Keyboard Shortcuts</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {[["T", "Command बोलें"], ["C", "Code बनाएं"], ["R", "दोबारा सुनें"], ["M", "Theme बदलें"], ["1", "Lessons page"], ["2", "MCQ page"], ["3", "Agent page"]].map(([key, desc]) => (
                  <div key={key} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <span style={{ background: "#2a2a5e", color: "#a0a0ff", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "bold", fontSize: "0.9rem", minWidth: "28px", textAlign: "center" }}>{key}</span>
                    <span style={{ color: mutedColor, fontSize: "0.85rem" }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}

export default AgentPage