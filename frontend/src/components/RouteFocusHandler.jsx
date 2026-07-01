import { useEffect } from "react"
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
// Mount this once inside <BrowserRouter>, alongside the routes — it
// renders nothing visible.
function RouteFocusHandler() {
  const location = useLocation()

  useEffect(() => {
    const target = document.getElementById("main-content")
    if (!target) return
    // tabIndex -1 lets a non-interactive element receive programmatic
    // focus without also becoming part of the normal Tab order.
    target.focus()
  }, [location.pathname])

  return null
}

export default RouteFocusHandler