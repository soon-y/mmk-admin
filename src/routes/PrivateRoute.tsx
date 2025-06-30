import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  children: ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

export default PrivateRoute
