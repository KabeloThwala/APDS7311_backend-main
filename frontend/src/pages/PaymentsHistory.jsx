import React, { useEffect, useMemo, useState } from 'react'
import api from '../utils/axiosClient'

const statusColors = {
  pending: 'bg-amber-500/20 text-amber-200',
  verified: 'bg-emerald-500/20 text-emerald-200',
  submitted: 'bg-sky-500/20 text-sky-100',
  rejected: 'bg-rose-500/20 text-rose-200'
}

export default function PaymentsHistory() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    api.get('/payments/history').then((r) => setRows(r.data || [])).catch(() => {})
  }, [])

  const totals = useMemo(() => ({
    count: rows.length,
    verified: rows.filter((row) => row.status === 'verified').length
  }), [rows])

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">My payments</h2>
          <p className="text-sm text-slate-300">A complete audit trail of your captured transfers.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-200">{totals.count} total</span>
          <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-100">{totals.verified} verified</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm text-slate-200">
          <thead className="text-xs uppercase tracking-widest text-slate-300/80">
            <tr>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Currency</th>
              <th className="px-6 py-3 text-left">Provider</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-300">No payments have been captured yet.</td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r._id} className="transition hover:bg-white/5">
                <td className="px-6 py-4">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 font-semibold text-white">{r.amount}</td>
                <td className="px-6 py-4">{r.currency}</td>
                <td className="px-6 py-4">{r.provider}</td>
                <td className="px-6 py-4">
                  <span className={`status-badge ${statusColors[r.status] || 'bg-white/10 text-slate-200'}`}>{r.status}</span>
                </td>
                <td className="px-6 py-4 text-slate-300">{r.reference || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
