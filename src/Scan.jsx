import { useEffect, useRef, useState } from 'react'
import { sb } from './supabase'
import Scanner from './Scanner'
import Result from './Result'
import { beep, buzz, unlock } from './feedback'
import './scan.css'

export default function Scan({ session }) {
  const [res, setRes] = useState(null)
  const [card, setCard] = useState('')
  const busy = useRef(false)

  async function call(key, byCard) {
    if (busy.current) return
    busy.current = true
    let r
    try {
      const { data, error } = await sb.rpc('scan_card', { p_key: key, p_by_roll: byCard })
      if (error) throw error
      r = data
    } catch (e) {
      r = { result: 'ERR', message: e.message || String(e) }
    }
    const ok = (r.result === 'PAID' || r.result === 'GRACE') && !r.already_scanned
    beep(ok)
    buzz(ok)
    setRes(r)
  }

  const onScan = (text) => call(text.includes('#t=') ? text.split('#t=')[1] : text, false)

  const next = () => {
    setRes(null)
    setTimeout(() => { busy.current = false }, 400)
  }

  useEffect(() => {
    if (location.hash.startsWith('#t=')) {
      const t = location.hash.slice(3)
      history.replaceState(null, '', location.pathname)
      call(t, false)
    }
  }, [])

  const search = (e) => {
    e.preventDefault()
    const c = card.trim()
    if (c) { setCard(''); call(c, true) }
  }

  const logout = () => sb.auth.signOut()

  return (
    <div onClick={unlock}>
      <header className="sc-head">
        <div className="sc-brand">SAU MESS<small>SCAN COUNTER</small></div>
        <div className="sc-right">
          <span className="sc-who">{(session.user.email || '').split('@')[0]}</span>
          <button className="sc-ghost" onClick={logout}>Logout</button>
        </div>
      </header>

      <Scanner onScan={onScan} />
      <div className="sc-hint">QR ko camera ke saamne rakho</div>

      <form className="sc-manual" onSubmit={search}>
        <input
          placeholder="Mess card no (card bhool gaya)"
          value={card}
          onChange={(e) => setCard(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {res && <Result r={res} onNext={next} />}
    </div>
  )
}