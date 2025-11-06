import React, { useState } from 'react'
import api from '../utils/axiosClient'

export default function PaymentCreate() {
  const [form, setForm] = useState({
    amount: 1500,
    currency: 'ZAR',
    provider: 'SWIFT',
    recipientAccount: '987654321',
    swiftCode: 'ABSAZAJJ',
    reference: 'Payment for invoice 101'
  })
  const [msg, setMsg] = useState('')

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const { data } = await api.post('/payments/create', form)
      setMsg(data?.message || 'Created')
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Failed')
    }
  }

  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Create Payment</h3>
      <form onSubmit={onSubmit}>
        <div className="grid cols-3">
          <div className="form-row">
            <label>Amount</label>
            <input name="amount" value={form.amount} onChange={onChange} />
          </div>
          <div className="form-row">
            <label>Currency</label>
            <select name="currency" value={form.currency} onChange={onChange}>
              <option>ZAR</option><option>USD</option><option>EUR</option><option>GBP</option>
            </select>
          </div>
          <div className="form-row">
            <label>Provider</label>
            <select name="provider" value={form.provider} onChange={onChange}>
              <option>SWIFT</option><option>TransferWise</option><option>WesternUnion</option>
            </select>
          </div>
          <div className="form-row">
            <label>Recipient Account</label>
            <input name="recipientAccount" value={form.recipientAccount} onChange={onChange} />
          </div>
          <div className="form-row">
            <label>SWIFT Code</label>
            <input name="swiftCode" value={form.swiftCode} onChange={onChange} />
          </div>
          <div className="form-row" style={{gridColumn:'1 / -1'}}>
            <label>Reference</label>
            <input name="reference" value={form.reference} onChange={onChange} />
          </div>
        </div>
        <div style={{display:'flex', gap:10, marginTop:10}}>
          <button className="primary" type="submit">Submit Payment</button>
          <button type="button" className="ghost" onClick={()=>setForm({
            amount: 1500, currency:'ZAR', provider:'SWIFT', recipientAccount:'987654321', swiftCode:'ABSAZAJJ', reference:'Payment for invoice 101'
          })}>Reset</button>
        </div>
        {msg && <div style={{marginTop:10}}>{msg}</div>}
      </form>
    </div>
  )
}
