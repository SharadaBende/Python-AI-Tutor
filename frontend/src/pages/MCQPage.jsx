import Navbar from "../components/Navbar"
import { useTheme } from "../components/useTheme"
import { useState, useEffect } from "react"
import ProgressBar from "../components/ProgressBar"
import { useNavigate, useLocation } from "react-router-dom"
import { speak as speakUtil } from "../components/speak"

const questions = [
  { id: 1, question: "Python किसने बनाया?", options: ["Bill Gates", "Guido van Rossum", "Steve Jobs", "Elon Musk"], answer: 1 },
  { id: 2, question: "Python कब बना?", options: ["1980", "1995", "1991", "2000"], answer: 2 },
  { id: 3, question: "Screen पर text दिखाने के लिए कौन सा function use होता है?", options: ["input()", "show()", "print()", "display()"], answer: 2 },
  { id: 4, question: "Variable क्या होता है?", options: ["एक number", "data रखने का box", "एक function", "एक error"], answer: 1 },
  { id: 5, question: "naam = 'Sharada' में naam क्या है?", options: ["function", "variable", "number", "error"], answer: 1 },
  { id: 6, question: "User से input लेने के लिए कौन सा function use होता है?", options: ["print()", "scan()", "input()", "read()"], answer: 2 },
  { id: 7, question: "पूरी संख्या जैसे 5, 10 किस data type में आती है?", options: ["float", "string", "bool", "int"], answer: 3 },
  { id: 8, question: "True या False किस data type में आता है?", options: ["int", "float", "bool", "string"], answer: 2 },
  { id: 9, question: "If/Else किसलिए use होता है?", options: ["Loop के लिए", "Condition check के लिए", "Function बनाने के लिए", "Input लेने के लिए"], answer: 1 },
  { id: 10, question: "For loop में range(1, 5) कितनी बार चलेगा?", options: ["5 बार", "4 बार", "3 बार", "6 बार"], answer: 1 },
  { id: 11, question: "While loop कब तक चलता है?", options: ["एक बार", "पाँच बार", "जब तक condition सही हो", "कभी नहीं"], answer: 2 },
  { id: 12, question: "List किसमें लिखी जाती है?", options: ["() brackets", "{} brackets", "[] brackets", "<> brackets"], answer: 2 },
  { id: 13, question: "Function बनाने के लिए कौन सा keyword use होता है?", options: ["func", "define", "def", "function"], answer: 2 },
  { id: 14, question: "string को uppercase करने के लिए क्या use होता है?", options: [".lower()", ".upper()", ".title()", ".big()"], answer: 1 },
  { id: 15, question: "शेषफल निकालने के लिए कौन सा operator use होता है?", options: ["/", "*", "%", "//"], answer: 2 },
  { id: 16, question: "Comment लिखने के लिए कौन सा symbol use होता है?", options: ["//", "/*", "#", "--"], answer: 2 },
  { id: 17, question: "Error handle करने के लिए क्या use होता है?", options: ["if/else", "try/except", "for/while", "def/return"], answer: 1 },
  { id: 18, question: "list की length निकालने के लिए क्या use होता है?", options: ["size()", "count()", "length()", "len()"], answer: 3 },
  { id: 19, question: "3.14 किस data type में आता है?", options: ["int", "string", "float", "bool"], answer: 2 },
  { id: 20, question: "दो strings जोड़ने के लिए कौन सा operator use होता है?", options: ["*", "-", "+", "/"], answer: 2 },
]

function MCQPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || "दोस्त"
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [step, setStep] = useState("intro")
  const [status, setStatus] = useState("")
  const [lastMessage, setLastMessage] = useState("")
  const [listening, setListening] = useState(false)
 const { theme, toggleTheme, bg, cardBg, cardBorder, mutedColor, textColor } = useTheme()

  function speak(text, onEnd) {
    speakUtil(text, onEnd, setLastMessage)
  }

  useEffect(() => {
    setTimeout(() => {
      speak(
        "शाबाश " + name + "! अब MCQ practice का समय है। 20 questions हैं। " +
        "Q दबाएं question सुनने के लिए। " +
        "1, 2, 3, 4 दबाएं जवाब देने के लिए। " +
        "R दबाएं दोबारा सुनने के लिए। " +
        "Q दबाएं और शुरू करें।"
      )
      setStatus("Q = Question सुनें | 1,2,3,4 = जवाब | R = दोबारा")
      setStep("ready")
    }, 1000)
  }, [])

  function playQuestion() {
    const q = questions[current]
    let text = "Question " + q.id + ". " + q.question + ". "
    q.options.forEach((opt, i) => { text += (i + 1) + ". " + opt + ". " })
    text += "1, 2, 3, या 4 दबाएं जवाब देने के लिए।"
    speak(text)
    setStep("playing")
    setSelected(null)
    setStatus("सुनिए... 1, 2, 3, 4 = जवाब चुनें")
  }

  function selectAnswer(index) {
    if (step !== "playing") {
      speak("पहले Q दबाएं question सुनने के लिए")
      return
    }
    setSelected(index)
    const q = questions[current]
    const isCorrect = index === q.answer
    if (isCorrect) {
      setScore((prev) => prev + 1)
      speak("बहुत अच्छा! सही जवाब है। N दबाएं अगले question के लिए।")
      setStatus("✅ सही जवाब! N = अगला question")
    } else {
      speak("गलत जवाब। सही जवाब था: " + q.options[q.answer] + ". N दबाएं अगले question के लिए।")
      setStatus("❌ गलत! सही: " + q.options[q.answer] + " | N = अगला")
    }
    setStep("answered")
  }

  function nextQuestion() {
    if (step !== "answered") {
      speak("पहले जवाब दीजिए। 1, 2, 3, या 4 दबाएं।")
      return
    }
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1)
      setStep("ready")
      setSelected(null)
      speak("अगला question तैयार है। Q दबाएं सुनने के लिए।")
      setStatus("Q = Question सुनें")
    } else {
        localStorage.setItem("mcq_done", "true")
      setStep("done")
      const finalScore = score + (selected === questions[current].answer ? 1 : 0)
      speak(
        "बहुत शाबाश " + name + "! आपने सभी 20 questions पूरे किए। " +
        "20 में से " + finalScore + " सही जवाब दिए। " +
        "N दबाएं Code Agent पर जाने के लिए।"
      )
      setStatus("🎉 Quiz पूरा! Score: " + finalScore + "/20 | N = Code Agent")
    }
  }

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = "hi-IN"
    recognition.start()
    setListening(true)
    setStatus("सुन रही हूँ...")
    recognition.onresult = (e) => {
      const answer = e.results[0][0].transcript.toLowerCase()
      setListening(false)
      if (answer.includes("एक") || answer.includes("1")) selectAnswer(0)
      else if (answer.includes("दो") || answer.includes("2")) selectAnswer(1)
      else if (answer.includes("तीन") || answer.includes("3")) selectAnswer(2)
      else if (answer.includes("चार") || answer.includes("4")) selectAnswer(3)
      else speak("कृपया एक, दो, तीन, या चार बोलिए")
    }
    recognition.onerror = () => {
      setListening(false)
      setStatus("सुनाई नहीं दिया")
    }
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.target.tagName === "INPUT") return
      const key = e.key.toLowerCase()
      if (key === "q") playQuestion()
      if (key === "1") selectAnswer(0)
      if (key === "2") selectAnswer(1)
      if (key === "3") selectAnswer(2)
      if (key === "4") selectAnswer(3)
      if (key === "r") speak(lastMessage)
      if (key === "t") startListening()
      if (key === "n" && step === "done") navigate("/agent", { state: { name } })
      if (key === "n" && step !== "done") nextQuestion()
     if (key === "1") navigate("/lessons", { state: { name } })
     if (key === "2") navigate("/mcq", { state: { name } })
     if (key === "3") navigate("/agent", { state: { name } })
     if (key === "m") toggleTheme()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [current, step, lastMessage, score, selected])

  const q = questions[current]
  const progress = Math.round((current / questions.length) * 100)

  return (
    <main aria-label="MCQ Practice पृष्ठ" style={{
      minHeight: "100vh",
      background: bg,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "1rem"
    }}>
      <div style={{ width: "100%", maxWidth: "800px" }}>
     <Navbar name={name} theme={theme} toggleTheme={toggleTheme} />
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ color: "#a0a0ff", fontSize: "1.8rem", margin: "0" }}>🧠 MCQ Practice</h1>
         <p style={{ color: mutedColor, margin: "0.3rem 0 0" }}>नमस्ते {name}!</p> 
        </div>

        <ProgressBar
  lessons={localStorage.getItem("lessons_done") === "true"}
  mcq={localStorage.getItem("mcq_done") === "true"}
  agent={localStorage.getItem("agent_visited") === "true"}
  theme={theme}
/>

        <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "0.8rem 1rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ color: "#aaa", fontSize: "0.85rem" }}>Progress</span>
            <span style={{ color: "#a0a0ff", fontSize: "0.85rem" }}>{current}/{questions.length} questions</span>
          </div>
          <div style={{ background: "#2a2a4e", borderRadius: "8px", height: "8px" }}>
            <div style={{ background: "#22c55e", width: progress + "%", height: "8px", borderRadius: "8px", transition: "width 0.5s" }} />
          </div>
        </div>

        <div aria-live="polite" style={{
          background: cardBg, border: "1px solid " + cardBorder,
          padding: "1.5rem", borderRadius: "16px", marginBottom: "1rem"
        }}>
          <p style={{ color: "#888", fontSize: "0.85rem", margin: "0 0 0.5rem" }}>Question {q.id} of {questions.length}</p>
          <p style={{ color: textColor, fontSize: "1.1rem", fontWeight: "500", marginBottom: "1.2rem" }}>{q.question}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => selectAnswer(i)}
                aria-label={(i + 1) + ". " + opt}
                style={{
                  padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid",
                  textAlign: "left", cursor: "pointer", fontSize: "1rem",
                  background: selected === i ? (i === q.answer ? "#14532d" : "#450a0a") : cardBg,
                  borderColor: selected === i ? (i === q.answer ? "#22c55e" : "#ef4444") : "#2a2a5e",
                  color: selected === i ? (i === q.answer ? "#22c55e" : "#ef4444") : "#ccc",
                  transition: "all 0.2s"
                }}>
                <span style={{ fontWeight: "bold", marginRight: "0.5rem", color: "#a0a0ff" }}>{i + 1}.</span>
                {opt}
              </button>
            ))}
          </div>
          {status !== "" && (
            <p aria-live="assertive" style={{
              marginTop: "1rem", color: "#f4a261", fontSize: "0.9rem",
              background: "#2a1a0e", padding: "0.5rem 1rem", borderRadius: "8px"
            }}>{status}</p>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.8rem", marginBottom: "1.5rem" }}>
          <button onClick={playQuestion} aria-label="Q — Question सुनें"
            style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: "#f4a261", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            🔊 सुनें<br /><span style={{ fontSize: "0.75rem" }}>(Q)</span>
          </button>
          <button onClick={() => speak(lastMessage)} aria-label="R — दोबारा सुनें"
            style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: "#4a4af4", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            🔁 दोबारा<br /><span style={{ fontSize: "0.75rem" }}>(R)</span>
          </button>
          <button onClick={startListening} disabled={listening} aria-label="T — आवाज़ से जवाब दें"
            style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: listening ? "#333" : "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            {listening ? "🎙️ सुन रही हूँ" : "🎤 बोलें"}<br /><span style={{ fontSize: "0.75rem" }}>(T)</span>
          </button>
          <button onClick={step === "done" ? () => navigate("/agent", { state: { name } }) : nextQuestion}
            aria-label="N — अगला question"
            style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: "#22c55e", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            {step === "done" ? "✅ Agent" : "अगला →"}<br /><span style={{ fontSize: "0.75rem" }}>(N)</span>
          </button>
        </div>

        <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "1rem" }}>
          <p style={{ color: "#666", fontSize: "0.85rem", margin: "0 0 0.5rem", textAlign: "center" }}>Keyboard Shortcuts</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
            {[["Q", "Question सुनें"], ["1-4", "जवाब चुनें"], ["R", "दोबारा सुनें"], ["T", "आवाज़ से जवाब"], ["N", "अगला question"]].map(([key, desc]) => (
              <div key={key} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={{ background: "#2a2a5e", color: "#a0a0ff", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "bold", fontSize: "0.9rem" }}>{key}</span>
                <span style={{ color: "#aaa", fontSize: "0.85rem" }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}

export default MCQPage