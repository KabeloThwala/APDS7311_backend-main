import React, { useEffect, useState } from 'react'
import api from '../utils/axiosClient'

export default function EmployeeDashboard() {
  const [metrics, setMetrics] = useState({pending:0,verified:0,submitted:0,rejected:0})

  useEffect(()=>{
    api.get('/admin/dashboard').then(({data})=> setMetrics(data.metrics)).catch(()=>{})
  },[])

  return (
    <div className="grid cols-4" style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16}}>
      <div className="card"><div>Pending</div><h2>{metrics.pending}</h2></div>
      <div className="card"><div>Verified</div><h2>{metrics.verified}</h2></div>
      <div className="card"><div>Submitted</div><h2>{metrics.submitted}</h2></div>
      <div className="card"><div>Rejected</div><h2>{metrics.rejected}</h2></div>
    </div>
  )
}
