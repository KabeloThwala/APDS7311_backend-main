import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Signup() {
  const { signup, loading, error } = useAuth()
  const [fullName, setFullName] = useState('Customer One')
  const [idNumber, setIdNumber] = useState('9001015009087')
  const [accountNumber, setAccountNumber] = useState('10000010')
  const [password, setPassword] = useState('Password@123')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    const { ok } = await signup({ fullName, idNumber, accountNumber, password })
    if (ok) navigate('/login')
  }

  return (
    <div className="authbox card">
      <h2 style={{marginTop:0}}>Create customer account</h2>
      <form onSubmit={onSubmit}>
        <div className="grid cols-2">
          <div className="form-row">
            <label>Full name</label>
            <input value={fullName} onChange={(e)=>setFullName(e.target.value)} required />
          </div>
          <div className="form-row">
            <label>South African ID (13 digits)</label>
            <input value={idNumber} onChange={(e)=>setIdNumber(e.target.value)} required />
          </div>
          <div className="form-row">
            <label>Account number (8–12 digits)</label>
            <input value={accountNumber} onChange={(e)=>setAccountNumber(e.target.value)} required />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
        </div>
        {error && <div style={{color:'#ef476f', marginBottom:10}}>{error}</div>}
        <button className="primary" disabled={loading}>{loading ? 'Please wait…' : 'Sign up'}</button>
      </form>
      <div style={{marginTop:12}}>
        <small className="muted">Already have an account? </small>
        <Link to="/login">Login</Link>
      </div>
    </div>
  )
}
