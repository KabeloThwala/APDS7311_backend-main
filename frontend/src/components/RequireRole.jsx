import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function RequireRole({ allow = [], children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (allow.length && !allow.includes(user.role)) return <Navigate to="/login" replace />
  return children
}
