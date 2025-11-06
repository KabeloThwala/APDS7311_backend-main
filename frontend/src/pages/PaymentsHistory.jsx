import React, { useEffect, useState } from 'react'
import api from '../utils/axiosClient'

export default function PaymentsHistory() {
  const [rows, setRows] = useState([])
  useEffect(()=>{
    api.get('/payments/history').then(r=>setRows(r.data||[])).catch(()=>{})
  },[])

  return (
    <div className="card">
      <h3 style={{marginTop:0}}>My Payments</h3>
      <table className="table">
        <thead>
          <tr><th>Date</th><th>Amount</th><th>Currency</th><th>Provider</th><th>Status</th><th>Reference</th></tr>
        </thead>
        <tbody>
          {rows.map(r=> (
            <tr key={r._id}>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
              <td>{r.amount}</td>
              <td>{r.currency}</td>
              <td>{r.provider}</td>
              <td><span className={`badge ${r.status}`}>{r.status}</span></td>
              <td>{r.reference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
