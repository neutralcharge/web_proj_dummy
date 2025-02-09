"use client"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutUsPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    // Animate heading
    gsap.from(".about-heading", {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "back.out(1.7)"
    })

    // Animate cards with scroll trigger
    const cards = document.querySelectorAll(".about-card")
    cards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=100",
          toggleActions: "play none none reverse"
        },
        opacity: 0,
        x: index % 2 === 0 ? -100 : 100,
        duration: 1,
        ease: "power3.out"
      })
    })

    // Create moving background texture
    const texture = document.querySelector(".background-texture")
    if (texture) {
      gsap.to(texture, {
        backgroundPosition: "100% 100%",
        duration: 20,
        repeat: -1,
        ease: "none"
      })
    }
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      {/* Moving background texture */}
      <div 
        className="background-texture absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.2) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative">
        <h1 className="about-heading text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
          About HealthBuddy
        </h1>

        <div className="space-y-12">
          <Card className="about-card transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                At HealthBuddy, our mission is to revolutionize healthcare accessibility through innovative technology. 
                We believe that quality healthcare should be available to everyone, anywhere, at any time. Through our 
                platform, we're breaking down traditional barriers and creating a seamless connection between patients 
                and healthcare providers.
              </p>
            </CardContent>
          </Card>

          <Card className="about-card transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-cyan-600">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                We envision a future where healthcare is not just reactive, but proactive and personalized. By leveraging 
                cutting-edge technology and artificial intelligence, we're creating a healthcare ecosystem that anticipates 
                needs, provides timely interventions, and ensures optimal health outcomes for all our users.
              </p>
            </CardContent>
          </Card>

          <Card className="about-card transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">Our Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                Behind HealthBuddy stands a diverse team of visionaries, including experienced healthcare professionals, 
                innovative technologists, and dedicated customer experience specialists. Our team combines decades of 
                medical expertise with cutting-edge technical knowledge to deliver a healthcare platform that truly 
                understands and meets your needs.
              </p>
            </CardContent>
          </Card>

          <Card className="about-card transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-cyan-600">Our Commitment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                Your health and privacy are our top priorities. We uphold the highest standards of medical ethics and 
                data security, ensuring that your personal health information remains confidential and protected. We're 
                constantly evolving, incorporating user feedback and the latest technological advancements to provide 
                you with the best possible healthcare experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
