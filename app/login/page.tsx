"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "../contexts/AuthContext"
import { HeartPulse, Stethoscope, UserCircle, Lock } from "lucide-react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [isLoading, setIsLoading] = useState(false)
  const { login, signup, user } = useAuth() // Get user from AuthContext
  const router = useRouter()
  
  const containerRef = useRef<HTMLDivElement>(null)
  const ecgLineRef = useRef<SVGPathElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.from(".login-content", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.2,
    })

    if (ecgLineRef.current) {
      const pathLength = ecgLineRef.current.getTotalLength()
      ecgLineRef.current.style.strokeDasharray = `${pathLength} ${pathLength}`
      ecgLineRef.current.style.strokeDashoffset = `${pathLength}`

      gsap.to(ecgLineRef.current, {
        strokeDashoffset: 0,
        duration: 2,
        repeat: -1,
        ease: "none",
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (isLogin) {
        await login(username, password)
        // Redirect based on actual user role from context
        if (user?.role === "doctor") {
          router.push("/doctor/appointments")
        } else {
          router.push("/consultation")
        }
      } else {
        await signup(username, password, role)
        // Redirect based on signed up role
        if (role === "doctor") {
          router.push("/doctor/appointments")
        } else {
          router.push("/consultation")
        }
      }
    } catch (error) {
      console.error("Authentication error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 relative overflow-hidden">
      {/* ... (keep background elements same) */}

      {/* Main Card */}
      <div ref={containerRef} className="auth-card bg-white p-8 rounded-xl shadow-2xl w-[420px] relative z-10 border border-blue-50">
        <div ref={formRef} className="login-content">
          {/* ... (keep header same) */}

          {/* Role Selection Tabs - Always visible */}
          <div className="mb-6">
            <RadioGroup 
              value={role} 
              onValueChange={setRole} 
              className="grid grid-cols-2 gap-2 p-1 bg-blue-50 rounded-lg"
            >
              {/* ... (keep role tabs same) */}
            </RadioGroup>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... (keep form fields same) */}

            {/* Visible Submit Button */}
            <div className="pt-2 relative z-50"> {/* Increased z-index */}
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 transition-all text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {isLogin ? (
                      <>
                        Login to {role === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}
                        {role === 'doctor' ? 
                          <Stethoscope className="h-4 w-4" /> : 
                          <UserCircle className="h-4 w-4" />
                        }
                      </>
                    ) : (
                      <>
                        Create {role === 'doctor' ? 'Doctor' : 'Patient'} Account
                        {role === 'doctor' ? 
                          <Stethoscope className="h-4 w-4" /> : 
                          <UserCircle className="h-4 w-4" />
                        }
                      </>
                    )}
                  </span>
                )}
              </Button>
            </div>

            {/* ... (keep doctor note same) */}
          </form>

          {/* Visible Toggle Button */}
          <div className="mt-6">
            <p className="text-center text-gray-600">
              {isLogin ? "New to HealthBuddy? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-semibold hover:underline underline-offset-4"
              >
                {isLogin ? "Create Account" : "Login Instead"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ... (keep other elements same) */}
    </div>
  )
}
