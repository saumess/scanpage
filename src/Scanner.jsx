import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function Scanner({ onScan }) {
  const cb = useRef(onScan)
  cb.current = onScan

  useEffect(() => {
    const s = new Html5Qrcode('reader')
    const started = s
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1 },
        (text) => cb.current(text)
      )
      .catch((e) => alert('Camera error: ' + e))
    return () => { started.then(() => s.stop()).catch(() => {}) }
  }, [])

  return <div id="reader" />
}