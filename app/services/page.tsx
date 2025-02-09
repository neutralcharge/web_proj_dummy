"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Calendar, Brain, FileText, Bell, Activity } from "lucide-react"
import gsap from "gsap"

interface ServiceCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

const ServiceCardPreview: React.FC<ServiceCardProps> = ({ title, description, icon }) => {
  return (
    <div className="group transition-all duration-300 hover:z-10">
      <div className="transform transition-all duration-300 group-hover:-translate-y-4 group-hover:shadow-2xl">
        <Card className="overflow-hidden bg-white rounded-2xl h-full transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <div className="mb-4 text-blue-600 transition-transform duration-300 group-hover:scale-110 group-hover:transform">
              {icon}
            </div>
            <CardTitle className="text-xl font-semibold transition-colors duration-300 group-hover:text-blue-600">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 transition-opacity duration-300 group-hover:opacity-90">{description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (containerRef.current && titleRef.current) {
      // Background animation
      gsap.to(containerRef.current, {
        backgroundPosition: "100% 100%",
        duration: 20,
        repeat: -1,
        ease: "none",
      })

      // Floating medical icons
      const icons = ["🩺", "💊", "🏥", "🧬", "🧠", "🫀"]
      icons.forEach((icon, index) => {
        const iconElement = document.createElement("div")
        iconElement.textContent = icon
        iconElement.style.position = "absolute"
        iconElement.style.fontSize = "2rem"
        iconElement.style.opacity = "0.2"
        containerRef.current?.appendChild(iconElement)

        gsap.to(iconElement, {
          x: `random(0, ${window.innerWidth})`,
          y: `random(0, ${window.innerHeight})`,
          rotation: "random(-180, 180)",
          duration: "random(20, 40)",
          repeat: -1,
          yoyo: true,
          ease: "none",
          delay: index * 2,
        })
      })

      // Title animation
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
    }
  }, [])

  const services = [
    {
      title: "Online Consultations",
      description: "Connect with healthcare professionals from the comfort of your home.",
      icon: <Video className="w-6 h-6" />,
    },
    {
      title: "Appointment Booking",
      description: "Easily schedule appointments with your preferred doctors.",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      title: "AI-Powered Health Assistant",
      description: "Get instant answers to your health queries using our advanced AI.",
      icon: <Brain className="w-6 h-6" />,
    },
    {
      title: "Electronic Health Records",
      description: "Securely store and access your medical history anytime, anywhere.",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      title: "Medication Reminders",
      description: "Never miss a dose with our smart medication reminder system.",
      icon: <Bell className="w-6 h-6" />,
    },
    {
      title: "Health Tracking",
      description: "Monitor your vital signs and health metrics with our user-friendly tools.",
      icon: <Activity className="w-6 h-6" />,
    },
  ]

  return (
    <div
      ref={containerRef}
      className="min-h-screen p-8 relative overflow-hidden"
      style={{
        background: "linear-gradient(45deg, #e6f7ff, #f0f9ff, #e6f7ff)",
        backgroundSize: "400% 400%",
      }}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <h1 ref={titleRef} className="text-5xl font-bold text-center mb-12 text-blue-800">
          About Us
        </h1>
        <div className="bg-white bg-opacity-80 rounded-3xl p-8 mb-12 shadow-xl">
          <p className="text-xl text-gray-700 mb-6">
            We are dedicated to revolutionizing healthcare through innovative technology. Our mission is to make quality
            healthcare accessible to everyone, anytime, anywhere.
          </p>
          <p className="text-xl text-gray-700">
            With a team of experienced healthcare professionals and cutting-edge technology experts, we strive to create
            solutions that empower patients and support healthcare providers in delivering the best possible care.
          </p>
        </div>
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-800">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCardPreview
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

