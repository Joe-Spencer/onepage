/* eslint-disable no-restricted-globals */

// Multi-stream synthetic generator
type Msg = { type: 'config'; streamIds: number[] } | { type: 'start' } | { type: 'stop' }

// Simple seeded RNG (mulberry32) for deterministic per-stream params
function mulberry32(seed: number) {
  let t = seed >>> 0
  return function () {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

type Params = {
  base: number
  amp1: number
  amp2: number
  freq1: number
  freq2: number
  phase1: number
  phase2: number
  drift: number
  noiseBase: number
  noiseAmp: number
  noiseFreq: number
}

let running = false
let time = 0
let ids: number[] = [0, 1, 2]
const params = new Map<number, Params>()

function ensureParams(id: number) {
  if (params.has(id)) return params.get(id)!
  const rnd = mulberry32(id * 2654435761)
  const p: Params = {
    base: 80 + rnd() * 60,
    amp1: 20 + rnd() * 40,
    amp2: 10 + rnd() * 30,
    freq1: 0.5 + rnd() * 1.2,
    freq2: 0.2 + rnd() * 0.8,
    phase1: rnd() * Math.PI * 2,
    phase2: rnd() * Math.PI * 2,
    drift: 6 + rnd() * 10, // slow drift amplitude
    noiseBase: 1 + rnd() * 4,
    noiseAmp: 1 + rnd() * 6,
    noiseFreq: 0.05 + rnd() * 0.25,
  }
  params.set(id, p)
  return p
}

function noise() {
  // Approximate gaussian from two uniforms
  return (Math.random() - 0.5) + (Math.random() - 0.5)
}

function tick() {
  if (!running) return
  time += 0.5 // faster progression
  const payload = ids.map((id) => {
    const p = ensureParams(id)
    const val =
      p.base +
      p.amp1 * Math.sin(time * p.freq1 + p.phase1) +
      p.amp2 * Math.sin(time * p.freq2 + p.phase2) +
      p.drift * Math.sin(time * 0.05 + id) +
      (p.noiseBase + p.noiseAmp * Math.sin(time * p.noiseFreq)) * noise()
    return { id, t: time, value: val }
  })
  ;(postMessage as any)({ type: 'batch', data: payload })
  setTimeout(tick, 100)
}

onmessage = (e: MessageEvent<Msg>) => {
  const msg = e.data
  if (msg.type === 'config') {
    ids = msg.streamIds
    for (const id of ids) ensureParams(id)
  } else if (msg.type === 'start') {
    if (!running) {
      running = true
      tick()
    }
  } else if (msg.type === 'stop') {
    running = false
  }
}


