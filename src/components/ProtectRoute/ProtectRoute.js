import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from 'hooks/useAuth'

const ProtectedRoute = () => {
  const { user } = useAuth()

  if (!user) {
    // user is not authenticated
    return <Navigate to="/auth" />
  }
  return (
    <Outlet />
  )
}

export default ProtectedRoute