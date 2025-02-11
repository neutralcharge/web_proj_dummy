"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Microscope, Pill, Stethoscope, Syringe, Thermometer } from "lucide-react"

export default function LabReportAnalyzer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Create medical symbols
    const symbols = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.3 + 0.1,
    }))

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw medical crosses
      symbols.forEach((symbol) => {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(59, 130, 246, ${symbol.opacity})`
        ctx.lineWidth = 2

        // Draw plus symbol
        ctx.moveTo(symbol.x - symbol.size / 2, symbol.y)
        ctx.lineTo(symbol.x + symbol.size / 2, symbol.y)
        ctx.moveTo(symbol.x, symbol.y - symbol.size / 2)
        ctx.lineTo(symbol.x, symbol.y + symbol.size / 2)

        ctx.stroke()

        // Update position
        symbol.y += symbol.speed
        if (symbol.y > canvas.height) {
          symbol.y = -symbol.size
          symbol.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Animated background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Floating medical icons */}
      <motion.div
        className="absolute left-10 top-1/4"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Microscope className="w-12 h-12 text-blue-400/30" />
      </motion.div>

      <motion.div
        className="absolute right-10 top-1/3"
        animate={{
          y: [0, 20, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Stethoscope className="w-16 h-16 text-blue-500/20" />
      </motion.div>

      <motion.div
        className="absolute left-1/4 bottom-1/4"
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Thermometer className="w-10 h-10 text-blue-300/40" />
      </motion.div>

      <motion.div
        className="absolute right-1/4 top-1/4"
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Syringe className="w-14 h-14 text-blue-400/25" />
      </motion.div>

      <motion.div
        className="absolute right-1/3 bottom-1/3"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Pill className="w-12 h-12 text-blue-300/30" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Lab Report Analyzer</h1>
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <div className="aspect-video">
            <iframe
              src="https://app.dante-ai.com/embed/?kb_id=3a286c00-ac41-4a29-86f7-b94c8c5e4361&token=f23d8f79-b62a-4ab6-93a0-0290b3c5e58a&modeltype=gpt-4-omnimodel-mini&tabs=false"
              allow="clipboard-write; clipboard-read; *;microphone *"
              className="w-full h-[500px] rounded-lg"
              frameBorder="0"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

