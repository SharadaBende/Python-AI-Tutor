import { t } from "../components/translations"
import { useState, useEffect } from "react"
import ProgressBar from "../components/ProgressBar"
import { useLocation, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useTheme } from "../components/useTheme"

/* ── Pyra SVG mascot ─────────────────────────────────────────── */
function PyraMascot({ speaking }) {
  return (
    <svg
      width="72" height="88" viewBox="0 0 72 88"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <style>{`
        @keyframes antennaBob {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        @keyframes blink {
          0%,90%,100% { transform: scaleY(1); }
          95%          { transform: scaleY(0.08); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        .pyra-body  { animation: float 3s ease-in-out infinite; }
        .pyra-eye   { animation: blink 3.5s ease-in-out infinite; transform-origin: center; }
        .pyra-ant   { animation: antennaBob 2s ease-in-out infinite; transform-origin: bottom center; }
      `}</style>

      {/* Antenna */}
      <g className="pyra-ant">
        <line x1="36" y1="10" x2="36" y2="22" stroke="#1cb0f6" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="36" cy="8" r="4" fill="#1cb0f6"/>
        {speaking && <circle cx="36" cy="8" r="7" fill="#1cb0f6" opacity="0.25"/>}
      </g>

      {/* Body group */}
      <g className="pyra-body">
        {/* Head */}
        <rect x="14" y="20" width="44" height="36" rx="12" fill="#1cb0f6"/>
        {/* Face plate */}
        <rect x="19" y="26" width="34" height="24" rx="8" fill="white" opacity="0.15"/>
        {/* Eyes */}
        <g className="pyra-eye">
          <rect x="22" y="32" width="10" height="10" rx="3" fill="white"/>
          <circle cx="27" cy="37" r="3.5" fill="#0b5394"/>
          <circle cx="28.5" cy="35.5" r="1" fill="white"/>
        </g>
        <g className="pyra-eye" style={{ animationDelay: "0.15s" }}>
          <rect x="40" y="32" width="10" height="10" rx="3" fill="white"/>
          <circle cx="45" cy="37" r="3.5" fill="#0b5394"/>
          <circle cx="46.5" cy="35.5" r="1" fill="white"/>
        </g>
        {/* Mouth */}
        {speaking
          ? <ellipse cx="36" cy="49" rx="6" ry="3" fill="white" opacity="0.9"/>
          : <rect x="29" y="47" width="14" height="3" rx="1.5" fill="white" opacity="0.7"/>
        }

        {/* Neck */}
        <rect x="30" y="56" width="12" height="6" rx="3" fill="#1cb0f6"/>

        {/* Body */}
        <rect x="18" y="62" width="36" height="22" rx="10" fill="#1cb0f6"/>
        {/* Chest light */}
        <circle cx="36" cy="73" r="5" fill="white" opacity="0.2"/>
        <circle cx="36" cy="73" r="3" fill={speaking ? "#58cc02" : "white"} opacity="0.8"/>

        {/* Arms */}
        <rect x="6"  y="64" width="12" height="6" rx="3" fill="#1cb0f6"/>
        <rect x="54" y="64" width="12" height="6" rx="3" fill="#1cb0f6"/>
      </g>
    </svg>
  )
}

/* ── Bouncing dots loader ─────────────────────────────────────── */
function BouncingDots({ color }) {
  return (
    <span aria-hidden="true" style={{ display: "inline-flex", gap: "4px", alignItems: "center" }}>
      <style>{`
        @keyframes bounce {
          0%,80%,100% { transform: translateY(0); }
          40%          { transform: translateY(-6px); }
        }
      `}</style>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: color,
          display: "inline-block",
          animation: `bounce 1.1s ease-in-out ${i * 0.18}s infinite`
        }}/>
      ))}
    </span>
  )
}

/* ── 3D press button ─────────────────────────────────────────── */
function PressButton({ onClick, disabled, ariaLabel, bg, shadow, color, children }) {
  const [pressed, setPressed] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        padding: "0.9rem 0.4rem",
        fontSize: "0.9rem",
        borderRadius: "12px",
        background: disabled ? "#e5e5e5" : bg,
        color: disabled ? "#aaa" : color,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: "700",
        boxShadow: (disabled || pressed) ? "none" : `0 4px 0 0 ${shadow}`,
        transform: (disabled || pressed) ? "translateY(4px)" : "translateY(0)",
        transition: "transform 0.08s, box-shadow 0.08s",
        lineHeight: 1.4,
        textAlign: "center",
      }}
    >
      {children}
    </button>
  )
}

/* ── Main page ───────────────────────────────────────────────── */
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
  const [pyraSpeaking, setPyraSpeaking] = useState(false)
  const [codeLines, setCodeLines] = useState([])
  const [readingLine, setReadingLine] = useState(null)
  const theme = useTheme()
  const {
    theme: themeMode, toggleTheme, bg, textColor, cardBg, cardBorder, borderWidth,
    mutedColor, codeBg, accent, accentText, accentSoft, accentShadow,
    success, successShadow, successText,
    danger, gold, goldShadow, goldText,
    fontSize, setFontSize, speed, setSpeed,
  } = theme
  const navigate = useNavigate()

  function speak(text, onEnd) {
    window.speechSynthesis.cancel()
    setLastMessage(text)
    setPyraSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang.voiceLang
    utterance.rate = parseFloat(localStorage.getItem("speed") || "0.85")
    utterance.pitch = 1.0
    utterance.volume = 1

    utterance.onend = () => {
      setPyraSpeaking(false)
      if (onEnd) onEnd()
    }
    utterance.onerror = () => setPyraSpeaking(false)

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

  // Turns one line of generated code into a spoken description instead
  // of reading raw symbols. Falls back to reading the line as-is (with
  // a few punctuation words swapped in) for anything not recognized.
  function describeCodeLine(rawLine) {
    const line = rawLine.trim()
    if (line === "") return instructionLang === "english" ? "empty line" : instructionLang === "marathi" ? "रिकामी ओळ" : "खाली line"

    const say = { en: instructionLang === "english", mr: instructionLang === "marathi" }

    if (line.startsWith("#")) {
      const comment = line.replace(/^#\s*/, "")
      return (say.en ? "Comment: " : say.mr ? "Comment: " : "Comment: ") + comment
    }
    if (/^for\s+\w+\s+in\s+range\(/.test(line)) {
      const match = line.match(/range\(([^)]*)\)/)
      const args = match ? match[1] : ""
      return say.en ? `A for loop repeating over range ${args}`
        : say.mr ? `range ${args} वर एक for loop`
        : `एक for loop, range ${args} पर`
    }
    if (/^for\s+\w+\s+in\s+/.test(line)) {
      return say.en ? "A for loop going through each item in a list"
        : say.mr ? "List मधील प्रत्येक item वर for loop"
        : "एक for loop, list के हर item पर"
    }
    if (/^while\s+/.test(line)) {
      const cond = line.replace(/^while\s+/, "").replace(/:$/, "")
      return say.en ? `A while loop that continues while ${cond}`
        : say.mr ? `जोपर्यंत ${cond} तोपर्यंत चालणारा while loop`
        : `एक while loop, जब तक ${cond}`
    }
    if (/^if\s+/.test(line)) {
      const cond = line.replace(/^if\s+/, "").replace(/:$/, "")
      return say.en ? `If ${cond}` : say.mr ? `जर ${cond}` : `अगर ${cond}`
    }
    if (/^elif\s+/.test(line)) {
      const cond = line.replace(/^elif\s+/, "").replace(/:$/, "")
      return say.en ? `Else if ${cond}` : say.mr ? `नाहीतर जर ${cond}` : `नहीं तो अगर ${cond}`
    }
    if (/^else\s*:/.test(line)) {
      return say.en ? "Otherwise" : say.mr ? "नाहीतर" : "नहीं तो"
    }
    if (/^def\s+\w+\(/.test(line)) {
      const name = line.match(/def\s+(\w+)\(/)?.[1] || ""
      return say.en ? `A function called ${name}` : say.mr ? `${name} नावाचे function` : `${name} नाम का function`
    }
    if (/^return\b/.test(line)) {
      const val = line.replace(/^return\s*/, "")
      return say.en ? `Returns ${val || "nothing"}` : say.mr ? `${val || "काहीही"} return करते` : `${val || "कुछ नहीं"} return करता है`
    }
    if (/^print\(/.test(line)) {
      const inner = line.match(/print\((.*)\)/)?.[1] || ""
      return say.en ? `Prints: ${inner}` : say.mr ? `Print करते: ${inner}` : `Print करता है: ${inner}`
    }
    if (/^import\s+/.test(line)) {
      const mod = line.replace(/^import\s+/, "")
      return say.en ? `Imports the ${mod} module` : say.mr ? `${mod} module import करते` : `${mod} module import करता है`
    }
    if (/^\w+\s*=\s*.+/.test(line) && !line.includes("==")) {
      const [varName, ...rest] = line.split("=")
      const val = rest.join("=").trim()
      return say.en ? `Sets ${varName.trim()} to ${val}` : say.mr ? `${varName.trim()} ला ${val} set करते` : `${varName.trim()} को ${val} set करता है`
    }

    // Fallback: read the raw line, swapping a few symbols for spoken words
    return line
      .replace(/==/g, " equals ")
      .replace(/!=/g, " not equal ")
      .replace(/</g, " less than ")
      .replace(/>/g, " greater than ")
      .replace(/:/g, "")
  }

  function speakLineAtIndex(idx, lines) {
    const total = lines.length
    const description = describeCodeLine(lines[idx])
    const prefix = instructionLang === "english"
      ? `Line ${idx + 1} of ${total}. `
      : instructionLang === "marathi"
      ? `ओळ ${idx + 1} पैकी ${total}. `
      : `Line ${idx + 1} में से ${total}. `
    speak(prefix + description)
    setStatus(prefix + "N = अगली, P = पिछली, R = दोबारा, L = बंद करें")
  }

  function startCodeReadback() {
    if (!code) return
    const lines = code.split("\n")
    setCodeLines(lines)
    setReadingLine(0)
    speakLineAtIndex(0, lines)
  }

  function nextCodeLine() {
    if (readingLine === null) return
    const next = Math.min(readingLine + 1, codeLines.length - 1)
    setReadingLine(next)
    speakLineAtIndex(next, codeLines)
  }

  function prevCodeLine() {
    if (readingLine === null) return
    const prev = Math.max(readingLine - 1, 0)
    setReadingLine(prev)
    speakLineAtIndex(prev, codeLines)
  }

  function stopCodeReadback() {
    setReadingLine(null)
    speak(instructionLang === "english" ? "Stopped reading the code." : instructionLang === "marathi" ? "Code वाचणे थांबवले." : "Code पढ़ना बंद किया।")
  }

 useEffect(() => {
    function handleKey(e) {
      const key = e.key.toLowerCase()

      // Line-by-line code read-back has its own N/P navigation while active.
      if (readingLine !== null) {
        if (key === "n") nextCodeLine()
        if (key === "p") prevCodeLine()
        if (key === "r") speak(lastMessage)
        if (key === "l") stopCodeReadback()
        return
      }

      if (key === "t") startListening()
      if (key === "c") generateCode()
      if (key === "r") speak(lastMessage)
      if (key === "l") startCodeReadback()
      if (key === "m") toggleTheme()
      if (key === "1") navigate("/lessons", { state: { name, language, instructionLang, user_id: userId } })
      if (key === "2") navigate("/mcq", { state: { name, language, instructionLang, user_id: userId } })
      if (key === "3") navigate("/agent", { state: { name, language, instructionLang, user_id: userId } })
      if (key === "f") navigate("/certificate", { state: { name, score: progress.mcq_score, instructionLang, user_id: userId } })
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [command, lastMessage, progress, userId, readingLine, codeLines])
  
  return (
    <main aria-label="Code Agent पृष्ठ" style={{
      minHeight: "100vh",
      background: bg,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "1rem", fontSize: fontSize + "px"
    }}>
      {/* Pulsing mic ring keyframe */}
      <style>{`
        @keyframes micPulse {
          0%   { box-shadow: 0 0 0 0 rgba(28,176,246,0.5), 0 4px 0 0 #0b8fd4; }
          70%  { box-shadow: 0 0 0 14px rgba(28,176,246,0), 0 4px 0 0 #0b8fd4; }
          100% { box-shadow: 0 0 0 0 rgba(28,176,246,0), 0 4px 0 0 #0b8fd4; }
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: "1100px" }}>
      <Navbar
          {...theme}
          name={name}
          language={language}
          instructionLang={instructionLang}
          userId={userId}
          helpText={
            instructionLang === "hindi"
              ? "T = आवाज़ से command बोलें, C = Code बनाएं, R = दोबारा सुनें, L = Code line by line पढ़ें, F = Certificate"
              : instructionLang === "marathi"
              ? "T = आवाजाने command सांगा, C = Code बनवा, R = पुन्हा ऐका, L = Code line by line वाचा, F = Certificate"
              : "T to speak a command, C to generate code, R to repeat, L to read code line by line, F for certificate"
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", alignItems: "start" }}>
          <div>

            {/* ── Pyra greeting card ── */}
            <div style={{
              display: "flex", alignItems: "center", gap: "1.2rem",
              background: cardBg,
              border: `${borderWidth} solid ${cardBorder}`,
              boxShadow: `0 2px 0 0 ${cardBorder}`,
              borderRadius: "20px",
              padding: "1.2rem 1.5rem",
              marginBottom: "1.25rem",
            }}>
              <PyraMascot speaking={pyraSpeaking || listening} />

              <div style={{ flex: 1 }}>
                <p style={{
                  margin: 0,
                  fontWeight: "700",
                  fontSize: "1.05rem",
                  color: textColor,
                }}>
                  नमस्ते {name}! 👋
                </p>
                <p style={{
                  margin: "0.3rem 0 0",
                  color: mutedColor,
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                }}>
                  {listening
                    ? <><BouncingDots color={accent} />{" "}Pyra सुन रही है...</>
                    : loading
                    ? <><BouncingDots color={success} />{" "}Code बन रही है...</>
                    : "मुझे कोई भी program बनाने को कहें — बोलकर या लिखकर।"
                  }
                </p>
              </div>
            </div>

            <ProgressBar
              lessons={progress.lessons_done}
              mcq={progress.mcq_done}
              agent={progress.agent_visited}
              theme={themeMode}
            />

            {/* ── Command input card ── */}
            <div
              style={{
                background: cardBg,
                border: `${borderWidth} solid ${cardBorder}`,
                boxShadow: `0 2px 0 0 ${cardBorder}`,
                padding: "1.5rem",
                borderRadius: "16px",
                marginBottom: "1rem",
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
                  border: `${borderWidth} solid ${cardBorder}`,
                  background: codeBg, color: textColor,
                  outline: "none", boxSizing: "border-box", marginBottom: "0.5rem",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.currentTarget.style.borderColor = accent}
                onBlur={e => e.currentTarget.style.borderColor = cardBorder}
              />
              {status !== "" && (
                <p
                  aria-live={pyraSpeaking ? "off" : "assertive"}
                  style={{
                    color: accent, fontSize: "0.9rem",
                    background: accentSoft,
                    border: `${borderWidth} solid ${cardBorder}`,
                    padding: "0.5rem 1rem", borderRadius: "8px", margin: "0",
                  }}
                >
                  {status}
                </p>
              )}
            </div>

            {/* ── Code + output card ── */}
            {code !== "" && (
              <div style={{
                background: cardBg,
                border: `${borderWidth} solid ${cardBorder}`,
                boxShadow: `0 2px 0 0 ${cardBorder}`,
                borderRadius: "16px", padding: "1.5rem", marginBottom: "1rem",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <p style={{ color: mutedColor, fontSize: "0.85rem", margin: 0 }}>Generated Code:</p>
                  <button
                    onClick={readingLine !== null ? stopCodeReadback : startCodeReadback}
                    aria-label="L — Code line by line पढ़ें"
                    style={{
                      background: readingLine !== null ? accentSoft : accent,
                      color: readingLine !== null ? accent : accentText,
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {readingLine !== null ? "⏹ बंद करें" : "📖 पढ़ें"} <span style={{ opacity: 0.8 }}>(L)</span>
                  </button>
                  
                </div>
                <pre style={{
                  color: successText || success, margin: "0 0 1rem", fontSize: "0.95rem",
                  fontFamily: "monospace", whiteSpace: "pre-wrap",
                  background: codeBg, padding: "1rem", borderRadius: "8px",
                }}>
                  {code.split("\n").map((ln, i) => (
                    <div
                      key={i}
                      style={{
                        background: readingLine === i ? accentSoft : "transparent",
                        borderRadius: "4px",
                        padding: "0 0.25rem",
                      }}
                    >
                      {ln || "\u00A0"}
                    </div>
                  ))}
                </pre>
                {readingLine !== null && (
                  <p style={{ color: mutedColor, fontSize: "0.8rem", margin: "0 0 1rem" }}>
                    N = अगली line, P = पिछली line, R = दोबारा, L = बंद करें
                  </p>
                )}

                {output !== "" && (
                  <>
                    <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0 0 0.5rem" }}>Output:</p>
                    <pre style={{
                      color: accent, margin: "0", fontSize: "0.95rem",
                      fontFamily: "monospace", whiteSpace: "pre-wrap",
                      background: codeBg, padding: "1rem", borderRadius: "8px",
                    }}>
                      {output}
                    </pre>
                  </>
                )}
              </div>
            )}

            {/* ── Action buttons ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.8rem" }}>

              {/* T — Listen (mic) */}
              <button
                onClick={startListening}
                disabled={listening}
                aria-label="T — आवाज़ से command बोलें"
                style={{
                  padding: "0.9rem 0.4rem",
                  fontSize: "0.9rem",
                  borderRadius: "12px",
                  background: listening ? accentSoft : accent,
                  color: listening ? accent : accentText,
                  border: "none",
                  cursor: listening ? "not-allowed" : "pointer",
                  fontWeight: "700",
                  lineHeight: 1.4,
                  textAlign: "center",
                  animation: listening ? "micPulse 1.2s ease-out infinite" : "none",
                  boxShadow: listening ? `0 0 0 0 rgba(28,176,246,0.5), 0 4px 0 0 ${accentShadow || "#0b8fd4"}` : `0 4px 0 0 ${accentShadow || "#0b8fd4"}`,
                  transform: listening ? "translateY(0)" : "translateY(0)",
                  transition: "background 0.15s",
                }}
              >
                {listening ? "🎙️ सुन रही हूँ" : "🎤 बोलें"}<br />
                <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>(T)</span>
              </button>

              {/* C — Generate */}
              <PressButton
                onClick={generateCode}
                disabled={loading}
                ariaLabel="C — Code बनाएं"
                bg={success}
                shadow={successShadow || "#3a9a00"}
                color={successText || "#fff"}
              >
                {loading ? <><BouncingDots color="#fff" /></> : "⚡ Code बनाएं"}<br />
                <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>(C)</span>
              </PressButton>

              {/* R — Repeat */}
              <PressButton
                onClick={() => speak(lastMessage)}
                ariaLabel="R — दोबारा सुनें"
                bg={accent}
                shadow={accentShadow || "#0b8fd4"}
                color={accentText}
              >
                🔁 दोबारा<br />
                <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>(R)</span>
              </PressButton>

              {/* F — Certificate */}
              <PressButton
                onClick={() => navigate("/certificate", {
                  state: { name, score: progress.mcq_score, instructionLang, user_id: userId }
                })}
                ariaLabel="F — Certificate लें"
                bg={gold}
                shadow={goldShadow || "#c49a00"}
                color={goldText || "#fff"}
              >
                🏆 Certificate<br />
                <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>(F)</span>
              </PressButton>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AgentPage