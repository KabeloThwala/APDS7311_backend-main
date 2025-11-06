import React, { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login, loading, error } = useAuth()
  const [accountNumber, setAccountNumber] = useState('90000002')
  const [password, setPassword] = useState('Password@123')
  const [formErrors, setFormErrors] = useState({})
  const navigate = useNavigate()

  const helpers = useMemo(() => ({
    accountNumber: 'Use your 8-12 digit account number. Demo admin: 90000002',
    password: 'Use your secure banking password. Demo password: Password@123'
  }), [])

  const validate = () => {
    const nextErrors = {}
    if (!/^\d{8,12}$/.test(accountNumber.trim())) {
      nextErrors.accountNumber = 'Account number should contain 8 to 12 digits.'
    }
    if (password.trim().length < 8) {
      nextErrors.password = 'Password must be at least 8 characters long.'
    }
    return nextErrors
  }

  const handleBlur = (field) => {
    const validation = validate()
    setFormErrors(prev => ({ ...prev, [field]: validation[field] }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const validation = validate()
    setFormErrors(validation)
    if (Object.keys(validation).length > 0) {
      return
    }

    const ok = await login(accountNumber.trim(), password)
    if (ok.ok) {
      if (accountNumber === '90000001') navigate('/employee')
      else if (accountNumber === '90000002') navigate('/admin')
      else navigate('/dashboard')
    }
  }

  return (
    <div className="flex w-full justify-center">
      <div className="glass-card relative w-full max-w-xl p-10">
        <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-sky-400/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -left-12 bottom-0 h-28 w-28 rounded-full bg-emerald-400/20 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 space-y-8">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-sky-500 dark:text-cyan-200">Welcome back</p>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">Sign in to your account</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">Access the digital banking workspace with secure, real-time insights.</p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit} noValidate>
            <div className="space-y-1.5">
              <label htmlFor="accountNumber" className="glass-label">Account number</label>
              <input
                id="accountNumber"
                name="accountNumber"
                className={`glass-input ${formErrors.accountNumber ? 'border-rose-400/60 focus:ring-rose-400/50' : ''}`}
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value)
                  if (formErrors.accountNumber) setFormErrors(prev => ({ ...prev, accountNumber: undefined }))
                }}
                onBlur={() => handleBlur('accountNumber')}
                placeholder="90000002"
                autoComplete="username"
                inputMode="numeric"
                aria-describedby="account-helper"
              />
              <p id="account-helper" className="text-xs text-slate-500 dark:text-slate-400">{helpers.accountNumber}</p>
              {formErrors.accountNumber && (
                <p className="text-sm text-rose-500 dark:text-rose-300">{formErrors.accountNumber}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="glass-label">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                className={`glass-input ${formErrors.password ? 'border-rose-400/60 focus:ring-rose-400/50' : ''}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (formErrors.password) setFormErrors(prev => ({ ...prev, password: undefined }))
                }}
                onBlur={() => handleBlur('password')}
                autoComplete="current-password"
                placeholder="••••••••"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">{helpers.password}</p>
              {formErrors.password && (
                <p className="text-sm text-rose-500 dark:text-rose-300">{formErrors.password}</p>
              )}
            </div>

            {error && <div className="rounded-2xl border border-rose-400/40 bg-rose-100/60 px-4 py-3 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-200">{error}</div>}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button className="primary-button w-full sm:w-auto" disabled={loading} type="submit">
                {loading ? 'Please wait…' : 'Sign in'}
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Need a customer account?{' '}
                <Link to="/signup" className="font-semibold text-sky-500 hover:text-sky-400 dark:text-cyan-200 dark:hover:text-cyan-100">
                  Sign up
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
