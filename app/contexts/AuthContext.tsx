"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  username: string
  role: "user" | "doctor"
}

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  signup: (username: string, password: string, role: "user" | "doctor") => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for saved user in localStorage on mount
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      // Here you would typically make an API call to verify credentials
      // For this example, we'll just set the user directly
      const newUser = { 
        username, 
        role: "user" as const 
      }
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      console.log('Logging in with:', username, password)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const signup = async (username: string, password: string, role: "user" | "doctor") => {
    try {
      // Here you would typically make an API call to create a new user
      // For this example, we'll just set the user directly
      const newUser = { username, role }
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
