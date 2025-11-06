import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import RequireRole from './components/RequireRole.jsx'
import { useAuth } from './context/AuthContext.jsx'

import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import DashboardCustomer from './pages/DashboardCustomer.jsx'
import EmployeeDashboard from './pages/EmployeeDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import PaymentCreate from './pages/PaymentCreate.jsx'
import PaymentsHistory from './pages/PaymentsHistory.jsx'
import PaymentsAdmin from './pages/PaymentsAdmin.jsx'

function Shell({ children }) {
  const { user } = useAuth()
  return (
    <div className="container">
      {user && <Sidebar />}
      <main className="content">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Shell><Login /></Shell>} />
      <Route path="/signup" element={<Shell><Signup /></Shell>} />

      <Route path="/dashboard" element={
        <RequireRole allow={["customer","admin","employee"]}>
          <Shell><DashboardCustomer /></Shell>
        </RequireRole>
      }/>

      <Route path="/payments/create" element={
        <RequireRole allow={["customer"]}>
          <Shell><PaymentCreate /></Shell>
        </RequireRole>
      }/>

      <Route path="/payments/history" element={
        <RequireRole allow={["customer"]}>
          <Shell><PaymentsHistory /></Shell>
        </RequireRole>
      }/>

      <Route path="/employee" element={
        <RequireRole allow={["employee","admin"]}>
          <Shell><EmployeeDashboard /></Shell>
        </RequireRole>
      }/>

      <Route path="/admin" element={
        <RequireRole allow={["admin"]}>
          <Shell><AdminDashboard /></Shell>
        </RequireRole>
      }/>

      <Route path="/admin/payments" element={
        <RequireRole allow={["employee","admin"]}>
          <Shell><PaymentsAdmin /></Shell>
        </RequireRole>
      }/>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Shell><div className="card">Not found</div></Shell>} />
    </Routes>
  )
}
