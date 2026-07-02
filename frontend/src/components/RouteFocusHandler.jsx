import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

// React Router swaps page content without moving keyboard focus or
// announcing anything to screen readers — a screen reader user who
// clicks "Next" and lands on a new page hears nothing change unless
// something explicitly grabs focus. This component fixes that: on every
// route change, it moves focus to the page's <main id="main-content">
// element, which causes screen readers to announce that element's
// aria-label (e.g. "Lessons page") the same way they would on a real
// page navigation.
//
// It also plays a short, quiet audio cue the instant the route changes,
// before Pyra's own speech starts — TTS can take a noticeable beat to
// begin (voice loading, network latency), so the cue gives an immediate,
// unambiguous signal that a page change happened, rather than a gap of
// silence that could otherwise feel like the app froze.
//
// Mount this once inside <BrowserRouter>, alongside the routes — it
// renders nothing visible.
function RouteFocusHandler() {
  const location = useLocation()
  const audioCtxRef = useRef(null)

  function playPageChangeCue() {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (!AudioContext) return
        audioCtxRef.current = new AudioContext()
      }
      const ctx = audioCtxRef.current
      // Browsers suspend AudioContext until a user gesture has occurred
      // somewhere on the page; resume() is a no-op if already running.
      if (ctx.state === "suspended") ctx.resume()

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.value = 880 // a soft, high, unobtrusive tone
      gain.gain.setValueAtTime(0.001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.2)
    } catch {
      // Audio cues are a nice-to-have; never let a failure here block
      // navigation or focus handling.
    }
  }

  useEffect(() => {
    playPageChangeCue()
    const target = document.getElementById("main-content")
    if (!target) return
    // tabIndex -1 lets a non-interactive element receive programmatic
    // focus without also becoming part of the normal Tab order.
    target.focus()
  }, [location.pathname])

  return null
}

export default RouteFocusHandler