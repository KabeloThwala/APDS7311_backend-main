import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Sidebar({ open = false, onClose = () => {} }) {
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
    <>
      <div
        className={`fixed inset-0 z-20 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`glass-panel frost-mask fixed inset-y-0 left-0 z-30 flex w-72 flex-col gap-8 border-r border-white/10 px-6 py-8 text-slate-100 transition-transform duration-300 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">APDS7311</div>
            <div className="mt-1 text-2xl font-black leading-tight text-white">Digital Banking</div>
            <p className="mt-2 text-sm text-slate-300">Secure operations dashboard</p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-100 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300/60 lg:hidden"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {nav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold tracking-wide text-slate-200 transition ${isActive ? 'border-cyan-300/60 bg-white/25 text-cyan-50 shadow-glow' : 'hover:border-cyan-200/40 hover:bg-white/15 hover:text-white'}`
              }
            >
              <span>{item.label}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-4 w-4 opacity-0 transition group-hover:opacity-100"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-white">{user?.fullName || 'Guest'}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-cyan-200/80">{user?.role || 'No role'}</div>
            </div>
            {user ? (
              <button
                className="secondary-button px-4 py-2 text-sm font-semibold"
                onClick={() => {
                  logout()
                  navigate('/login', { replace: true })
                  onClose()
                }}
              >
                Logout
              </button>
            ) : (
              <button
                className="primary-button px-4 py-2 text-sm"
                onClick={() => {
                  navigate('/login')
                  onClose()
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
