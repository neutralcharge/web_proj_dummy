"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Activity, Stethoscope, User, Lock, Mail, EyeOff, Eye } from "lucide-react"

type AuthMode = "login" | "signup"

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>("login")
  const [showPassword, setShowPassword] = useState(false)

  const toggleMode = () => setMode(mode === "login" ? "signup" : "login")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl"
      >
        {/* Left Side - Medical Animation */}
        <div className="bg-blue-600 text-white p-8 md:w-1/2 flex flex-col justify-center items-center relative overflow-hidden">
          <AnimatedBackground />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center z-10"
          >
            <h2 className="text-3xl font-bold mb-4">Welcome to HealthBuddy</h2>
            <p className="mb-8">Your trusted healthcare companion</p>
          </motion.div>
          <FloatingIcons />
        </div>

        {/* Right Side - Auth Form */}
        <div className="p-8 md:w-1/2">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                {mode === "login" ? "Sign In" : "Create Account"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatedInput icon={<User className="text-gray-400" />} type="text" placeholder="Username" />
                {mode === "signup" && (
                  <AnimatedInput icon={<Mail className="text-gray-400" />} type="email" placeholder="Email" />
                )}
                <AnimatedInput
                  icon={<Lock className="text-gray-400" />}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                      {showPassword ? <EyeOff className="text-gray-400" /> : <Eye className="text-gray-400" />}
                    </button>
                  }
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition duration-300 hover:bg-blue-700"
                >
                  {mode === "login" ? "Sign In" : "Sign Up"}
                </motion.button>
              </form>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-center text-gray-600"
              >
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={toggleMode}
                  className="ml-2 text-blue-600 font-semibold hover:underline focus:outline-none"
                >
                  {mode === "login" ? "Sign Up" : "Sign In"}
                </button>
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

const AnimatedInput: React.FC<{
  icon: React.ReactNode
  type: string
  placeholder: string
  rightIcon?: React.ReactNode
}> = ({ icon, type, placeholder, rightIcon }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
      <input
        type={type}
        className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        placeholder={placeholder}
      />
      {rightIcon && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{rightIcon}</div>}
    </motion.div>
  )
}

const AnimatedBackground: React.FC = () => {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="medical-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <motion.path
            d="M20 5L5 20M5 5l15 15M35 20L20 35M35 5L20 20"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeOpacity="0.2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#medical-pattern)" />
    </svg>
  )
}

const FloatingIcons: React.FC = () => {
  const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <>
      <motion.div
        className="absolute top-10 left-10"
        variants={iconVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Heart className="text-white opacity-50" size={32} />
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10"
        variants={iconVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Activity className="text-white opacity-50" size={32} />
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-10 transform -translate-y-1/2"
        variants={iconVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <Stethoscope className="text-white opacity-50" size={32} />
      </motion.div>
    </>
  )
}

export default AuthPage

