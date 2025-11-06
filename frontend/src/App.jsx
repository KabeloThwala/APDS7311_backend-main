import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">
      {user && (
        <>
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="fixed left-5 top-5 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-slate-300/70 bg-white/80 text-slate-600 shadow-lg backdrop-blur-lg transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-300/60 dark:border-white/20 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20 lg:hidden"
            aria-label="Open navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </>
      )}
      <div className="fixed right-5 top-5 z-30">
        <ThemeToggle />
      </div>
      <main className="relative z-10 flex w-full flex-1 justify-center px-4 py-10 sm:px-8 lg:px-12">
        <div className="flex w-full max-w-6xl flex-col gap-8">
          {children}
        </div>
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
      <Route path="*" element={<Shell><div className="glass-card p-10 text-center text-lg font-semibold">Page not found.</div></Shell>} />
    </Routes>
  )
}
