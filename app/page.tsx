"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "./contexts/AuthContext";
import { Heart, Activity, Stethoscope, Pill, Ambulance } from "lucide-react";

// Particle Animation Component
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>();
  const particleCount = useRef(50);

  const config = {
    baseColor: [59, 130, 246] as const,
    maxParticleSize: 5,
    speedRange: 1,
    opacityRange: { min: 0.1, max: 0.6 },
    fadeEffect: 0.05,
    symbolScale: 4,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = Array.from({ length: particleCount.current }, () =>
        createParticle(canvas.width, canvas.height)
      );
    };

    const createParticle = (width: number, height: number): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * config.maxParticleSize + 1,
      speedX: Math.random() * config.speedRange * 2 - config.speedRange,
      speedY: Math.random() * config.speedRange * 2 - config.speedRange,
      opacity: Math.random() * (config.opacityRange.max - config.opacityRange.min) + config.opacityRange.min,
    });

    const drawMedicalSymbol = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${config.baseColor.join(",")}, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.moveTo(x - size / 2, y);
      ctx.lineTo(x + size / 2, y);
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x, y + size / 2);
      ctx.stroke();
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.fillStyle = `rgba(255, 255, 255, ${config.fadeEffect})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        if (particle.x <= 0 || particle.x >= canvas.width) particle.speedX *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.speedY *= -1;
        drawMedicalSymbol(ctx, particle.x, particle.y, particle.size * config.symbolScale, particle.opacity);
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
      style={{ mixBlendMode: "multiply" }}
      aria-hidden="true"
    />
  );
}

// Floating Icons Component
function FloatingIcon({ icon, delay, x, y }: { icon: React.ReactNode; delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute text-blue-500/20"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.2, 0.5, 0.2],
        y: [y, y - 50, y],
        x: [x, x + 30, x],
      }}
      transition={{
        duration: 5,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      {icon}
    </motion.div>
  );
}

function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <FloatingIcon icon={<Heart size={40} />} delay={0} x={100} y={100} />
      <FloatingIcon icon={<Activity size={48} />} delay={1} x={200} y={300} />
      <FloatingIcon icon={<Stethoscope size={56} />} delay={2} x={800} y={200} />
      <FloatingIcon icon={<Pill size={40} />} delay={1.5} x={700} y={400} />
      <FloatingIcon icon={<Ambulance size={48} />} delay={2.5} x={300} y={500} />
    </div>
  );
}

// Stats Card Component
function StatsCard({ number, text, delay }: { number: string; text: string; delay: number }) {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
    >
      <motion.h3
        className="text-3xl font-bold text-blue-600 mb-2"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        {number}
      </motion.h3>
      <p className="text-gray-600">{text}</p>
    </motion.div>
  );
}

// Main HomePage Component
export default function HomePage() {
  const { user } = useAuth();

  useEffect(() => {
    gsap.from(".hero-content", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
      stagger: 0.2,
    });
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-blue-50" />
      <AnimatedBackground />
      <FloatingElements />

      {/* DNA Helix Animation */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          background: "linear-gradient(45deg, transparent 45%, #3B82F6 45%, #3B82F6 55%, transparent 55%)",
          backgroundSize: "20px 20px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "20px 20px"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="hero-content text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
              Welcome to <span className="text-blue-600">HealthBuddy</span>
            </h1>
          </motion.div>

          <motion.p
            className="hero-content text-xl md:text-2xl text-gray-600 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your trusted healthcare companion for a healthier tomorrow
          </motion.p>

          {/* Dynamic Buttons Based on User */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex flex-col md:flex-row gap-6 justify-center hero-content">
              {user ? (
                user.role === "doctor" ? (
                  <>
                    <Button asChild className="px-8 py-4 text-lg rounded-full">
                      <Link href="/doctor/appointments">View Appointments</Link>
                    </Button>
                    <Button asChild variant="outline" className="px-8 py-4 text-lg rounded-full">
                      <Link href="/ai-help">Get Help with AI</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild className="px-8 py-4 text-lg rounded-full">
                      <Link href="/consultation">Start Consultation</Link>
                    </Button>
                    <Button asChild variant="outline" className="px-8 py-4 text-lg rounded-full">
                      <Link href="/appointment">Book an Appointment</Link>
                    </Button>
                    <Button asChild variant="outline" className="px-8 py-4 text-lg rounded-full">
                      <Link href="/ai-help">Chat with AI</Link>
                    </Button>
                  </>
                )
              ) : (
                <Button asChild className="px-8 py-4 text-lg rounded-full">
                  <Link href="/login">Login / Sign Up</Link>
                </Button>
              )}
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
          >
            <StatsCard number="10k+" text="Happy Patients" delay={0.3} />
            <StatsCard number="50+" text="Expert Doctors" delay={0.6} />
            <StatsCard number="24/7" text="Medical Care" delay={0.9} />
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave Animation */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M0 0L48 8.875C96 17.75 192 35.5 288 44.375C384 53.25 480 53.25 576 44.375C672 35.5 768 17.75 864 17.75C960 17.75 1056 35.5 1152 44.375C1248 53.25 1344 53.25 1392 53.25H1440V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z"
            fill="#3B82F6"
            fillOpacity="0.1"
            animate={{
              d: [
                "M0 0L48 8.875C96 17.75 192 35.5 288 44.375C384 53.25 480 53.25 576 44.375C672 35.5 768 17.75 864 17.75C960 17.75 1056 35.5 1152 44.375C1248 53.25 1344 53.25 1392 53.25H1440V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z",
                "M0 20L48 28.875C96 37.75 192 55.5 288 64.375C384 73.25 480 73.25 576 64.375C672 55.5 768 37.75 864 37.75C960 37.75 1056 55.5 1152 64.375C1248 73.25 1344 73.25 1392 73.25H1440V140H1392C1344 140 1248 140 1152 140C1056 140 960 140 864 140C768 140 672 140 576 140C480 140 384 140 288 140C192 140 96 140 48 140H0V20Z",
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </section>
  );
}
