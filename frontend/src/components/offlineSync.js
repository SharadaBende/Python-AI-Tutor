// offlineSync.js
//
// Small helper so that progress updates (lesson index, MCQ score, etc.)
// are never silently lost when the network is flaky or offline — which
// matters a lot on the 2G/3G connections many learners are on.
//
// How it works:
//   - postProgressUpdate() tries the normal fetch first.
//   - If it fails (offline, timeout, server error), the payload is saved
//     to localStorage under a queue key instead of being dropped.
//   - flushQueuedUpdates() is called whenever the browser comes back
//     online, and retries everything in the queue in order.
//   - Multiple updates for the same (user_id, language) collapse into
//     the most recent one, so we don't replay stale progress on top of
//     newer progress after reconnecting.

const QUEUE_KEY = "drishti_offline_progress_queue"
const API_BASE = "http://127.0.0.1:8000"

function readQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeQueue(queue) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  } catch {
    // localStorage full or unavailable — nothing more we can do locally
  }
}

// Collapse the queue so only the latest update per (user_id, language)
// survives, since each update carries the full current progress state.
function enqueue(payload) {
  const queue = readQueue()
  const key = `${payload.user_id}:${payload.language || ""}`
  const filtered = queue.filter(item => `${item.user_id}:${item.language || ""}` !== key)
  filtered.push(payload)
  writeQueue(filtered)
}

export function queuedUpdateCount() {
  return readQueue().length
}

// Attempts to send a progress update immediately. On any failure
// (offline, server down, timeout) the update is queued instead of lost.
// Returns true if it sent successfully, false if it was queued.
export async function postProgressUpdate(payload) {
  if (!payload.user_id) return true // nothing to sync for guest sessions

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    enqueue(payload)
    return false
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)
    const res = await fetch(`${API_BASE}/progress/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) throw new Error("bad response")
    return true
  } catch {
    enqueue(payload)
    return false
  }
}

// Retries everything currently queued. Called on reconnect. Leaves any
// items that still fail (e.g. still offline) back in the queue.
export async function flushQueuedUpdates() {
  const queue = readQueue()
  if (queue.length === 0) return
  const stillFailed = []
  for (const payload of queue) {
    try {
      const res = await fetch(`${API_BASE}/progress/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("bad response")
    } catch {
      stillFailed.push(payload)
    }
  }
  writeQueue(stillFailed)
}

// Sets up automatic flushing whenever the browser regains connectivity.
// Call this once near the top of the app (e.g. in Navbar, since it's on
// every page) — safe to call multiple times, listeners are cheap.
export function setupAutoFlush() {
  if (typeof window === "undefined") return
  window.addEventListener("online", () => {
    flushQueuedUpdates()
  })
}