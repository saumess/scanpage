let ctx = null

export function unlock() {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
  } catch (e) {}
}

export function beep(ok) {
  try {
    unlock()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.connect(g)
    g.connect(ctx.destination)
    o.frequency.value = ok ? 880 : 220
    g.gain.value = 0.15
    o.start()
    o.stop(ctx.currentTime + (ok ? 0.15 : 0.4))
  } catch (e) {}
}

export function buzz(ok) {
  if (navigator.vibrate) navigator.vibrate(ok ? 80 : [200, 100, 200])
}