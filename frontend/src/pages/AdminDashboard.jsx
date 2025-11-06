import React, { useEffect, useState } from 'react'
import api from '../utils/axiosClient'

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({pending:0,verified:0,submitted:0,rejected:0})
  const [users, setUsers] = useState([])

  useEffect(()=>{
    api.get('/admin/dashboard').then(({data})=> setMetrics(data.metrics)).catch(()=>{})
    api.get('/admin/users').then(({data})=> setUsers(data||[])).catch(()=>{})
  },[])

  return (
    <div className="grid" style={{gap:16}}>
      <div className="grid cols-4" style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16}}>
        <div className="card"><div>Pending</div><h2>{metrics.pending}</h2></div>
        <div className="card"><div>Verified</div><h2>{metrics.verified}</h2></div>
        <div className="card"><div>Submitted</div><h2>{metrics.submitted}</h2></div>
        <div className="card"><div>Rejected</div><h2>{metrics.rejected}</h2></div>
      </div>

      <div className="card">
        <h3 style={{marginTop:0}}>Users</h3>
        <table className="table">
          <thead><tr><th>Name</th><th>Account</th><th>Role</th><th>Created</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id || u._id}>
                <td>{u.fullName}</td>
                <td>{u.accountNumber}</td>
                <td>{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
