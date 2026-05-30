import { useState } from "react"


function LessonSidebar({ lessons, currentLesson, setCurrentLesson, setStep, theme, cardBg, cardBorder, mutedColor, speak }) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ width: open ? "260px" : "48px", transition: "width 0.3s", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)}
        aria-label={open ? "Sidebar बंद करें (B)" : "Sidebar खोलें (B)"}
        style={{
          width: "100%", padding: "0.6rem", borderRadius: "8px", marginBottom: "0.5rem",
          background: "#a0a0ff", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem"
        }}>
        {open ? "◀ बंद करें (B)" : "▶"}
      </button>

      {open && (
        <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "12px", overflow: "hidden" }}>
          <p style={{ color: "#a0a0ff", fontSize: "0.85rem", fontWeight: "bold", padding: "0.8rem 1rem", margin: "0", borderBottom: "1px solid " + cardBorder }}>
            📚 सभी Lessons
          </p>
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {lessons.map((lesson, index) => (
              <button key={lesson.id}
                onClick={() => {
                  setCurrentLesson(index)
                  setStep("ready")
                  speak("Lesson " + lesson.id + " पर जा रहे हैं। L दबाएं सुनने के लिए।")
                }}
                aria-label={"Lesson " + lesson.id + ": " + lesson.title}
                style={{
                  width: "100%", padding: "0.7rem 1rem", textAlign: "left",
                  border: "none", borderBottom: "1px solid " + cardBorder,
                  cursor: "pointer", fontSize: "0.85rem",
                  background: index === currentLesson
                    ? "#a0a0ff"
                    : index < currentLesson
                    ? (theme === "dark" ? "#1a2e1a" : "#e8ffe8")
                    : cardBg,
                  color: index === currentLesson ? "#000" : mutedColor,
                  fontWeight: index === currentLesson ? "bold" : "normal"
                }}>
                <span style={{ marginRight: "0.5rem" }}>
                  {index < currentLesson ? "✅" : index === currentLesson ? "▶" : "○"}
                </span>
                {lesson.id}. {lesson.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LessonSidebar