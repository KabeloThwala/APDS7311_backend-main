import React, { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../utils/axiosClient'
import { getStatusBadgeClass } from '../constants/statusStyles.js'

const nextStates = ['verified', 'submitted', 'rejected']

const statusColors = {
  pending: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200/70 dark:bg-amber-500/20 dark:text-amber-100',
  verified: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/70 dark:bg-emerald-500/20 dark:text-emerald-100',
  submitted: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200/70 dark:bg-sky-500/20 dark:text-sky-100',
  rejected: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200/70 dark:bg-rose-500/20 dark:text-rose-200'
}

const transitions = {
  pending: ['submitted', 'verified', 'rejected'],
  submitted: ['verified', 'rejected'],
  verified: ['submitted', 'rejected'],
  rejected: ['submitted', 'verified']
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  verified: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  submitted: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-100',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200'
  pending: 'bg-amber-500/20 text-amber-200',
  verified: 'bg-emerald-500/20 text-emerald-200',
  submitted: 'bg-sky-500/20 text-sky-100',
  rejected: 'bg-rose-500/20 text-rose-200'
}

export default function PaymentsAdmin() {
  const [rows, setRows] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const load = useCallback(
    () =>
      api
        .get('/payments/all')
        .then((r) => setRows(r.data || []))
        .catch(() => {}),
    []
  )


  const load = useCallback(() => api.get('/payments/all').then((r) => setRows(r.data || [])).catch(() => {}), [])

  useEffect(() => {
    load()
  }, [load])

  const update = async (id, status) => {
    setFeedback(null)
    setUpdatingId(id)
    try {
      const { data } = await api.put(`/payments/${id}/status`, { status })
      setFeedback({ tone: 'success', text: data?.message || 'Status updated successfully.' })
      await load()
    } catch (error) {
      setFeedback({ tone: 'error', text: error?.response?.data?.message || 'Failed to update status.' })
    } finally {
      setUpdatingId(null)
    }
  }

  const counts = useMemo(
    () =>
      rows.reduce(
        (acc, row) => {
          acc.total += 1
          acc[row.status] = (acc[row.status] || 0) + 1
          return acc
        },
        { total: 0 }
      ),
    [rows]
  )

  const summaryCards = useMemo(
    () => [
      { key: 'total', label: 'Total Payments', tone: 'from-slate-200 via-white to-slate-100', value: counts.total || 0 },
      { key: 'pending', label: 'Pending', tone: 'from-amber-100 via-white to-amber-50', value: counts.pending || 0 },
      { key: 'submitted', label: 'Submitted', tone: 'from-sky-100 via-white to-sky-50', value: counts.submitted || 0 },
      { key: 'verified', label: 'Verified', tone: 'from-emerald-100 via-white to-emerald-50', value: counts.verified || 0 }
    ],
    [counts]
  )
    }
  }

  const counts = useMemo(() => ({
    total: rows.length,
    pending: rows.filter((row) => row.status === 'pending').length
  }), [rows])

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">All payments</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Control panel for cross-role payment lifecycle management.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:border-white/20 dark:bg-white/5 dark:text-slate-200">
            {counts.total || 0} total
          </span>
          <span className="rounded-full border border-amber-400/60 bg-amber-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:bg-amber-400/10 dark:text-amber-100">
            {counts.pending || 0} pending
          </span>
          <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:border-white/20 dark:bg-white/5 dark:text-slate-200">{counts.total} total</span>
          <span className="rounded-full border border-amber-400/60 bg-amber-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:bg-amber-400/10 dark:text-amber-100">{counts.pending} pending</span>
      <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">All payments</h2>
          <p className="text-sm text-slate-300">Control panel for cross-role payment lifecycle management.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-200">{counts.total} total</span>
          <span className="rounded-full border border-amber-400/50 bg-amber-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-amber-100">{counts.pending} pending</span>
        </div>
      </div>

      {feedback && (
        <div
          className={`mx-6 mt-5 rounded-2xl border px-4 py-3 text-sm ${
            feedback.tone === 'success'
              ? 'border-emerald-400/50 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100'
              : 'border-rose-400/50 bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-100'
          }`}
        >
        <div className={`mx-6 mt-5 rounded-2xl border px-4 py-3 text-sm ${feedback.tone === 'success' ? 'border-emerald-400/50 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100' : 'border-rose-400/50 bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-100'}`}>
        <div className={`mx-6 mt-5 rounded-2xl border px-4 py-3 text-sm ${feedback.tone === 'success' ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-100' : 'border-rose-400/50 bg-rose-500/10 text-rose-100'}`}>
          {feedback.text}
        </div>
      )}

      <div className="overflow-x-auto px-6 py-5">
        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.key}
              className={`rounded-3xl bg-gradient-to-br ${card.tone} p-4 text-sm shadow-inner ring-1 ring-slate-200/60 dark:bg-white/5 dark:ring-white/10`}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300/80">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{card.value}</p>
            </div>
          ))}
        </div>
        <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700 dark:divide-white/10 dark:text-slate-200">
          <thead className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-300/80">
        <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700 dark:divide-white/10 dark:text-slate-200">
          <thead className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-300/80">
        <table className="min-w-full divide-y divide-white/10 text-sm text-slate-200">
          <thead className="text-xs uppercase tracking-widest text-slate-300/80">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Currency</th>
              <th className="px-4 py-3 text-left">Provider</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {rows.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-slate-500 dark:text-slate-300">
                  No payments available.
                </td>
              </tr>
            )}
            {rows.map((r) => {
              const availableStates = transitions[r.status] || nextStates
              return (
                <tr key={r._id} className="transition hover:bg-slate-100/80 dark:hover:bg-white/5">
                  <td className="px-4 py-4">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-slate-900 dark:text-white">{r.userId?.fullName}</span>
                    <span className="ml-2 text-xs text-slate-500 dark:text-slate-300">({r.userId?.accountNumber})</span>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">{r.amount}</td>
                  <td className="px-4 py-4">{r.currency}</td>
                  <td className="px-4 py-4">{r.provider}</td>
                  <td className="px-4 py-4">
                    <span className={`status-badge ${getStatusBadgeClass(r.status)}`}>
                    <span className={`status-badge ${statusColors[r.status] || 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {availableStates.map((state) => (
                        <button
                          key={state}
                          type="button"
                          className="secondary-button px-4 py-2 text-xs uppercase tracking-wider"
                          disabled={updatingId === r._id}
                          aria-disabled={updatingId === r._id}
                          onClick={() => update(r._id, state)}
                        >
                          {updatingId === r._id ? 'Updating…' : state}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
                <td colSpan="7" className="px-4 py-8 text-center text-slate-500 dark:text-slate-300">No payments available.</td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r._id} className="transition hover:bg-slate-100/80 dark:hover:bg-white/5">
                <td className="px-4 py-4">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="px-4 py-4">
                  <span className="font-semibold text-slate-900 dark:text-white">{r.userId?.fullName}</span>
                  <span className="ml-2 text-xs text-slate-500 dark:text-slate-300">({r.userId?.accountNumber})</span>
                </td>
                <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">{r.amount}</td>
                <td className="px-4 py-4">{r.currency}</td>
                <td className="px-4 py-4">{r.provider}</td>
                <td className="px-4 py-4">
                  <span className={`status-badge ${statusColors[r.status] || 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200'}`}>{r.status}</span>
          <tbody className="divide-y divide-white/5">
            {rows.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-slate-300">No payments available.</td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r._id} className="transition hover:bg-white/5">
                <td className="px-4 py-4">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="px-4 py-4">
                  <span className="font-semibold text-white">{r.userId?.fullName}</span>
                  <span className="ml-2 text-xs text-slate-300">({r.userId?.accountNumber})</span>
                </td>
                <td className="px-4 py-4 font-semibold text-white">{r.amount}</td>
                <td className="px-4 py-4">{r.currency}</td>
                <td className="px-4 py-4">{r.provider}</td>
                <td className="px-4 py-4">
                  <span className={`status-badge ${statusColors[r.status] || 'bg-white/10 text-slate-200'}`}>{r.status}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {nextStates.map((state) => (
                      <button
                        key={state}
                        type="button"
                        className="secondary-button px-4 py-2 text-xs uppercase tracking-wider"
                        onClick={() => update(r._id, state)}
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
