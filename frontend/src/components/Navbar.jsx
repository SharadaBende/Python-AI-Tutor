import { useNavigate, useLocation } from "react-router-dom"

function Navbar({
  name, theme, toggleTheme, fontSize, setFontSize, speed, setSpeed,
  language, instructionLang, userId,
  cardBg, cardBorder, borderWidth, textColor, mutedColor,
  accent, accentText, accentSoft,
}) {
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
    padding: "0.32rem 0.6rem",
    fontSize: "0.78rem",
    borderRadius: "9px",
    border: "none",
    background: "transparent",
    color: mutedColor,
    cursor: "pointer",
  }

  return (
    <>
      <style>{`
        .navbtn { transition: transform 0.1s, background 0.15s, color 0.15s; cursor: pointer; }
        .navbtn:active { transform: scale(0.94); }
        @keyframes navFlame {
          0%, 100% { transform: scale(1) rotate(-3deg); }
          50% { transform: scale(1.12) rotate(3deg); }
        }
        .navFlame { display: inline-block; animation: navFlame 1.3s ease-in-out infinite; }
      `}</style>
      <nav
        aria-label="Main navigation"
        style={{
          background: cardBg,
          border: `${borderWidth} solid ${cardBorder}`,
          boxShadow: `0 2px 0 0 ${cardBorder}`,
          borderRadius: "14px",
          padding: "0.55rem 0.85rem",
          marginBottom: "0.9rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        {/* Page links */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {pages.map(({ path, label, key }) => {
            const isActive = location.pathname === path
            return (
              <button
                key={path}
                className="navbtn"
                onClick={() => goTo(path)}
                aria-label={`${label} — ${key} दबाएं`}
                aria-current={isActive ? "page" : undefined}
                style={{
                  padding: "0.4rem 0.85rem",
                  fontSize: "0.8rem",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: isActive ? "700" : "600",
                  background: isActive ? accent : "transparent",
                  color: isActive ? accentText : mutedColor,
                }}
              >
                {label}{" "}
                <span style={{ fontSize: "0.62rem", opacity: 0.7 }}>({key})</span>
              </button>
            )
          })}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>

          {/* Font size */}
          <div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
            <span style={{ color: mutedColor, fontSize: "0.7rem" }}>A</span>
            <button className="navbtn" onClick={decreaseFontSize} aria-label="Font size कम करें" style={controlBtn}>−</button>
            <button className="navbtn" onClick={increaseFontSize} aria-label="Font size बढ़ाएं" style={controlBtn}>+</button>
            <span style={{ color: mutedColor, fontSize: "0.85rem", fontWeight: "600" }}>A</span>
          </div>

          {/* Speech speed */}
          <div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
            <span style={{ color: mutedColor, fontSize: "0.7rem" }}>🔊</span>
            <button className="navbtn" onClick={decreaseSpeed} aria-label="Speed कम करें" style={controlBtn}>−</button>
            <span style={{
              color: accent, fontSize: "0.75rem", fontWeight: "700",
              minWidth: "30px", textAlign: "center"
            }}>{speed}x</span>
            <button className="navbtn" onClick={increaseSpeed} aria-label="Speed बढ़ाएं" style={controlBtn}>+</button>
          </div>

          {/* Theme toggle */}
          <button
            className="navbtn"
            onClick={toggleTheme}
            aria-label={`Theme toggle — M दबाएं. अभी ${theme === "dark" ? "dark" : "light"} mode है`}
            style={{
              ...controlBtn,
              border: `${borderWidth} solid ${cardBorder}`,
              fontWeight: "600",
            }}
          >
            {theme === "dark" ? "☀ Light" : "🌙 Dark"}{" "}
            <span style={{ fontSize: "0.62rem", opacity: 0.7 }}>(M)</span>
          </button>

        </div>
      </nav>
    </>
  )
}

export default Navbar