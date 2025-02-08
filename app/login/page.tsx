"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "../contexts/AuthContext"
import { HeartPulse, Stethoscope, UserCircle, Lock, Pill } from "lucide-react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"patient" | "doctor">("patient")
  const [isLoading, setIsLoading] = useState(false)
  const { login, signup } = useAuth()
  const router = useRouter()
  const ecgLineRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    // ECG Line Animation
    if (ecgLineRef.current) {
      const pathLength = ecgLineRef.current.getTotalLength()
      ecgLineRef.current.style.strokeDasharray = `${pathLength} ${pathLength}`
      ecgLineRef.current.style.strokeDashoffset = `${pathLength}`

      gsap.to(ecgLineRef.current, {
        strokeDashoffset: 0,
        duration: 3,
        repeat: -1,
        ease: "none"
      })
    }

    // Floating animation for medical icons
    gsap.to(".floating-icon", {
      y: 15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (isLogin) {
        await login(username, password)
      } else {
        await signup(username, password, role)
      }
      // Role-based redirection
      router.push(role === 'doctor' ? '/doctor/appointments' : '/book-appointment')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 relative overflow-hidden">
      {/* Medical Background Elements */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <path
          ref={ecgLineRef}
          d="M0 100 Q 200 50 400 150 T 800 100"
          stroke="#3B82F6"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <Pill className="absolute top-1/4 left-20 text-blue-200/40 h-16 w-16 floating-icon" />
      <HeartPulse className="absolute bottom-1/4 right-32 text-blue-200/40 h-16 w-16 floating-icon" />

      <div className="relative bg-white p-8 rounded-xl shadow-2xl w-96 z-10 border-2 border-blue-50">
        <div className="text-center mb-8">
          <HeartPulse className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? "Welcome to HealthHub" : "Join Our Medical Community"}
          </h2>
          <p className="text-gray-600">
            {isLogin ? "Secure access to your health portal" : "Start your healthcare journey"}
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <RadioGroup value={role} onValueChange={(v: "patient" | "doctor") => setRole(v)} className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg cursor-pointer transition-all ${
              role === 'patient' ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 hover:bg-blue-50'
            }`}>
              <RadioGroupItem value="patient" id="patient" className="sr-only" />
              <Label htmlFor="patient" className="flex flex-col items-center gap-2">
                <UserCircle className="h-8 w-8 text-blue-600" />
                <span className="font-semibold">Patient</span>
                <span className="text-sm text-gray-600">Book appointments</span>
              </Label>
            </div>
            <div className={`p-4 rounded-lg cursor-pointer transition-all ${
              role === 'doctor' ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 hover:bg-blue-50'
            }`}>
              <RadioGroupItem value="doctor" id="doctor" className="sr-only" />
              <Label htmlFor="doctor" className="flex flex-col items-center gap-2">
                <Stethoscope className="h-8 w-8 text-blue-600" />
                <span className="font-semibold">Doctor</span>
                <span className="text-sm text-gray-600">Manage appointments</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username" className="flex items-center gap-2 text-gray-700 mb-2">
              <UserCircle className="h-4 w-4" />
              {role === 'doctor' ? 'Medical ID' : 'Username'}
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={role === 'doctor' ? "Enter your medical ID" : "Enter your username"}
            />
          </div>

          <div>
            <Label htmlFor="password" className="flex items-center gap-2 text-gray-700 mb-2">
              <Lock className="h-4 w-4" />
              Password
            </Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password"
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                {isLogin ? 'Accessing Portal...' : 'Creating Account...'}
              </div>
            ) : isLogin ? (
              `Enter ${role === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}`
            ) : (
              'Join as Medical Professional'
            )}
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          {isLogin ? "New to HealthHub? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-semibold hover:underline underline-offset-4"
          >
            {isLogin ? 'Create Account' : 'Secure Login'}
          </button>
        </p>
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 10% 10%, #3B82F610 20%, transparent 20%)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  )
}
