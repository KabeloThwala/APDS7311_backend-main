import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login, loading, error } = useAuth()
  const [accountNumber, setAccountNumber] = useState('90000002')
  const [password, setPassword] = useState('Password@123')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(accountNumber, password)
    if (ok.ok) {
      if (accountNumber === '90000001') navigate('/employee')
      else if (accountNumber === '90000002') navigate('/admin')
      else navigate('/dashboard')
    }
  }

  return (
    <div className="authbox card">
      <h2 style={{marginTop:0}}>Sign in</h2>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Account Number</label>
          <input value={accountNumber} onChange={(e)=>setAccountNumber(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        {error && <div style={{color:'#ef476f', marginBottom:10}}>{error}</div>}
        <button className="primary" disabled={loading}>{loading ? 'Please wait…' : 'Login'}</button>
      </form>
      <div style={{marginTop:12}}>
        <small className="muted">Need a customer account? </small>
        <Link to="/signup">Sign up</Link>
      </div>
    </div>
  )
}
