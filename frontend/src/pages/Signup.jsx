import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const initialForm = {
  fullName: 'Customer One',
  idNumber: '9001015009087',
  accountNumber: '10000010',
  password: 'Password@123'
}

export default function Signup() {
  const { signup, loading, error } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const navigate = useNavigate()

  const helpers = useMemo(() => ({
    fullName: 'Use your legal full name as displayed on your bank statements.',
    idNumber: 'Enter your 13-digit South African ID number.',
    accountNumber: 'Provide an 8–12 digit account number to link your profile.',
    password: 'Use at least 8 characters with upper, lower, number and symbol.'
  }), [])

  const validate = (values = form) => {
    const nextErrors = {}
    if (!values.fullName || values.fullName.trim().length < 3) {
      nextErrors.fullName = 'Please enter your full name (at least 3 characters).'
    }
    if (!/^\d{13}$/.test(values.idNumber || '')) {
      nextErrors.idNumber = 'Your South African ID must contain 13 digits.'
    }
    if (!/^\d{8,12}$/.test(values.accountNumber || '')) {
      nextErrors.accountNumber = 'Account number should contain 8 to 12 digits.'
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}/.test(values.password || '')) {
      nextErrors.password = 'Password must include upper/lower case letters, a number and a symbol.'
    }
    return nextErrors
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const validation = validate()
    setFormErrors(validation)
    if (Object.keys(validation).length > 0) {
      return
    }

    const { ok } = await signup(form)
    if (ok) navigate('/login')
  }

  const updateField = (field) => (event) => {
    const value = event.target.value
    setForm(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleBlur = (field) => {
    const validation = validate()
    setFormErrors(prev => ({ ...prev, [field]: validation[field] }))
  }

  return (
    <div className="flex w-full justify-center">
      <div className="glass-card relative w-full max-w-4xl p-10">
        <div className="absolute -top-6 right-6 h-32 w-32 rounded-full bg-emerald-400/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-10 left-12 h-36 w-36 rounded-full bg-sky-500/20 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 space-y-8">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-200">Create account</p>
            <h1 className="text-3xl font-black text-white sm:text-4xl">Open your customer workspace</h1>
            <p className="text-sm text-slate-300">Modern tools to track payments, manage compliance and collaborate securely.</p>
          </div>

          <form className="space-y-8" onSubmit={onSubmit} noValidate>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="glass-label">Full name</label>
                <input
                  id="fullName"
                  name="fullName"
                  className={`glass-input ${formErrors.fullName ? 'border-rose-400/60 focus:ring-rose-400/50' : ''}`}
                  value={form.fullName}
                  onChange={updateField('fullName')}
                  onBlur={() => handleBlur('fullName')}
                  placeholder="Customer One"
                  autoComplete="name"
                />
                <p className="text-xs text-slate-400">{helpers.fullName}</p>
                {formErrors.fullName && <p className="text-sm text-rose-300">{formErrors.fullName}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="idNumber" className="glass-label">South African ID</label>
                <input
                  id="idNumber"
                  name="idNumber"
                  className={`glass-input ${formErrors.idNumber ? 'border-rose-400/60 focus:ring-rose-400/50' : ''}`}
                  value={form.idNumber}
                  onChange={updateField('idNumber')}
                  onBlur={() => handleBlur('idNumber')}
                  placeholder="9001015009087"
                  inputMode="numeric"
                  autoComplete="off"
                />
                <p className="text-xs text-slate-400">{helpers.idNumber}</p>
                {formErrors.idNumber && <p className="text-sm text-rose-300">{formErrors.idNumber}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="accountNumber" className="glass-label">Account number</label>
                <input
                  id="accountNumber"
                  name="accountNumber"
                  className={`glass-input ${formErrors.accountNumber ? 'border-rose-400/60 focus:ring-rose-400/50' : ''}`}
                  value={form.accountNumber}
                  onChange={updateField('accountNumber')}
                  onBlur={() => handleBlur('accountNumber')}
                  placeholder="10000010"
                  inputMode="numeric"
                  autoComplete="off"
                />
                <p className="text-xs text-slate-400">{helpers.accountNumber}</p>
                {formErrors.accountNumber && <p className="text-sm text-rose-300">{formErrors.accountNumber}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="glass-label">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className={`glass-input ${formErrors.password ? 'border-rose-400/60 focus:ring-rose-400/50' : ''}`}
                  value={form.password}
                  onChange={updateField('password')}
                  onBlur={() => handleBlur('password')}
                  placeholder="SecureP@ss123"
                  autoComplete="new-password"
                />
                <p className="text-xs text-slate-400">{helpers.password}</p>
                {formErrors.password && <p className="text-sm text-rose-300">{formErrors.password}</p>}
              </div>
            </div>

            {error && <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button className="primary-button w-full sm:w-auto" type="submit" disabled={loading}>
                {loading ? 'Creating account…' : 'Create account'}
              </button>
              <span className="text-sm text-slate-300">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-emerald-200 hover:text-emerald-100">
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
