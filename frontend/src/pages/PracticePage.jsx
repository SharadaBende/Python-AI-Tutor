import { t } from "../components/translations"
import Navbar from "../components/Navbar"
import { useTheme } from "../components/useTheme"
import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"

/* ── Pyra mascot (same as MCQPage) ──────────────────────────────── */
function PyraMascot({ mood }) {
  const eyeColor = mood === "correct" ? "#58cc02" : mood === "wrong" ? "#ff4b4b" : "#0b5394"
  const bodyColor = mood === "correct" ? "#58cc02" : mood === "wrong" ? "#ff4b4b" : "#1cb0f6"
  return (
    <svg width="52" height="64" viewBox="0 0 72 88" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <style>{`
        @keyframes antBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes blinkE  { 0%,90%,100%{transform:scaleY(1)} 95%{transform:scaleY(0.08)} }
        @keyframes floatB  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .pant { animation: antBob 2s ease-in-out infinite; transform-origin: bottom center; }
        .peye { animation: blinkE 3.5s ease-in-out infinite; transform-origin: center; }
        .pbody{ animation: floatB 3s ease-in-out infinite; }
      `}</style>
      <g className="pant">
        <line x1="36" y1="10" x2="36" y2="22" stroke={bodyColor} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="36" cy="8" r="4" fill={bodyColor}/>
      </g>
      <g className="pbody">
        <rect x="14" y="20" width="44" height="36" rx="12" fill={bodyColor}/>
        <rect x="19" y="26" width="34" height="24" rx="8" fill="white" opacity="0.15"/>
        <g className="peye"><rect x="22" y="32" width="10" height="10" rx="3" fill="white"/><circle cx="27" cy="37" r="3.5" fill={eyeColor}/></g>
        <g className="peye" style={{animationDelay:"0.15s"}}><rect x="40" y="32" width="10" height="10" rx="3" fill="white"/><circle cx="45" cy="37" r="3.5" fill={eyeColor}/></g>
        {mood === "correct"
          ? <path d="M28 49 Q36 55 44 49" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          : mood === "wrong"
          ? <path d="M28 53 Q36 48 44 53" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          : <rect x="29" y="47" width="14" height="3" rx="1.5" fill="white" opacity="0.7"/>
        }
        <rect x="30" y="56" width="12" height="6" rx="3" fill={bodyColor}/>
        <rect x="18" y="62" width="36" height="22" rx="10" fill={bodyColor}/>
        <circle cx="36" cy="73" r="5" fill="white" opacity="0.2"/>
        <circle cx="36" cy="73" r="3" fill="white" opacity="0.8"/>
        <rect x="6"  y="64" width="12" height="6" rx="3" fill={bodyColor}/>
        <rect x="54" y="64" width="12" height="6" rx="3" fill={bodyColor}/>
      </g>
    </svg>
  )
}

/* ── 3D press button (same as MCQPage) ──────────────────────────── */
function PressButton({ onClick, disabled, ariaLabel, bg, shadow, color, children, style = {} }) {
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
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function PracticePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const mainRef = useRef(null)
  const name = location.state?.name || "दोस्त"
  const instructionLang = location.state?.instructionLang || "hindi"
  const userId = location.state?.user_id

  const lang = t[instructionLang]
  const theme = useTheme()
  const {
    theme: themeMode, toggleTheme, bg, textColor, cardBg, cardBorder, borderWidth,
    mutedColor, codeBg, accent, accentText, accentSoft, accentShadow,
    success, successShadow, successText, successSoft,
    danger, dangerSoft, dangerText,
    fontSize,
  } = theme

  const [dictatedLines, setDictatedLines] = useState([])
  const [pendingLine, setPendingLine] = useState(null)
  const [indentLevel, setIndentLevel] = useState(0)
  const [listening, setListening] = useState(false)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState("")
  const [lastMessage, setLastMessage] = useState("")
  const [mood, setMood] = useState("idle")
  const [pyraSpeaking, setPyraSpeaking] = useState(false)
  const [output, setOutput] = useState("")

  const recognitionRef = useRef(null)
  const transcriptRef = useRef("")
  const interimRef = useRef("")
  const stopRequestedRef = useRef(false)

  function speak(text, onEnd) {
    window.speechSynthesis.cancel()
    setLastMessage(text)
    setPyraSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang.voiceLang
    utterance.rate = parseFloat(localStorage.getItem("speed") || "0.85")
    utterance.pitch = parseFloat(localStorage.getItem("pitch") || "1.0")
    utterance.volume = 1
    const finish = () => { setPyraSpeaking(false); if (onEnd) onEnd() }
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      let preferred = null
      if (lang.voiceLang === "en-US") preferred = voices.find(v => v.name === "Microsoft Zira - English (United States)")
      else if (lang.voiceLang === "hi-IN") preferred = voices.find(v => v.name === "Google हिन्दी")
      if (!preferred) preferred = voices.find(v => v.lang === lang.voiceLang)
      if (preferred) utterance.voice = preferred
      utterance.onend = finish
      utterance.onerror = finish
      window.speechSynthesis.speak(utterance)
    }
    if (window.speechSynthesis.getVoices().length === 0) window.speechSynthesis.onvoiceschanged = trySpeak
    else trySpeak()
  }

  useEffect(() => {
    window.focus()
    if (mainRef.current) mainRef.current.focus()
    const t1 = setTimeout(() => {
      setStatus(lang.practiceDictateMode)
      // Welcome first, then chain the punctuation-convention hint onto the end of it —
      // a first-time student needs this before they try dictating, or "print hello"
      // will hit a real Python SyntaxError with no explanation why.
      speak(lang.practiceWelcome(name) + " " + lang.practiceDictateMode, () => {
        setStatus(lang.practicePunctuationHint)
        speak(lang.practicePunctuationHint)
      })
    }, 800)
    return () => clearTimeout(t1)
  }, [])


  function convertSpokenPunctuation(text) {
    let result = " " + text.toLowerCase() + " "
    const replacements = [
      [/\bopen (paren(t|thesis)?s?|pattern|parren|karen|parrot|paris)\b/g, "("],
      [/\bclose (paren(t|thesis)?s?|pattern|parren|karen|parrot|paris)\b/g, ")"],
      [/\bopen bracket\b/g, "["],
      [/\bclose bracket\b/g, "]"],
      [/\bopen (brace|curly)\b/g, "{"],
      [/\bclose (brace|curly)\b/g, "}"],
      [/\bless than or equal(s)?( to)?\b/g, "<="],
      [/\bgreater than or equal(s)?( to)?\b/g, ">="],
      [/\bnot equal(s)?( to)?\b/g, "!="],
      [/\bless than\b/g, "<"],
      [/\bgreater than\b/g, ">"],
      [/\b(quote|quotes|court|coat|quart|code)\b/g, '"'],
      [/\b(apostrophe|single quote)\b/g, "'"],
      [/\bcolon\b/g, ":"],
      [/\bcomma\b/g, ","],
      [/\bsemicolon\b/g, ";"],
      [/\bequals?\b/g, "="],
      [/\bplus\b/g, "+"],
      [/\bminus\b/g, "-"],
      [/\b(percent|percentage|modulo|mod)\b/g, "%"],
      [/\b(times|multiply|multiplied by|star|asterisk)\b/g, "*"],
      [/\b(divide|divided by|slash)\b/g, "/"],
      [/\bdot\b/g, "."],
      [/\bunderscore\b/g, "_"],
      [/\bexclamation( mark)?\b/g, "!"],
    ]
    replacements.forEach(([pattern, symbol]) => {
      result = result.replace(pattern, symbol)
    })
    // Strip filler words that sit directly next to a comparison/equality
    // symbol once it's already been converted — e.g. "is equal to" only
    // matches the "equal" part above, leaving "is ... = ... to" behind.
    // Safe to strip unconditionally: legitimate Python "is" is never
    // immediately followed by =/</>/!, so this can't eat real code.
    result = result.replace(/\bis\s+(?=[=<>!])/g, "")
    result = result.replace(/(?<=[=<>!]=?)\s+to\b/g, "")
    // Clean up spacing around symbols
    result = result.replace(/\s+([(){}\[\].,:;])/g, "$1").replace(/([(){}\[\]])\s+/g, "$1")
    result = result.replace(/(["'(])\s+/g, "$1").replace(/\s+(["')])/g, "$1")
    return result.trim()
  }

  function toggleListenLine() {
    if (listening) {
      stopRequestedRef.current = true
      recognitionRef.current && recognitionRef.current.stop()
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    transcriptRef.current = ""
    interimRef.current = ""
    stopRequestedRef.current = false
    startRecognitionSession(SpeechRecognition)
    setListening(true)
    setStatus(lang.practiceListeningCommand)
  }

  function startRecognitionSession(SpeechRecognition) {
    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.continuous = true
    recognition.interimResults = true
    recognitionRef.current = recognition

    recognition.onresult = (e) => {
      let finalChunk = ""
      let interimChunk = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalChunk += e.results[i][0].transcript
        else interimChunk += e.results[i][0].transcript
      }
      if (finalChunk) transcriptRef.current += finalChunk + " "
      if (interimChunk) interimRef.current = interimChunk
    }

    recognition.onend = () => {
      // Chrome auto-stops continuous recognition after a few seconds of
      // silence — e.g. a natural pause between words — even though the
      // student hasn't pressed T yet. If the stop wasn't requested by the
      // student, silently start a fresh session and keep accumulating into
      // the same transcript, so their sentence doesn't get cut off.
      if (!stopRequestedRef.current) {
        startRecognitionSession(SpeechRecognition)
        return
      }
      stopRequestedRef.current = false
      setListening(false)
      // If the student pressed T right as they finished talking, Chrome may
      // not have finalized the last words yet — fall back to the live
      // interim transcript rather than losing what was actually heard.
      let rawHeard = transcriptRef.current.trim()
      if (!rawHeard && interimRef.current.trim()) {
        rawHeard = interimRef.current.trim()
      }
      interimRef.current = ""
      const lowerRaw = rawHeard.toLowerCase()
      // Indent/dedent are control commands, not code content — handle them before
      // running punctuation conversion so they never get treated as a code line.
      if (/^(dedent|de dent|outdent|out dent|unindent|un indent)$/.test(lowerRaw)) {
        setIndentLevel(lvl => Math.max(0, lvl - 1))
        speak(lang.practiceDedented)
        setStatus(lang.practiceDedented)
        return
      }
      if (/^(indent|in dent)$/.test(lowerRaw)) {
        setIndentLevel(lvl => lvl + 1)
        speak(lang.practiceIndented)
        setStatus(lang.practiceIndented)
        return
      }
      const heard = convertSpokenPunctuation(rawHeard)
      if (heard) {
        setPendingLine(heard)
        speak(lang.practiceHeardLine(heard))
        setStatus(lang.practiceHeardLine(heard))
      } else {
        setStatus(lang.notHeard)
      }
    }

    recognition.onerror = (e) => {
      // 'no-speech' and 'aborted' are expected/benign here — they fire right
      // before onend during a normal silence-triggered restart or an
      // intentional stop, and onend already handles both cases correctly.
      // Only treat other errors (e.g. mic permission issues) as fatal.
      if (e.error !== "no-speech" && e.error !== "aborted") {
        stopRequestedRef.current = true
        setListening(false)
      }
    }

    recognition.start()
  }

  function confirmLine() {
    if (pendingLine === null) return
    const indented = "    ".repeat(indentLevel) + pendingLine
    setDictatedLines(prev => [...prev, indented])
    // Auto-indent the next line if this one opens a block (if/for/while/def/etc.)
    if (pendingLine.trim().endsWith(":")) {
      setIndentLevel(lvl => lvl + 1)
    }
    setPendingLine(null)
    speak(lang.practiceLineAdded)
    setStatus(lang.practiceLineAdded)
  }

  function rejectLine() {
    setPendingLine(null)
    speak(lang.practiceLineRejected)
    setStatus(lang.practiceLineRejected)
  }

  async function runDictatedCode() {
    if (dictatedLines.length === 0) {
      speak(lang.practiceEmptyBuffer)
      setStatus(lang.practiceEmptyBuffer)
      return
    }
    setBusy(true)
    speak(lang.practiceRunning)
    setStatus(lang.practiceRunning)
    try {
      const code = dictatedLines.join("\n")
      const res = await fetch("http://127.0.0.1:8000/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      setOutput(data.output || "")
      setMood("correct")
      speak(lang.output + " " + (data.output || ""))
      setStatus(lang.output + " " + (data.output || ""))
    } catch (err) {
      setMood("wrong")
      setStatus(lang.notHeard)
    } finally {
      setBusy(false)
    }
  }

  function undoLastLine() {
    if (dictatedLines.length === 0) {
      speak(lang.practiceEmptyBuffer)
      setStatus(lang.practiceEmptyBuffer)
      return
    }
    const removed = dictatedLines[dictatedLines.length - 1]
    setDictatedLines(prev => prev.slice(0, -1))
    // If the removed line opened a block (ended with a colon), roll back the
    // auto-indent bump it caused. This only undoes indentation tied to the
    // deleted line itself — a separate manual "indent"/"dedent" command issued
    // around it is unaffected and can be reversed the same way it was made.
    if (removed.trim().endsWith(":")) {
      setIndentLevel(lvl => Math.max(0, lvl - 1))
    }
    speak(lang.practiceLineRemoved(removed.trim()))
    setStatus(lang.practiceLineRemoved(removed.trim()))
  }

  function clearBuffer() {
    setDictatedLines([])
    setPendingLine(null)
    setOutput("")
    setMood("idle")
    setIndentLevel(0)
    speak(lang.practiceBufferCleared)
    setStatus(lang.practiceBufferCleared)
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return
      const key = e.key.toLowerCase()

      if (pendingLine !== null) {
        if (key === "y") { confirmLine(); return }
        if (key === "n") { rejectLine(); return }
      }

      if (key === "t") toggleListenLine()
      if (key === "p") runDictatedCode()
      if (key === "x") clearBuffer()
      if (key === "r") speak(lastMessage)
      if (key === "m") toggleTheme()
      if (key === "h") { speak(lang.practiceSymbolHelp); setStatus(lang.practiceSymbolHelp) }
      if (key === "u") undoLastLine()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [pendingLine, dictatedLines, output, lastMessage, listening])

  const pageContext = "Practice Mode — " + lang.practiceDictateMode

  return (
    <main ref={mainRef} id="main-content" tabIndex={-1} aria-label="Practice Mode पृष्ठ" style={{
      outline: "none",
      minHeight: "100vh", background: bg,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "1rem", fontSize: fontSize + "px"
    }}>
      <div style={{ width: "100%", maxWidth: "1100px" }}>
        <Navbar
          {...theme}
          name={name}
          language="python"
          instructionLang={instructionLang}
          userId={userId}
          pageContext={pageContext}
        />

        {/* Pyra greeting card */}
        <div style={{
          display: "flex", alignItems: "center", gap: "1rem",
          background: cardBg,
          border: `${borderWidth} solid ${cardBorder}`,
          boxShadow: `0 2px 0 0 ${cardBorder}`,
          borderRadius: "20px",
          padding: "1rem 1.25rem",
          marginBottom: "1rem",
        }}>
          <PyraMascot mood={mood} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: "700", fontSize: "1rem", color: textColor }}>
              Practice Mode — {name}
            </p>
            <p style={{ margin: "0.2rem 0 0", color: mutedColor, fontSize: "0.88rem" }}>
              {lang.practiceDictateMode}
            </p>
          </div>
        </div>

        {/* Content card */}
        <div style={{
          background: cardBg,
          border: `${borderWidth} solid ${cardBorder}`,
          boxShadow: `0 2px 0 0 ${cardBorder}`,
          padding: "1.5rem", borderRadius: "16px", marginBottom: "1rem",
        }}>
          <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0 0 0.5rem" }}>{lang.practiceCodeBuffer}</p>
          <p style={{ color: mutedColor, fontSize: "0.8rem", margin: "0 0 0.5rem" }}>{lang.practiceIndentLabel(indentLevel)}</p>
          <pre style={{ background: codeBg, color: textColor, padding: "0.8rem", borderRadius: "10px", minHeight: "3rem", marginBottom: "0.8rem", whiteSpace: "pre-wrap" }}>
            {dictatedLines.length ? dictatedLines.join("\n") : "—"}
          </pre>

          {pendingLine !== null && (
            <p style={{
              color: accent, background: accentSoft, border: `${borderWidth} solid ${cardBorder}`,
              padding: "0.6rem 1rem", borderRadius: "8px", marginBottom: "0.8rem",
            }}>
              {lang.practiceHeardLine(pendingLine)}
            </p>
          )}

          {output && (
            <>
              <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0 0 0.3rem" }}>{lang.output}</p>
              <pre style={{ background: codeBg, color: textColor, padding: "0.8rem", borderRadius: "10px", overflowX: "auto" }}>{output}</pre>
            </>
          )}

          {status !== "" && (
            <p aria-live={pyraSpeaking ? "off" : "assertive"} style={{
              marginTop: "1rem",
              color: mood === "correct" ? success : mood === "wrong" ? danger : accent,
              fontSize: "0.9rem",
              background: mood === "correct" ? (successSoft || "rgba(88,204,2,0.1)") : mood === "wrong" ? (dangerSoft || "rgba(255,75,75,0.1)") : accentSoft,
              border: `${borderWidth} solid ${cardBorder}`,
              padding: "0.5rem 1rem", borderRadius: "8px",
            }}>
              {status}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.8rem" }}>
          <button
            onClick={toggleListenLine}
            disabled={busy}
            aria-label="T — बोलें"
            style={{
              padding: "0.9rem 0.4rem", fontSize: "0.9rem", borderRadius: "12px",
              background: listening ? accentSoft : accent, color: listening ? accent : accentText,
              border: "none", cursor: busy ? "not-allowed" : "pointer",
              fontWeight: "700", lineHeight: 1.4, textAlign: "center",
              boxShadow: `0 4px 0 0 ${accentShadow || "#0b8fd4"}`,
            }}
          >
            {listening ? "🎙️ रुकने के लिए T" : "🎤 बोलें"}<br /><span style={{ fontSize: "0.75rem", opacity: 0.8 }}>(T)</span>
          </button>

          <PressButton onClick={confirmLine} disabled={pendingLine === null} ariaLabel="Y — Confirm line" bg={success} shadow={successShadow || "#3a9a00"} color={successText || "#fff"}>
            ✅ Confirm<br /><span style={{ fontSize: "0.75rem", opacity: 0.8 }}>(Y)</span>
          </PressButton>

          <PressButton onClick={runDictatedCode} disabled={busy} ariaLabel="P — Run" bg={accentSoft} shadow={accentShadow || "#0b8fd4"} color={accent}>
            ▶️ चलाएं<br /><span style={{ fontSize: "0.75rem", opacity: 0.8 }}>(P)</span>
          </PressButton>

          <PressButton onClick={clearBuffer} ariaLabel="X — Clear" bg={dangerSoft || "#ffe5e5"} shadow="#c94b4b" color={dangerText || "#c94b4b"}>
            🗑️ Clear<br /><span style={{ fontSize: "0.75rem", opacity: 0.8 }}>(X)</span>
          </PressButton>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: "0.7rem" }}>
          <PressButton
            onClick={undoLastLine}
            disabled={dictatedLines.length === 0}
            ariaLabel="U — Undo last line"
            bg={cardBg}
            shadow={cardBorder}
            color={mutedColor}
            style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem" }}
          >
            ↩️ Undo last line <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>(U)</span>
          </PressButton>
        </div>
      </div>
    </main>
  )
}

export default PracticePage