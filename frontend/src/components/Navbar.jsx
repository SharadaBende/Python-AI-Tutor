import { useNavigate, useLocation } from "react-router-dom"

const ACCENT        = "#f4a261"
const ACCENT_SOFT   = "rgba(244, 162, 97, 0.15)"
const ACCENT_BORDER = "rgba(244, 162, 97, 0.25)"
const NAV_BG        = "rgba(17, 24, 39, 0.95)"
const BTN_BG        = "rgba(255, 255, 255, 0.05)"
const MUTED         = "rgba(241, 237, 228, 0.5)"
const CREAM         = "rgba(241, 237, 228, 0.85)"

function Navbar({ name, theme, toggleTheme, fontSize, setFontSize, speed, setSpeed, language, instructionLang, userId }) {
  const navigate = useNavigate()
  const location = useLocation()

  const pages = [
    { path: "/lessons", label: "Lessons", key: "1" },
    { path: "/mcq",     label: "MCQ",     key: "2" },
    { path: "/agent",   label: "Agent",   key: "3" },
  ]

  function goTo(path) {
  navigate(path, { state: { name, language, instructionLang, user_id: userId } })
}

  function increaseFontSize() {
  setFontSize(Math.min(fontSize + 2, 24))
}

function decreaseFontSize() {
  setFontSize(Math.max(fontSize - 2, 12))
}

function increaseSpeed() {
  setSpeed(Math.min(parseFloat((speed + 0.1).toFixed(1)), 1.5))
}

function decreaseSpeed() {
  setSpeed(Math.max(parseFloat((speed - 0.1).toFixed(1)), 0.5))
}
 

  const controlBtn = {
    padding: "0.28rem 0.55rem",
    fontSize: "0.78rem",
    borderRadius: "7px",
    border: `1px solid ${ACCENT_BORDER}`,
    background: BTN_BG,
    color: CREAM,
    cursor: "pointer",
    transition: "background 0.15s, border-color 0.15s",
  }

  return (
    <nav
      aria-label="Main navigation"
      style={{
        background: NAV_BG,
        border: `1px solid ${ACCENT_BORDER}`,
        borderRadius: "12px",
        padding: "0.45rem 0.75rem",
        marginBottom: "0.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.5rem",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Page links */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {pages.map(({ path, label, key }) => {
          const isActive = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => goTo(path)}
              aria-label={`${label} — ${key} दबाएं`}
              aria-current={isActive ? "page" : undefined}
              style={{
                padding: "0.28rem 0.65rem",
                fontSize: "0.78rem",
                borderRadius: "7px",
                border: `1px solid ${isActive ? ACCENT : ACCENT_BORDER}`,
                cursor: "pointer",
                fontWeight: isActive ? "700" : "500",
                background: isActive ? ACCENT : BTN_BG,
                color: isActive ? "#0d0d0d" : CREAM,
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = ACCENT_SOFT }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = BTN_BG }}
            >
              {label}{" "}
              <span style={{ fontSize: "0.65rem", opacity: 0.6 }}>({key})</span>
            </button>
          )
        })}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>

        {/* Font size */}
        <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
          <span style={{ color: MUTED, fontSize: "0.72rem" }}>A</span>
          <button
            onClick={decreaseFontSize}
            aria-label="Font size कम करें"
            style={controlBtn}
            onMouseEnter={e => e.currentTarget.style.background = ACCENT_SOFT}
            onMouseLeave={e => e.currentTarget.style.background = BTN_BG}
          >−</button>
          <button
            onClick={increaseFontSize}
            aria-label="Font size बढ़ाएं"
            style={controlBtn}
            onMouseEnter={e => e.currentTarget.style.background = ACCENT_SOFT}
            onMouseLeave={e => e.currentTarget.style.background = BTN_BG}
          >+</button>
          <span style={{ color: MUTED, fontSize: "0.88rem", fontWeight: "600" }}>A</span>
        </div>

        {/* Speech speed */}
        <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
          <span style={{ color: MUTED, fontSize: "0.72rem" }}>🔊</span>
          <button
            onClick={decreaseSpeed}
            aria-label="Speed कम करें"
            style={controlBtn}
            onMouseEnter={e => e.currentTarget.style.background = ACCENT_SOFT}
            onMouseLeave={e => e.currentTarget.style.background = BTN_BG}
          >−</button>
          <span style={{
            color: ACCENT, fontSize: "0.75rem", fontWeight: "700",
            minWidth: "30px", textAlign: "center"
          }}>{speed}x</span>
          <button
            onClick={increaseSpeed}
            aria-label="Speed बढ़ाएं"
            style={controlBtn}
            onMouseEnter={e => e.currentTarget.style.background = ACCENT_SOFT}
            onMouseLeave={e => e.currentTarget.style.background = BTN_BG}
          >+</button>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={`Theme toggle — M दबाएं. अभी ${theme === "dark" ? "dark" : "light"} mode है`}
          style={{
            ...controlBtn,
            fontWeight: "600",
            color: MUTED,
          }}
          onMouseEnter={e => e.currentTarget.style.background = ACCENT_SOFT}
          onMouseLeave={e => e.currentTarget.style.background = BTN_BG}
        >
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}{" "}
          <span style={{ fontSize: "0.65rem", opacity: 0.6 }}>(M)</span>
        </button>

      </div>
    </nav>
  )
}

export default Navbar