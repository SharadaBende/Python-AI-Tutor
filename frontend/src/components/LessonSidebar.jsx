
import { useState } from "react"

const ACCENT = "#f4a261"
const ACCENT_SOFT = "rgba(244, 162, 97, 0.15)"
const CREAM_MUTED = "rgba(241, 237, 228, 0.6)"

function LessonSidebar({ lessons, currentLesson, setCurrentLesson, setStep, cardBg, cardBorder, mutedColor, speak, theme }) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ width: open ? "240px" : "48px", transition: "width 0.3s", overflow: "hidden", flexShrink: 0 }}>

      <button
        id="sidebar-toggle"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Sidebar बंद करें (B)" : "Sidebar खोलें (B)"}
        style={{
          width: "100%", padding: "0.55rem 0.75rem", borderRadius: "12px", marginBottom: "8px",
          background: "transparent", border: `1px solid ${ACCENT_SOFT}`,
          color: ACCENT, cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem",
          display: "flex", alignItems: "center", justifyContent: open ? "space-between" : "center",
          transition: "background 0.15s"
        }}
        onMouseEnter={e => e.currentTarget.style.background = ACCENT_SOFT}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        {open && <span>📚 Lessons</span>}
        <span>{open ? "◀" : "▶"}</span>
      </button>

      {open && (
        <div style={{
          background: cardBg,
          border: "1px solid " + cardBorder,
          borderRadius: "12px",
          overflow: "hidden"
        }}>
          <p style={{
            color: ACCENT, fontSize: "0.78rem", fontWeight: "700",
            letterSpacing: "0.06em", textTransform: "uppercase",
            padding: "0.75rem 1rem", margin: "0",
            borderBottom: "1px solid " + cardBorder
          }}>
            सभी Lessons
          </p>

          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {lessons.map((lesson, index) => {
              const isActive = index === currentLesson
              const isDone = index < currentLesson

              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setCurrentLesson(index)
                    setStep("ready")
                    speak("Lesson " + lesson.id + " पर जा रहे हैं। L दबाएं सुनने के लिए।")
                  }}
                  aria-label={"Lesson " + lesson.id + ": " + lesson.title}
                  style={{
                    width: "100%", padding: "0.65rem 1rem", textAlign: "left",
                    border: "none", borderBottom: "1px solid " + cardBorder,
                    cursor: "pointer", fontSize: "0.82rem",
                    display: "flex", alignItems: "center", gap: "10px",
                    background: isActive ? ACCENT_SOFT : "transparent",
                    color: isActive ? ACCENT : isDone ? mutedColor : (theme === "dark" ? CREAM_MUTED : "rgba(20, 20, 20, 0.55)"),
                    fontWeight: isActive ? "bold" : "normal",
                    transition: "background 0.12s"
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = ACCENT_SOFT }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}
                >
                  <span style={{ width: "18px", flexShrink: 0, fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isDone
                      ? <span style={{ color: "#22c55e" }}>✓</span>
                      : isActive
                      ? <span style={{ color: ACCENT }}>▶</span>
                      : <span style={{ width: "7px", height: "7px", borderRadius: "50%", border: `1.5px solid ${cardBorder}`, display: "inline-block" }} />
                    }
                  </span>
                  <span>{lesson.id}. {lesson.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default LessonSidebar