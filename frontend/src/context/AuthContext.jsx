import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('xyz_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('xyz_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('xyz_user')
  }

  const completeOnboarding = () => {
    const updatedUser = { ...user, onboarded: true }
    setUser(updatedUser)
    localStorage.setItem('xyz_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, completeOnboarding, loading: false }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
