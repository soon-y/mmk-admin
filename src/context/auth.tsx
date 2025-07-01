import { createContext, useContext, useEffect, useState } from 'react'
import { fetchMe } from '../utils/profileUtils'
import type { ReactNode } from 'react'
import type { UserProps } from '../types'

interface AuthContextType {
  user: UserProps | null
  isAuthenticated: boolean
  loading: boolean
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  user: null,
  setUser: () => {}
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserProps | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      fetchMe()
        .then((result) => {
          if (result === false) {
            setIsAuthenticated(false)
            setUser(null)
            localStorage.removeItem('token')
          } else {
            setIsAuthenticated(true)
            setUser(result)
          }
        })
        .catch(() => {
          setIsAuthenticated(false)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setIsAuthenticated(false)
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ setUser, user, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
