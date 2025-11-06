import React, { useEffect, useState } from 'react'
import api from '../utils/axiosClient'

const nextStates = ['verified','submitted','rejected']

export default function PaymentsAdmin() {
  const [rows, setRows] = useState([])
  const [msg, setMsg] = useState('')

  const load = () => api.get('/payments/all').then(r=>setRows(r.data||[])).catch(()=>{})
  useEffect(()=>{ load() }, [])

  const update = async (id, status) => {
    setMsg('')
    try {
      const { data } = await api.put(`/payments/${id}/status`, { status })
      setMsg(data?.message || 'Updated')
      await load()
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Failed to update')
    }
  }

  return (
    <div className="card">
      <h3 style={{marginTop:0}}>All Payments</h3>
      {msg && <div style={{marginBottom:10}}>{msg}</div>}
      <table className="table">
        <thead>
          <tr><th>Date</th><th>User</th><th>Amount</th><th>Currency</th><th>Provider</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r._id}>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
              <td>{r.userId?.fullName} ({r.userId?.accountNumber})</td>
              <td>{r.amount}</td>
              <td>{r.currency}</td>
              <td>{r.provider}</td>
              <td><span className={`badge ${r.status}`}>{r.status}</span></td>
              <td style={{display:'flex', gap:8}}>
                {nextStates.map(s => (
                  <button key={s} className="ghost" onClick={()=>update(r._id, s)}>{s}</button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
