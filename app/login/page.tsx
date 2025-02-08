"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "../contexts/AuthContext"
import { HeartPulse, Stethoscope } from "lucide-react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("patient")
  const { login, signup } = useAuth()
  const router = useRouter()

  useEffect(() => {
    gsap.from(".login-item", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isLogin) {
        await login(username, password)
      } else {
        await signup(username, password, role)
      }
      // Redirect based on role
      if (role === 'doctor') {
        router.push("/doctor/appointments") // Ensure this route exists
      } else {
        router.push("/consultation") // Ensure this route exists
      }
    } catch (error) {
      console.error("Authentication error:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 relative">
      {/* Medical Background Elements */}
      <div className="absolute inset-0 opacity-10 bg-medical-pattern bg-cover" />
      
      <div className="relative bg-white p-8 rounded-xl shadow-xl w-96 max-w-[90%] z-10">
        <div className="text-center mb-8 login-item">
          <HeartPulse className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? "Medical Portal Login" : "Healthcare Signup"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          {!isLogin && (
            <div className="login-item">
              <Label className="block mb-2 text-gray-700">Register as:</Label>
              <RadioGroup 
                value={role} 
                onValueChange={setRole}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="patient" id="patient" />
                  <Label htmlFor="patient" className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    Patient
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="doctor" id="doctor" />
                  <Label htmlFor="doctor" className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Doctor
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Username Input */}
          <div className="login-item">
            <Label htmlFor="username" className="text-gray-700">
              {role === 'doctor' ? 'Medical ID' : 'Username'}
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1"
              placeholder={role === 'doctor' ? "Enter medical ID" : "Enter username"}
            />
          </div>

          {/* Password Input */}
          <div className="login-item">
            <Label htmlFor="password" className="text-gray-700">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              placeholder="Enter password"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full login-item bg-blue-600 hover:bg-blue-700"
          >
            {isLogin ? 'Secure Login' : 'Create Account'}
          </Button>
        </form>

        {/* Toggle between Login/Signup */}
        <p className="text-center mt-6 text-gray-600 login-item">
          {isLogin ? "New to our platform? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-medium hover:underline"
          >
            {isLogin ? 'Register Here' : 'Login Here'}
          </button>
        </p>
      </div>
    </div>
  )
}
