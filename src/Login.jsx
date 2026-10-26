import { useState } from 'react'
import { sb } from './supabase'
import bg from './assets/images/SAU.jpg'
import skyline from './assets/images/monuments-skyline-trimmed.png'
import './Login.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    const u = username.trim().toLowerCase()
    if (!u || !password) {
      setError('Username and password are required.')
      return
    }
    setLoading(true)
    const { error: err } = await sb.auth.signInWithPassword({
      email: u.includes('@') ? u : u + '@mess.local',
      password,
    })
    if (err) {
      setError('Username or password is incorrect.')
      setLoading(false)
    }
  }

  return (
    <div className="lg-page" style={{ '--bg-image': `url(${bg})` }}>
      <div className="lg-stack">
        <div className="lg-banner">
          <img src="/logo.png" alt="South Asian University" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          <div className="lg-banner-text">
            <b>SAU <span>MESS</span></b>
            <small>Admin Portal</small>
          </div>
        </div>

        <div className="lg-card">
          <h2 className="lg-title">Login</h2>
          <form onSubmit={submit}>
            <div className="lg-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="lg-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="lg-submit" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className="lg-error">{error}</p>}
          </form>
          <p className="lg-hint">Use your mess admin username to login.</p>
        </div>
      </div>

      <div className="lg-skyline" style={{ '--skyline-mask': `url(${skyline})` }} />
    </div>
  )
}