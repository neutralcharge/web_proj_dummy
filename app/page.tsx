"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { useAuth } from "./contexts/AuthContext";

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
      cancelAnimationFrame(animationFrameId.current!);
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

    // Remove the background animation since we're using the canvas now
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="text-center relative z-10">
        <h1 className="hero-content text-4xl font-bold text-gray-900 mb-4">
          Welcome to HealthBuddy
        </h1>
        <p className="hero-content text-xl text-gray-600 mb-8">
          Your trusted healthcare companion
        </p>
        <div className="hero-content flex justify-center space-x-4">
          {user ? (
            user.role === "doctor" ? (
              <>
                <Button asChild>
                  <Link href="/doctor/appointments">
                    View Appointments
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/ai-help">
                    Get Help with AI
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href="/consultation">
                    Start Consultation
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/appointment">
                    Book an Appointment
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/ai-help">
                    Chat with AI
                  </Link>
                </Button>
              </>
            )
          ) : (
            <Button asChild>
              <Link href="/login">
                Login / Sign Up
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
