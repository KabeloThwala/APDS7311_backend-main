import React, { createContext, useContext, useMemo, useState } from 'react'
import api from '../utils/axiosClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async (accountNumber, password) => {
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/auth/login', { accountNumber, password })
      setUser(data.user)
      setToken(data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      return { ok: true }
    } catch (e) {
      setError(e?.response?.data?.message || 'Login failed')
      return { ok: false }
    } finally { setLoading(false) }
  }

  const signup = async (payload) => {
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/auth/signup', payload)
      return { ok: true, data }
    } catch (e) {
      setError(e?.response?.data?.message || 'Signup failed')
      return { ok: false }
    } finally { setLoading(false) }
  }

  const logout = () => {
    setUser(null); setToken('')
    localStorage.removeItem('user'); localStorage.removeItem('token')
  }

  const value = useMemo(() => ({ user, token, login, signup, logout, loading, error }),
    [user, token, loading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
