import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex-center min-h-screen bg-slate-900">
        <div className="animate-pulse flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-indigo-500 rounded-lg"></div>
          <p className="text-dim text-xs font-bold uppercase tracking-widest">Loading XYZ Session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Redirect to onboarding if profile not complete
  // Check if current path is NOT onboarding to avoid infinite loop
  if (!user.onboarded && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
