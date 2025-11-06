import React, { useEffect, useMemo, useState } from 'react'
import api from '../utils/axiosClient'

export default function EmployeeDashboard() {
  const [metrics, setMetrics] = useState({ pending: 0, verified: 0, submitted: 0, rejected: 0 })

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setMetrics(data.metrics)).catch(() => {})
  }, [])

  const cards = useMemo(() => ([
    {
      label: 'Pending reviews',
      value: metrics.pending,
      description: 'Transfers awaiting employee verification.',
      accent: 'from-amber-400/70 via-amber-500/40 to-amber-500/10'
    },
    {
      label: 'Verified transfers',
      value: metrics.verified,
      description: 'Approved and ready for settlement.',
      accent: 'from-emerald-400/70 via-emerald-500/40 to-emerald-500/10'
    },
    {
      label: 'New submissions',
      value: metrics.submitted,
      description: 'Recent payments captured by customers.',
      accent: 'from-sky-400/70 via-sky-500/40 to-sky-500/10'
    },
    {
      label: 'Rejections',
      value: metrics.rejected,
      description: 'Items needing customer remediation.',
      accent: 'from-rose-400/70 via-rose-500/40 to-rose-500/10'
    }
  ]), [metrics])

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-sky-500 dark:text-sky-200">Employee control room</p>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">Operational overview</h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">Track workload across the verification pipeline and focus on payments that need attention.</p>
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-sky-200">Employee control room</p>
        <h1 className="text-3xl font-black text-white sm:text-4xl">Operational overview</h1>
        <p className="max-w-2xl text-sm text-slate-300">Track workload across the verification pipeline and focus on payments that need attention.</p>
      </header>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="glass-card relative overflow-hidden p-6">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-60`} aria-hidden="true" />
            <div className="relative z-10 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-200/80">{card.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white">{card.value}</span>
                <span className="text-sm text-slate-500 dark:text-slate-200/70">cases</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-200/80">{card.description}</p>
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
    </div>
  )
}
