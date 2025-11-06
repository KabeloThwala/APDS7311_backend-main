import React, { useEffect, useState } from 'react'
import api from '../utils/axiosClient'

export default function DashboardCustomer() {
  const [payments, setPayments] = useState([])

  useEffect(() => {
    api.get('/payments/history')
      .then(r => setPayments(r.data || []))
      .catch(()=>{})
  }, [])

  const pending = payments.filter(p=>p.status==='pending').length
  const verified = payments.filter(p=>p.status==='verified').length
  const submitted = payments.filter(p=>p.status==='submitted').length
  const rejected = payments.filter(p=>p.status==='rejected').length

  return (
    <div>
      <div className="grid cols-4" style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16}}>
        <div className="card"><div>Pending</div><h2>{pending}</h2></div>
        <div className="card"><div>Verified</div><h2>{verified}</h2></div>
        <div className="card"><div>Submitted</div><h2>{submitted}</h2></div>
        <div className="card"><div>Rejected</div><h2>{rejected}</h2></div>
      </div>
    </div>
  )
}
