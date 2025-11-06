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
        className={`fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 dark:bg-slate-950/70 lg:hidden ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`glass-panel frost-mask fixed inset-y-0 left-0 z-30 flex w-72 flex-col gap-8 border-r border-slate-200/70 px-6 py-8 text-slate-700 transition-transform duration-300 dark:border-white/10 dark:text-slate-100 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500 dark:text-cyan-200">APDS7311</div>
            <div className="mt-1 text-2xl font-black leading-tight text-slate-900 dark:text-white">Digital Banking</div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Secure operations dashboard</p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-600 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-300/60 dark:border-white/20 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20 lg:hidden"
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
                `group flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold tracking-wide text-slate-600 transition dark:border-white/10 dark:text-slate-200 ${isActive ? 'border-sky-400/70 bg-white text-slate-900 shadow-lg shadow-sky-200/40 dark:border-cyan-300/60 dark:bg-white/20 dark:text-cyan-50 dark:shadow-glow' : 'hover:border-sky-300/60 hover:bg-white/70 hover:text-slate-900 dark:hover:border-cyan-200/40 dark:hover:bg-white/15 dark:hover:text-white'}`
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

        <div className="mt-auto glass-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">{user?.fullName || 'Guest'}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-sky-500 dark:text-cyan-200/80">{user?.role || 'No role'}</div>
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
