"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Microscope, Pill, Stethoscope, Syringe, Thermometer } from "lucide-react"

export default function LabReportAnalyzer() {
  const canvasRef = useRef(null)
  const microscopeRef = useRef(null)
  const stethoscopeRef = useRef(null)
  const thermometerRef = useRef(null)
  const syringeRef = useRef(null)
  const pillRef = useRef(null)

  useEffect(() => {
    // GSAP animations for medical icons
    const iconTimelines = [
      gsap.timeline({ repeat: -1 })
        .to(microscopeRef.current, {
          y: -20,
          duration: 2,
          ease: "power1.inOut",
          yoyo: true
        }),
      gsap.timeline({ repeat: -1 })
        .to(stethoscopeRef.current, {
          y: 20,
          duration: 3,
          ease: "power1.inOut",
          yoyo: true
        }),
      gsap.timeline({ repeat: -1 })
        .to(thermometerRef.current, {
          y: -15,
          duration: 2.5,
          ease: "power1.inOut",
          yoyo: true
        }),
      gsap.timeline({ repeat: -1 })
        .to(syringeRef.current, {
          y: 15,
          duration: 2.2,
          ease: "power1.inOut",
          yoyo: true
        }),
      gsap.timeline({ repeat: -1 })
        .to(pillRef.current, {
          y: -10,
          duration: 1.8,
          ease: "power1.inOut",
          yoyo: true
        })
    ]

    // Canvas setup and animation
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    const symbols = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.3 + 0.1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    }))

    gsap.ticker.add(() => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      symbols.forEach((symbol) => {
        ctx.save()
        ctx.translate(symbol.x, symbol.y)
        ctx.rotate(symbol.rotation)
        
        ctx.beginPath()
        ctx.strokeStyle = `rgba(59, 130, 246, ${symbol.opacity})`
        ctx.lineWidth = 2

        ctx.moveTo(-symbol.size / 2, 0)
        ctx.lineTo(symbol.size / 2, 0)
        ctx.moveTo(0, -symbol.size / 2)
        ctx.lineTo(0, symbol.size / 2)

        ctx.stroke()
        ctx.restore()

        // Update position and rotation
        symbol.y += symbol.speed
        symbol.rotation += symbol.rotationSpeed
        
        if (symbol.y > canvas.height) {
          symbol.y = -symbol.size
          symbol.x = Math.random() * canvas.width
        }
      })
    })

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      gsap.ticker.remove()
      iconTimelines.forEach(timeline => timeline.kill())
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div ref={microscopeRef} className="absolute left-10 top-1/4">
        <Microscope className="w-12 h-12 text-blue-400/30" />
      </div>

      <div ref={stethoscopeRef} className="absolute right-10 top-1/3">
        <Stethoscope className="w-16 h-16 text-blue-500/20" />
      </div>

      <div ref={thermometerRef} className="absolute left-1/4 bottom-1/4">
        <Thermometer className="w-10 h-10 text-blue-300/40" />
      </div>

      <div ref={syringeRef} className="absolute right-1/4 top-1/4">
        <Syringe className="w-14 h-14 text-blue-400/25" />
      </div>

      <div ref={pillRef} className="absolute right-1/3 bottom-1/3">
        <Pill className="w-12 h-12 text-blue-300/30" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Lab Report Analyzer</h1>
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <div className="aspect-video">
            <iframe
              src="https://app.dante-ai.com/embed/?kb_id=3a286c00-ac41-4a29-86f7-b94c8c5e4361&token=f23d8f79-b62a-4ab6-93a0-0290b3c5e58a&modeltype=gpt-4-omnimodel-mini&tabs=false"
              allow="clipboard-write; clipboard-read; *;microphone *"
              className="w-full h-[650px] rounded-lg"
              frameBorder="0"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
