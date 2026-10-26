import { useEffect, useState } from 'react'
import { sb } from './supabase'

const fmtDate = (s) =>
  s ? new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'

export default function Result({ r, onNext }) {
  const [url, setUrl] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let alive = true
    if (r.photo_file) {
      sb.storage.from('photos').createSignedUrl(r.photo_file, 60).then(({ data }) => {
        if (alive && data && data.signedUrl) setUrl(data.signedUrl)
      })
    }
    return () => { alive = false }
  }, [r])

  let body

  if (r.result === 'ERR') {
    body = (
      <>
        <div className="sc-big">ERROR</div>
        <div className="sc-line">{r.message}</div>
      </>
    )
  } else if (r.result === 'NOT_FOUND') {
    body = (
      <>
        <div className="sc-big">INVALID CARD</div>
        <div className="sc-line">Ye card system mein nahi hai</div>
      </>
    )
  } else {
    const allowed = r.result === 'PAID' || r.result === 'GRACE'
    let title = r.result
    if (r.result === 'PAID') title = '\u2713 PAID'
    if (r.result === 'GRACE') title = '\u23f3 GRACE PERIOD'
    if (r.result === 'DUE') title = '\u2717 DUE'
    if (r.result === 'BLOCKED') title = '\u26d4 CARD BLOCKED'
    if (allowed && r.already_scanned) title = '\u26a0 ALREADY SCANNED'

    body = (
      <>
        <div className="sc-big">{title}</div>
        <div className="sc-meal">{(r.meal || '').toUpperCase()}</div>
        {r.result === 'GRACE' && (
          <div className="sc-line">Renewal pending. Grace till <b>{fmtDate(r.grace_until)}</b></div>
        )}
        {allowed && r.already_scanned && (
          <div className="sc-line">
            <b>Pehle scan: {new Date(r.prev_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</b>
          </div>
        )}
        <img
          className={'sc-photo' + (loaded ? ' loaded' : '')}
          src={url || undefined}
          onLoad={() => setLoaded(true)}
          alt=""
        />
        <div className="sc-name">{r.name}</div>
        <div className="sc-line">Roll: {r.roll_no} &nbsp;|&nbsp; Card: {r.mess_card_no}</div>
        <div className="sc-line">Paid upto: <b>{fmtDate(r.paid_upto)}</b></div>
        {Number(r.due_amount) > 0 && <div className="sc-due">Due: {'\u20b9'}{r.due_amount}</div>}
      </>
    )
  }

  const cls = r.result === 'PAID' && r.already_scanned ? 'DUPE'
    : r.result === 'GRACE' && r.already_scanned ? 'DUPE' : r.result

  return (
    <div className={'sc-ov ' + cls}>
      {body}
      <button className="sc-next" onClick={onNext}>NEXT SCAN</button>
    </div>
  )
}