import { Navigate, Outlet } from 'react-router-dom'

export const RequireAuth = () => {
  const token = localStorage.getItem('accessToken')
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return <Outlet />
}

export const RequireGuest = () => {
  const token = localStorage.getItem('accessToken')
  
  if (token) {
    return <Navigate to="/" replace />
  }
  
  return <Outlet />
}

