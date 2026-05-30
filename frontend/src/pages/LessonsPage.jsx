import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { speak as speakUtil } from "../components/speak"
import ProgressBar from "../components/ProgressBar"
import Navbar from "../components/Navbar"
import { useTheme } from "../components/useTheme"

const lessons = [
  { id: 1, title: "Python क्या है?", content: "Python एक programming language है। इसे 1991 में Guido van Rossum ने बनाया था। Python बहुत आसान है — इसे पढ़ना और लिखना दोनों सरल हैं। Python से हम websites, games, और AI बना सकते हैं।", example: null },
  { id: 2, title: "print() function", content: "print() function screen पर कुछ भी दिखाता है। जो भी हम brackets के अंदर लिखते हैं, वो screen पर आ जाता है।", example: 'print("नमस्ते दुनिया!")' },
  { id: 3, title: "Variables", content: "Variable एक box की तरह है जिसमें हम कोई भी value रख सकते हैं। जैसे एक डिब्बे में चीज़ रखते हैं, वैसे ही variable में data रखते हैं।", example: 'naam = "Sharada"\numar = 20\nprint(naam)' },
  { id: 4, title: "Data Types", content: "Python में अलग-अलग तरह का data होता है। int — पूरी संख्या जैसे 5, 10। float — दशमलव संख्या जैसे 3.14। string — text जैसे नमस्ते। bool — True या False।", example: 'age = 20\nheight = 5.6\nname = "Pyra"\nis_student = True' },
  { id: 5, title: "User से Input लेना", content: "input() function से हम user से कुछ भी पूछ सकते हैं। User जो भी type करे, वो हम variable में रख सकते हैं।", example: 'naam = input("आपका नाम क्या है? ")\nprint("नमस्ते", naam)' },
  { id: 6, title: "If/Else Conditions", content: "If/Else से हम condition check करते हैं। अगर condition सही है तो if वाला code चलता है, नहीं तो else वाला।", example: 'umar = 18\nif umar >= 18:\n    print("आप vote कर सकते हैं")\nelse:\n    print("आप vote नहीं कर सकते")' },
  { id: 7, title: "For Loop", content: "For loop से हम कोई काम बार बार कर सकते हैं। range() function numbers की list बनाता है।", example: "for i in range(1, 6):\n    print(i)" },
  { id: 8, title: "While Loop", content: "While loop तब तक चलता है जब तक condition सही हो। While loop में ध्यान रखें कि loop कभी न कभी बंद हो।", example: "count = 1\nwhile count <= 5:\n    print(count)\n    count = count + 1" },
  { id: 9, title: "Lists", content: "List एक थैले की तरह है जिसमें हम कई चीज़ें रख सकते हैं। List square brackets में लिखी जाती है।", example: 'fruits = ["apple", "banana", "mango"]\nprint(fruits[0])\nprint(len(fruits))' },
  { id: 10, title: "Functions", content: "Function एक छोटा program होता है जो एक काम करता है। def keyword से function बनाते हैं।", example: 'def namaste(naam):\n    print("नमस्ते", naam)\n\nnamaste("Sharada")\nnamaste("Pyra")' },
  { id: 11, title: "String Operations", content: "String यानी text के साथ हम कई operations कर सकते हैं। दो strings जोड़ सकते हैं, बड़े छोटे अक्षर बदल सकते हैं।", example: 'naam = "sharada"\nprint(naam.upper())\nprint(len(naam))\nprint("नमस्ते " + naam)' },
  { id: 12, title: "Math Operations", content: "Python में सभी math operations होते हैं। जोड़ के लिए +, घटाव के लिए -, गुणा के लिए *, भाग के लिए /, शेषफल के लिए %।", example: "a = 10\nb = 3\nprint(a + b)\nprint(a - b)\nprint(a * b)\nprint(a % b)" },
  { id: 13, title: "Comments", content: "Comments वो lines हैं जो Python run नहीं करता। # से single line comment बनाते हैं।", example: "# यह एक calculator है\na = 10\nb = 5\nprint(a + b)" },
  { id: 14, title: "Error Handling", content: "try/except से हम errors को handle करते हैं। अगर code में कोई गलती हो तो program बंद न हो।", example: "try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print('शून्य से भाग नहीं होता!')" },
  { id: 15, title: "Mini Project — Calculator", content: "अब तक जो सीखा उससे एक simple calculator बनाते हैं। यह आपका पहला Python project है!", example: 'def calculator(a, b, op):\n    if op == "+":\n        return a + b\n    elif op == "-":\n        return a - b\n    elif op == "*":\n        return a * b\n\nprint(calculator(10, 5, "+"))\nprint(calculator(10, 5, "*"))' },
]

function LessonsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || "दोस्त"
  const [currentLesson, setCurrentLesson] = useState(0)
  const [step, setStep] = useState("intro")
  const [status, setStatus] = useState("")
  const [lastMessage, setLastMessage] = useState("")
  const [listening, setListening] = useState(false)
  const { theme, toggleTheme, bg, textColor, cardBg, cardBorder, mutedColor, codeBg } = useTheme()

  function speak(text, onEnd) {
    speakUtil(text, onEnd, setLastMessage)
  }

  useEffect(() => {
    setTimeout(() => {
      speak(
        "वाह " + name + "! Lessons page पर आपका स्वागत है। " +
        "L दबाएं lesson सुनने के लिए। " +
        "N दबाएं अगले lesson के लिए। " +
        "R दबाएं दोबारा सुनने के लिए।"
      )
      setStatus("L = Lesson सुनें | N = अगला | R = दोबारा")
      setStep("ready")
    }, 1000)
  }, [])

  async function playLesson() {
    const lesson = lessons[currentLesson]
    speak("Lesson " + lesson.id + " लोड हो रहा है... रुकिए।")
    setStatus("AI lesson तैयार कर रही है...")
    setStep("playing")
    try {
      const res = await fetch("http://127.0.0.1:8000/get-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: lesson.title, student_name: name }),
      })
      const data = await res.json()
      let text = "Lesson " + lesson.id + ". " + lesson.title + ". " + data.lesson
      if (lesson.example) text += " उदाहरण: " + lesson.example
      text += " क्या आप समझ गए? N दबाएं अगले lesson के लिए। R दबाएं दोबारा सुनने के लिए।"
      speak(text)
      setStatus("सुनिए... R = दोबारा | N = अगला lesson")
    } catch {
      speak("Lesson लोड नहीं हुआ, दोबारा L दबाएं")
      setStatus("Error — दोबारा L दबाएं")
      setStep("ready")
    }
  }

  function nextLesson() {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson((prev) => prev + 1)
      setStep("ready")
      speak("बहुत अच्छा! अगला lesson तैयार है। L दबाएं सुनने के लिए।")
      setStatus("L = Lesson सुनें")
    } else {
      localStorage.setItem("lessons_done", "true")
      speak("शाबाश " + name + "! आपने सभी 15 lessons पूरे कर लिए! N दबाएं MCQ practice के लिए।")
      setStep("done")
      setStatus("सभी lessons पूरे! N = MCQ Practice")
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
      if (answer.includes("हाँ") || answer.includes("हां") || answer.includes("ha") || answer.includes("yes")) {
        nextLesson()
      } else {
        speak("ठीक है, दोबारा सुनते हैं।")
        setTimeout(() => playLesson(), 1500)
      }
    }
    recognition.onerror = () => { setListening(false); setStatus("सुनाई नहीं दिया") }
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.target.tagName === "INPUT") return
      const key = e.key.toLowerCase()
      if (key === "l") playLesson()
      if (key === "n" && step === "done") navigate("/mcq", { state: { name } })
      if (key === "n" && step !== "done") nextLesson()
      if (key === "r") speak(lastMessage)
      if (key === "t") startListening()
      if (key === "1") navigate("/lessons", { state: { name } })
      if (key === "2") navigate("/mcq", { state: { name } })
      if (key === "3") navigate("/agent", { state: { name } })
      if (key === "m") toggleTheme()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [currentLesson, step, lastMessage])

  const lesson = lessons[currentLesson]
  const progress = Math.round((currentLesson / lessons.length) * 100)

  return (
    <main aria-label="Lessons पृष्ठ" style={{
      minHeight: "100vh",
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "1rem"
    }}>
      <div style={{ width: "100%", maxWidth: "580px" }}>
        <Navbar name={name} theme={theme} toggleTheme={toggleTheme} />
   
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ color: "#a0a0ff", fontSize: "1.8rem", margin: "0" }}>📚 Lessons</h1>
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
            <span style={{ color: "#aaa", fontSize: "0.85rem" }}>Lesson Progress</span>
            <span style={{ color: "#a0a0ff", fontSize: "0.85rem" }}>{currentLesson}/{lessons.length}</span>
          </div>
          <div style={{ background: "#2a2a4e", borderRadius: "8px", height: "8px" }}>
            <div style={{ background: "#a0a0ff", width: progress + "%", height: "8px", borderRadius: "8px", transition: "width 0.5s" }} />
          </div>
        </div>


         <div aria-live="polite" style={{ background: cardBg, border: "1px solid " + cardBorder, padding: "1.5rem", borderRadius: "16px", marginBottom: "1.5rem" }}>
         <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ background: "#a0a0ff", color: "#000", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.9rem" }}>{lesson.id}</span>
            <h2 style={{ color: "#a0a0ff", margin: "0", fontSize: "1.2rem" }}>{lesson.title}</h2>
          </div>
          <p style={{ color: textColor, lineHeight: "1.7", marginBottom: lesson.example ? "1rem" : "0" }}>
  {lesson.content}</p>
          {lesson.example && (
            
            <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "1rem" }}>
            <p style={{ color: "#888", fontSize: "0.8rem", margin: "0 0 0.5rem" }}>उदाहरण:</p>
              <pre style={{ color: "#22c55e", margin: "0", fontSize: "1rem", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{lesson.example}</pre>
            </div>
          )}
          {status !== "" && (
            <p aria-live="assertive" style={{ marginTop: "1rem", color: "#f4a261", fontSize: "0.9rem", background: "#2a1a0e", padding: "0.5rem 1rem", borderRadius: "8px" }}>{status}</p>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.8rem", marginBottom: "1.5rem" }}>
          <button onClick={playLesson} aria-label="L — Lesson सुनें" style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: "#f4a261", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            🔊 सुनें<br /><span style={{ fontSize: "0.75rem" }}>(L)</span>
          </button>
          <button onClick={() => speak(lastMessage)} aria-label="R — दोबारा सुनें" style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: "#4a4af4", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            🔁 दोबारा<br /><span style={{ fontSize: "0.75rem" }}>(R)</span>
          </button>
          <button onClick={startListening} disabled={listening} aria-label="T — आवाज़ से जवाब दें" style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: listening ? "#333" : "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            {listening ? "🎙️ सुन रही हूँ" : "🎤 बोलें"}<br /><span style={{ fontSize: "0.75rem" }}>(T)</span>
          </button>
          <button onClick={step === "done" ? () => navigate("/mcq", { state: { name } }) : nextLesson} aria-label="N — अगला lesson" style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: "#22c55e", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            {step === "done" ? "✅ MCQ" : "अगला →"}<br /><span style={{ fontSize: "0.75rem" }}>(N)</span>
          </button>
        </div>

        <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "1rem" }}>
          <p style={{ color: "#666", fontSize: "0.85rem", margin: "0 0 0.5rem", textAlign: "center" }}>Keyboard Shortcuts</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
            {[["L", "Lesson सुनें"], ["R", "दोबारा सुनें"], ["T", "आवाज़ से जवाब"], ["N", "अगला lesson"]].map(([key, desc]) => (
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

export default LessonsPage