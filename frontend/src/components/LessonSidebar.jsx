import { useState } from "react"

function LessonSidebar({ lessons, currentLesson, setCurrentLesson, setStep, cardBg, cardBorder, mutedColor, speak, theme }) {
  const [open, setOpen] = useState(true)

  const isDark = theme === "dark"

  // Theme-aware tokens (no hardcoded saffron)
  const accent      = isDark ? "#1cb0f6" : "#1cb0f6"
  const accentSoft  = isDark ? "rgba(28,176,246,0.12)" : "rgba(28,176,246,0.10)"
  const accentShadow = isDark ? "#0a8fd4" : "#0a8fd4"
  const success     = "#58cc02"
  const textColor   = isDark ? "#f1f5f9" : "#1a1a2e"

  return (
    <div style={{ width: open ? "220px" : "48px", transition: "width 0.3s", overflow: "hidden", flexShrink: 0 }}>

      {/* Toggle button — 3D press style */}
      <button
        id="sidebar-toggle"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Sidebar बंद करें (B)" : "Sidebar खोलें (B)"}
        style={{
          width: "100%",
          padding: "0.55rem 0.75rem",
          borderRadius: "12px",
          marginBottom: "8px",
          background: accentSoft,
          border: `1px solid ${isDark ? "rgba(28,176,246,0.25)" : "rgba(28,176,246,0.3)"}`,
          boxShadow: `0 3px 0 0 ${accentShadow}`,
          color: accent,
          cursor: "pointer",
          fontWeight: 700,
          fontSize: "0.85rem",
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          transition: "box-shadow 0.1s, transform 0.1s",
        }}
        onMouseDown={e => {
          e.currentTarget.style.boxShadow = "0 0px 0 0 transparent"
          e.currentTarget.style.transform = "translateY(3px)"
        }}
        onMouseUp={e => {
          e.currentTarget.style.boxShadow = `0 3px 0 0 ${accentShadow}`
          e.currentTarget.style.transform = "translateY(0)"
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = `0 3px 0 0 ${accentShadow}`
          e.currentTarget.style.transform = "translateY(0)"
        }}
      >
        {open && <span>📚 Lessons</span>}
        <span>{open ? "◀" : "▶"}</span>
      </button>

      {open && (
        <div style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          boxShadow: `0 2px 0 0 ${cardBorder}`,
          borderRadius: "12px",
          overflow: "hidden",
        }}>
          {/* Header */}
          <p style={{
            color: accent,
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            padding: "0.7rem 1rem",
            margin: 0,
            borderBottom: `1px solid ${cardBorder}`,
          }}>
            सभी Lessons
          </p>

          {/* Lesson list */}
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {lessons.map((lesson, index) => {
              const isActive = index === currentLesson
              const isDone   = index < currentLesson

              // Solid, contrast-safe colors — no low-opacity text
              const itemColor = isActive
                ? accent
                : isDone
                ? success
                : textColor

              const itemBg = isActive
                ? accentSoft
                : "transparent"

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
                    width: "100%",
                    padding: "0.65rem 1rem",
                    textAlign: "left",
                    border: "none",
                    borderBottom: `1px solid ${cardBorder}`,
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: itemBg,
                    color: itemColor,
                    fontWeight: isActive ? 700 : isDone ? 500 : 400,
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = accentSoft }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}
                >
                  {/* Status icon */}
                  <span style={{
                    width: "18px",
                    flexShrink: 0,
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {isDone ? (
                      <span style={{ color: success, fontWeight: 700 }}>✓</span>
                    ) : isActive ? (
                      <span style={{ color: accent }}>▶</span>
                    ) : (
                      <span style={{
                        width: "7px", height: "7px",
                        borderRadius: "50%",
                        border: `1.5px solid ${mutedColor}`,
                        display: "inline-block",
                      }} />
                    )}
                  </span>

                  <span style={{ lineHeight: 1.35 }}>{lesson.id}. {lesson.title}</span>
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