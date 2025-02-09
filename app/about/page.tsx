"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Github, Linkedin } from "lucide-react"
import Image from "next/image"

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Developer data type
interface Developer {
  name: string
  image: string
  github: string
  linkedin: string
}

// Sample developer data
const developers: Developer[] = [
  {
    name: "Developer 1",
    image: "/placeholder.svg?height=200&width=200",
    github: "https://github.com/dev1",
    linkedin: "https://linkedin.com/in/dev1",
  },
  {
    name: "Developer 2",
    image: "/placeholder.svg?height=200&width=200",
    github: "https://github.com/dev2",
    linkedin: "https://linkedin.com/in/dev2",
  },
  {
    name: "Developer 3",
    image: "/placeholder.svg?height=200&width=200",
    github: "https://github.com/dev3",
    linkedin: "https://linkedin.com/in/dev3",
  },
  {
    name: "Developer 4",
    image: "/placeholder.svg?height=200&width=200",
    github: "https://github.com/dev4",
    linkedin: "https://linkedin.com/in/dev4",
  },
]

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial animations for content sections
    const timeline = gsap.timeline()

    // Animate medical pattern background
    gsap.to(".medical-pattern", {
      backgroundPosition: "100% 100%",
      duration: 20,
      repeat: -1,
      ease: "none",
    })

    // Animate mission section
    timeline.from(".mission-content", {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: ".mission-content",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    })

    // Animate vision section
    timeline.from(".vision-content", {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: ".vision-content",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    })

    // Animate team section
    timeline.from(".team-content", {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: ".team-content",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    })

    // Animate developer cards
    gsap.from(".developer-card", {
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".developers-section",
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    })

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Medical pattern background */}
      <div
        className="medical-pattern fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 0v15h10V0h15v25H35v10h15v25H35V45H25v15H0V45h15V35H0V0h25zm10 35H25v10h10V35z' fill='%230ea5e9' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <div className="relative container mx-auto px-4 py-16 space-y-20">
        {/* Mission Section */}
        <section className="mission-content bg-white rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            At HealthBuddy, our mission is to revolutionize healthcare accessibility through innovative technology. We
            believe that quality healthcare should be available to everyone, anywhere, at any time. Through our
            platform, we're breaking down traditional barriers and creating a seamless connection between patients and
            healthcare providers.
          </p>
        </section>

        {/* Vision Section */}
        <section className="vision-content bg-white rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            We envision a future where healthcare is not just reactive, but proactive and personalized. By leveraging
            cutting-edge technology and artificial intelligence, we're creating a healthcare ecosystem that anticipates
            needs, provides timely interventions, and ensures optimal health outcomes for all our users.
          </p>
        </section>

        {/* Team Section */}
        <section className="team-content bg-white rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">Our Team</h2>
          <p className="text-gray-700 leading-relaxed">
            Behind HealthBuddy stands a diverse team of visionaries, including experienced healthcare professionals,
            innovative technologists, and dedicated customer experience specialists. Our team combines decades of
            medical expertise with cutting-edge technical knowledge to deliver a healthcare platform that truly
            understands and meets your needs.
          </p>
        </section>

        {/* Developers Section */}
        <section className="developers-section space-y-12">
          <h2 className="text-4xl font-bold text-blue-600 text-center">Our Developers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {developers.map((developer, index) => (
              <div
                key={index}
                className="developer-card bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative h-48">
                  <Image
                    src={developer.image || "/placeholder.svg"}
                    alt={developer.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-opacity duration-300 hover:opacity-90"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">{developer.name}</h3>
                  <div className="flex justify-center space-x-6">
                    <a
                      href={developer.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                      aria-label={`${developer.name}'s GitHub Profile`}
                    >
                      <Github className="w-6 h-6" />
                    </a>
                    <a
                      href={developer.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                      aria-label={`${developer.name}'s LinkedIn Profile`}
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

