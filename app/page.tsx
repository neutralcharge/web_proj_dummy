"use client"
import { useEffect, useRef } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { useAuth } from "./contexts/AuthContext"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles: Particle[] = []
    const particleCount = 50

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 5 + 1,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
      opacity: Math.random() * 0.5 + 0.1,
    })

    const drawMedicalSymbol = (x: number, y: number, size: number, opacity: number) => {
      ctx.beginPath()
      ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
      ctx.lineWidth = 2
      // Draw cross
      ctx.moveTo(x - size / 2, y)
      ctx.lineTo(x + size / 2, y)
      ctx.moveTo(x, y - size / 2)
      ctx.lineTo(x, y + size / 2)
      ctx.stroke()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
        drawMedicalSymbol(particle.x, particle.y, particle.size * 4, particle.opacity)
      })
      requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle())
    }
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-20"
      style={{ mixBlendMode: "multiply" }}
    />
  )
}

export default function HomePage() {
  const { user } = useAuth()

  useEffect(() => {
    gsap.from(".hero-content", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
      stagger: 0.2,
    })
    gsap.to(".bg-animation", {
      backgroundPosition: "100% 100%",
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "none",
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative">
      <AnimatedBackground />
      <div className="bg-animation bg-gradient-to-br from-sky-100 to-white bg-[length:400%_400%] absolute inset-0" />
      <div className="text-center relative z-10">
        <h1 className="hero-content text-4xl font-bold text-gray-900 mb-4">Welcome to HealthBuddy</h1>
        <p className="hero-content text-xl text-gray-600 mb-8">Your trusted healthcare companion</p>
        <div className="hero-content flex justify-center space-x-4">
          {user ? (
            user.role === "doctor" ? (
              <>
                <Button asChild>
                  <Link
                    href="/doctor/appointments"
                    className="bg-sky-500 text-white px-6 py-3 rounded-md hover:bg-sky-600 transition duration-300"
                  >
                    View Appointments
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link
                    href="/ai-help"
                    className="bg-white text-sky-500 border border-sky-500 px-6 py-3 rounded-md hover:bg-sky-50 transition duration-300"
                  >
                    Get Help with AI
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link
                    href="/consultation"
                    className="bg-sky-500 text-white px-6 py-3 rounded-md hover:bg-sky-600 transition duration-300"
                  >
                    Start Consultation
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link
                    href="/appointment"
                    className="bg-white text-sky-500 border border-sky-500 px-6 py-3 rounded-md hover:bg-sky-50 transition duration-300"
                  >
                    Book an Appointment
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link
                    href="/ai-help"
                    className="bg-white text-sky-500 border border-sky-500 px-6 py-3 rounded-md hover:bg-sky-50 transition duration-300"
                  >
                    Chat with AI
                  </Link>
                </Button>
              </>
            )
          ) : (
            <Button asChild>
              <Link
                href="/login"
                className="bg-sky-500 text-white px-6 py-3 rounded-md hover:bg-sky-600 transition duration-300"
              >
                Login / Sign Up
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
