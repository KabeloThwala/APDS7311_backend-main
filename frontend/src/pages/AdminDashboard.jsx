import React, { useEffect, useMemo, useState } from 'react'
import api from '../utils/axiosClient'

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({ pending: 0, verified: 0, submitted: 0, rejected: 0 })
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setMetrics(data.metrics)).catch(() => {})
    api.get('/admin/users').then(({ data }) => setUsers(data || [])).catch(() => {})
  }, [])

  const statCards = useMemo(() => ([
    {
      label: 'Pending reviews',
      value: metrics.pending,
      description: 'Payments waiting for compliance checks.',
      accent: 'from-amber-400/70 via-amber-500/40 to-amber-500/10'
    },
    {
      label: 'Verified today',
      value: metrics.verified,
      description: 'Transfers cleared for settlement.',
      accent: 'from-emerald-400/70 via-emerald-500/40 to-emerald-500/10'
    },
    {
      label: 'New submissions',
      value: metrics.submitted,
      description: 'Payments queued for review.',
      accent: 'from-sky-400/70 via-sky-500/40 to-sky-500/10'
    },
    {
      label: 'Rejected',
      value: metrics.rejected,
      description: 'Items needing follow-up.',
      accent: 'from-rose-400/70 via-rose-500/40 to-rose-500/10'
    }
  ]), [metrics])

  const roleBreakdown = useMemo(() => users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {}), [users])

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-200">Admin intelligence</p>
        <h1 className="text-3xl font-black text-white sm:text-4xl">Enterprise operations dashboard</h1>
        <p className="max-w-3xl text-sm text-slate-300">Monitor key payment metrics, track workforce coverage and maintain complete visibility into customer onboarding activity.</p>
      </header>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="glass-card relative overflow-hidden p-6">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-60`} aria-hidden="true" />
            <div className="relative z-10 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-200/80">{card.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">{card.value}</span>
                <span className="text-sm text-slate-200/70">cases</span>
              </div>
              <p className="text-sm text-slate-200/80">{card.description}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card relative overflow-hidden p-6 lg:col-span-2">
          <div className="absolute -right-6 top-0 h-32 w-32 rounded-full bg-cyan-400/30 blur-3xl" aria-hidden="true" />
          <div className="relative z-10 space-y-3">
            <h2 className="text-xl font-semibold text-white">User base snapshot</h2>
            <p className="text-sm text-slate-300">{users.length} active profiles across the digital banking ecosystem.</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {['admin', 'employee', 'customer'].map((role) => (
                <div key={role} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-300">{role}</p>
                  <p className="mt-2 text-2xl font-bold text-white">{roleBreakdown[role] || 0}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white">Operational guidance</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            <li className="flex gap-3">
              <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-emerald-300" />
              Review and approve pending payments to keep settlement cycles on track.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-sky-300" />
              Monitor role distribution to maintain adequate compliance coverage.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-rose-300" />
              Collaborate with employees on rejected items to resolve customer blockers quickly.
            </li>
          </ul>
        </div>
      </section>

      <section className="glass-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">User directory</h2>
            <p className="text-sm text-slate-300">Audit-ready overview of platform access.</p>
          </div>
          <span className="rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-200">Updated {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-sm text-slate-200">
            <thead className="text-xs uppercase tracking-widest text-slate-300/80">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Account</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-300">No users available.</td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u.id || u._id} className="transition hover:bg-white/5">
                  <td className="px-6 py-4 font-semibold text-white">{u.fullName}</td>
                  <td className="px-6 py-4">{u.accountNumber}</td>
                  <td className="px-6 py-4 text-slate-200/80">{u.role}</td>
                  <td className="px-6 py-4">{new Date(u.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
