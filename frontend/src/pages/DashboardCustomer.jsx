import React, { useEffect, useMemo, useState } from 'react'
import api from '../utils/axiosClient'

const statusColors = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  verified: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  submitted: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-100',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200'
}

export default function DashboardCustomer() {
  const [payments, setPayments] = useState([])

  useEffect(() => {
    api.get('/payments/history')
      .then(r => setPayments(r.data || []))
      .catch(() => {})
  }, [])

  const metrics = useMemo(() => ([
    {
      label: 'Pending approvals',
      value: payments.filter(p => p.status === 'pending').length,
      description: 'Payments awaiting bank verification.',
      accent: 'from-amber-400/70 via-amber-500/40 to-amber-500/10'
    },
    {
      label: 'Verified payments',
      value: payments.filter(p => p.status === 'verified').length,
      description: 'Approved transfers ready for settlement.',
      accent: 'from-emerald-400/70 via-emerald-500/40 to-emerald-500/10'
    },
    {
      label: 'Recently submitted',
      value: payments.filter(p => p.status === 'submitted').length,
      description: 'Transfers captured and queued.',
      accent: 'from-sky-400/70 via-sky-500/40 to-sky-500/10'
    },
    {
      label: 'Requires attention',
      value: payments.filter(p => p.status === 'rejected').length,
      description: 'Transfers that need remediation.',
      accent: 'from-rose-400/70 via-rose-500/40 to-rose-500/10'
    }
  ]), [payments])

  const recent = useMemo(() => payments.slice(0, 5), [payments])

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-sky-500 dark:text-cyan-200">Customer overview</p>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">Your payment portfolio</h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">Monitor how your payments are progressing through the verification pipeline with real-time metrics and quick insights.</p>
      </header>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="glass-card relative overflow-hidden p-6">
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.accent} opacity-60`} aria-hidden="true" />
            <div className="relative z-10 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-200/80">{metric.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white">{metric.value}</span>
                <span className="text-sm text-slate-500 dark:text-slate-200/70">records</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-200/80">{metric.description}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="glass-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent activity</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Latest transfers captured in your workspace.</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:border-white/20 dark:bg-white/5 dark:text-slate-200">{payments.length} total payments</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700 dark:divide-white/10 dark:text-slate-200">
            <thead className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-300/80">
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Currency</th>
                <th className="px-6 py-3 text-left">Provider</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {recent.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500 dark:text-slate-300">You have not captured any payments yet.</td>
                </tr>
              )}
              {recent.map((payment) => (
                <tr key={payment._id} className="transition hover:bg-slate-100/80 dark:hover:bg-white/5">
                  <td className="px-6 py-4">{new Date(payment.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{payment.amount}</td>
                  <td className="px-6 py-4">{payment.currency}</td>
                  <td className="px-6 py-4">{payment.provider}</td>
                  <td className="px-6 py-4">
                    <span className={`status-badge ${statusColors[payment.status] || 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200'}`}>{payment.status}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-300">{payment.reference || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
