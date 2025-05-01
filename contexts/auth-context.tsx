"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService } from "@/services/api-service"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type User = {
  id: string
  name: string
  email: string
  profileImage?: string
  preferences?: {
    budget?: number
    area?: number
    location?: string
  }
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check for saved token and fetch user data on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        } catch (error) {
          console.error("Error fetching user data:", error)
          localStorage.removeItem("token")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authService.login(email, password)
      localStorage.setItem("token", response.token)
      setUser(response.user)

      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.name}!`,
      })
    } catch (error: any) {
      console.error("Login failed:", error)
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials."
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authService.signup(name, email, password)
      localStorage.setItem("token", response.token)
      setUser(response.user)

      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      })
    } catch (error: any) {
      console.error("Signup failed:", error)
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again."
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/")

    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true)
    try {
      const updatedUser = await authService.updateProfile(data)
      setUser(updatedUser)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      return updatedUser
    } catch (error: any) {
      console.error("Profile update failed:", error)
      const errorMessage = error.response?.data?.message || "Profile update failed. Please try again."
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update password function
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true)
    try {
      await authService.updatePassword(currentPassword, newPassword)

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })
    } catch (error: any) {
      console.error("Password update failed:", error)
      const errorMessage = error.response?.data?.message || "Password update failed. Please try again."
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile, updatePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
