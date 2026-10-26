import { useEffect, useState } from 'react'
import { sb } from './supabase'
import Login from './Login'
import Scan from './Scan'

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (session === undefined) return null
  return session ? <Scan session={session} /> : <Login />
}