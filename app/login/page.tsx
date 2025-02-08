"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "../contexts/AuthContext"
import { HeartPulse, Stethoscope, UserCircle } from "lucide-react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [isLoading, setIsLoading] = useState(false)
  const { login, signup } = useAuth()
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const ecgLineRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    // Initial animations
    gsap.from(".auth-card", {
      duration: 1,
      scale: 0.8,
      opacity: 0,
      ease: "power3.out",
    })

    gsap.from(".decorative-element", {
      duration: 1.5,
      scale: 0,
      rotation: 180,
      stagger: 0.2,
      ease: "elastic.out(1, 0.5)",
    })

    // ECG line animation
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

    // Floating animation
    gsap.to(".floating-element", {
      y: 15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
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
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const pulseVariants = {
    initial: { scale: 1 },
    pulse: { scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity } }
  }

  const formVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ backgroundPosition: "0% 0%" }}
        animate={{ backgroundPosition: "100% 100%" }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `radial-gradient(circle at 10% 10%, #3B82F622 20%, transparent 20%)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* ECG Line Animation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path
          ref={ecgLineRef}
          d="M0 100 Q 200 50 400 150 T 800 100"
          stroke="#3B82F6"
          strokeWidth="2"
          fill="none"
          className="opacity-20"
        />
      </svg>

      {/* Floating Medical Icons */}
      <HeartPulse className="absolute top-1/4 left-20 text-blue-200/30 floating-element h-16 w-16 decorative-element" />
      <Stethoscope className="absolute top-1/3 right-32 text-blue-200/30 floating-element h-16 w-16 decorative-element" />

      {/* Main Card */}
      <motion.div
        ref={containerRef}
        className="auth-card bg-white p-8 rounded-xl shadow-2xl w-96 relative z-10 border border-blue-50"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "signup"}
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <motion.div
                variants={pulseVariants}
                initial="initial"
                animate="pulse"
                className="inline-block"
              >
                <HeartPulse className="h-16 w-16 text-blue-600 mx-auto mb-4 decorative-element" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isLogin ? "Welcome Back!" : "Join HealthBuddy"}
              </h2>
              <p className="text-gray-600">
                {isLogin ? "Secure access to your health portal" : "Start your health journey today"}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="username" className="flex items-center gap-2 text-gray-700">
                  <UserCircle className="h-4 w-4" />
                  Username
                </Label>
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 focus-visible:ring-blue-500"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="password" className="flex items-center gap-2 text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Z" />
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  </svg>
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 focus-visible:ring-blue-500"
                />
              </motion.div>

              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Label className="block mb-2 text-gray-700">Register as:</Label>
                    <RadioGroup value={role} onValueChange={setRole} className="grid gap-2">
                      {["user", "doctor"].map((r) => (
                        <motion.div
                          key={r}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <RadioGroupItem value={r} id={r} />
                          <Label htmlFor={r} className="flex-1">
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                          </Label>
                          {r === "doctor" ? (
                            <Stethoscope className="h-4 w-4 text-blue-600" />
                          ) : (
                            <UserCircle className="h-4 w-4 text-blue-600" />
                          )}
                        </motion.div>
                      ))}
                    </RadioGroup>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : isLogin ? (
                    "Secure Login"
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.p
              className="text-center mt-6 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {isLogin ? "New here? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-semibold hover:underline underline-offset-4"
              >
                {isLogin ? "Create Account" : "Login Instead"}
              </button>
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Animated Plus Symbols */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-200/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 180],
              scale: [0.5, 1, 0.5],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
