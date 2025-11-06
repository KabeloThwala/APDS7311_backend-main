import React, { useMemo, useState } from 'react'
import api from '../utils/axiosClient'

const initialForm = {
  amount: 1500,
  currency: 'ZAR',
  provider: 'SWIFT',
  recipientAccount: '987654321',
  swiftCode: 'ABSAZAJJ',
  reference: 'Payment for invoice 101'
}

export default function PaymentCreate() {
  const [form, setForm] = useState(initialForm)
  const [msg, setMsg] = useState('')
  const [errors, setErrors] = useState({})

  const providers = useMemo(() => ([
    { id: 'SWIFT', label: 'SWIFT Network' },
    { id: 'TransferWise', label: 'Wise (TransferWise)' },
    { id: 'WesternUnion', label: 'Western Union' }
  ]), [])

  const validate = (values = form) => {
    const nextErrors = {}
    if (!values.amount || Number(values.amount) <= 0) {
      nextErrors.amount = 'Amount must be greater than zero.'
    }
    if (!/^\d{8,20}$/.test(values.recipientAccount || '')) {
      nextErrors.recipientAccount = 'Recipient account should contain 8–20 digits.'
    }
    if (!values.swiftCode || values.swiftCode.trim().length < 6) {
      nextErrors.swiftCode = 'Provide a valid SWIFT/BIC code.'
    }
    if (!values.reference || values.reference.trim().length < 4) {
      nextErrors.reference = 'Add a descriptive payment reference.'
    }
    return nextErrors
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const validation = validate()
    setErrors(validation)
    if (Object.keys(validation).length > 0) {
      return
    }

    setMsg('')
    try {
      const { data } = await api.post('/payments/create', form)
      setMsg(data?.message || 'Payment submitted successfully.')
    } catch (error) {
      setMsg(error?.response?.data?.message || 'Failed to submit payment.')
    }
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200/60 px-8 py-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Create payment</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Capture new outbound payments with full compliance metadata.</p>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            setForm(initialForm)
            setErrors({})
            setMsg('Form reset to defaults.')
          }}
        >
          Reset form
        </button>
      </div>

      <form className="space-y-8 px-8 py-6" onSubmit={onSubmit} noValidate>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-1.5">
            <label htmlFor="amount" className="glass-label">Amount</label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              className={`glass-input ${errors.amount ? 'border-rose-400/60 focus:ring-rose-400/50' : ''}`}
              value={form.amount}
              onChange={onChange}
              placeholder="1500"
            />
            {errors.amount && <p className="text-sm text-rose-500 dark:text-rose-300">{errors.amount}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="currency" className="glass-label">Currency</label>
            <div className="relative">
              <select
                id="currency"
                name="currency"
                className="glass-select"
                value={form.currency}
                onChange={onChange}
              >
                {['ZAR', 'USD', 'EUR', 'GBP'].map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500 dark:text-slate-300">▾</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="provider" className="glass-label">Provider</label>
            <div className="relative">
              <select
                id="provider"
                name="provider"
                className="glass-select"
                value={form.provider}
                onChange={onChange}
              >
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>{provider.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500 dark:text-slate-300">▾</span>
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-2 xl:col-span-1">
            <label htmlFor="recipientAccount" className="glass-label">Recipient account</label>
            <input
              id="recipientAccount"
              name="recipientAccount"
              className={`glass-input ${errors.recipientAccount ? 'border-rose-400/60 focus:ring-rose-400/50' : ''}`}
              value={form.recipientAccount}
              onChange={onChange}
              placeholder="987654321"
              inputMode="numeric"
            />
            {errors.recipientAccount && <p className="text-sm text-rose-500 dark:text-rose-300">{errors.recipientAccount}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="swiftCode" className="glass-label">SWIFT / BIC</label>
            <input
              id="swiftCode"
              name="swiftCode"
              className={`glass-input ${errors.swiftCode ? 'border-rose-400/60 focus:ring-rose-400/50' : ''}`}
              value={form.swiftCode}
              onChange={onChange}
              placeholder="ABSAZAJJ"
              autoCapitalize="characters"
            />
            {errors.swiftCode && <p className="text-sm text-rose-500 dark:text-rose-300">{errors.swiftCode}</p>}
          </div>

          <div className="space-y-1.5 md:col-span-2 xl:col-span-2">
            <label htmlFor="reference" className="glass-label">Payment reference</label>
            <input
              id="reference"
              name="reference"
              className={`glass-input ${errors.reference ? 'border-rose-400/60 focus:ring-rose-400/50' : ''}`}
              value={form.reference}
              onChange={onChange}
              placeholder="Payment for invoice 101"
            />
            {errors.reference && <p className="text-sm text-rose-500 dark:text-rose-300">{errors.reference}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button className="primary-button w-full sm:w-auto" type="submit">
            Submit payment
          </button>
          {msg && <p className="text-sm text-slate-600 dark:text-slate-200">{msg}</p>}
        </div>
      </form>
    </div>
  )
}
