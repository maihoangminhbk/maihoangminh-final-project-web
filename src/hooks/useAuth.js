import { React, createContext, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from './useLocalStorage'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user')

  // call this function when you want to authenticate the user
  const saveUserLocalStorage = (data) => {
    setUser(data)
  }

  // call this function to sign out logged in user
  const deleteUserLocalStorage = () => {
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      saveUserLocalStorage,
      deleteUserLocalStorage
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}