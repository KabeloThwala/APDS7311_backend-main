import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const role = user?.role || 'customer'
  const nav = {
    customer: [
      { to: '/dashboard', label: 'Overview' },
      { to: '/payments/create', label: 'Create Payment' },
      { to: '/payments/history', label: 'My Payments' }
    ],
    employee: [
      { to: '/employee', label: 'Employee Dashboard' },
      { to: '/admin/payments', label: 'All Payments' }
    ],
    admin: [
      { to: '/admin', label: 'Admin Dashboard' },
      { to: '/admin/payments', label: 'All Payments' }
    ]
  }[role] || []

  return (
    <aside className="sidebar">
      <div className="card" style={{marginTop:0}}>
        <div className="brand">APDS7311 • Banking Portal</div>
        <small className="muted">Secure demo UI</small>
      </div>

      <div className="card">
        {nav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({isActive}) => 'nav-btn' + (isActive ? ' active' : '')}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:10}}>
          <div>
            <div style={{fontWeight:700}}>{user?.fullName || 'Guest'}</div>
            <small className="muted">Role: {user?.role || 'none'}</small>
          </div>
          {user ? (
            <button className="ghost" onClick={() => { logout(); navigate('/login', { replace:true })}}>Logout</button>
          ) : (
            <button className="primary" onClick={() => navigate('/login')}>Login</button>
          )}
        </div>
      </div>
    </aside>
  )
}
