import { useState, useEffect } from "react"

export function useTheme() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  )
  const [fontSize, setFontSize] = useState(
    parseInt(localStorage.getItem("fontSize") || "16")
  )
  const [speed, setSpeed] = useState(
    parseFloat(localStorage.getItem("speed") || "0.85")
  )

  useEffect(() => {
  localStorage.setItem("theme", theme)
}, [theme])

useEffect(() => {
  localStorage.setItem("fontSize", fontSize)
}, [fontSize])

useEffect(() => {
  localStorage.setItem("speed", speed)
}, [speed])
  function toggleTheme() {
    setTheme((prev) => prev === "dark" ? "light" : "dark")
  }

  const bg = theme === "dark"
    ? "linear-gradient(135deg, #0f0f1a, #1a1a3e)"
    : "linear-gradient(135deg, #f0f0ff, #e0e0ff)"

  const textColor = theme === "dark" ? "#fff" : "#111"
  const cardBg = theme === "dark" ? "#1a1a2e" : "#fff"
  const cardBorder = theme === "dark" ? "#2a2a5e" : "#c0c0ff"
  const mutedColor = theme === "dark" ? "#888" : "#666"
  const codeBg = theme === "dark" ? "#0f0f1a" : "#f5f5ff"

  return { theme, toggleTheme, bg, textColor, cardBg, cardBorder, mutedColor, codeBg, fontSize, setFontSize, speed, setSpeed }
}