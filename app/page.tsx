"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>();
  const particleCount = useRef(50); // Using ref for particle count

  // Configuration object for easy customization
  const config = {
    baseColor: [59, 130, 246] as const, // RGB values for blue-500
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
      
      // Reinitialize particles on resize
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

    const drawMedicalSymbol = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      opacity: number
    ) => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${config.baseColor.join(",")}, ${opacity})`;
      ctx.lineWidth = 2;
      
      // Draw horizontal line
      ctx.moveTo(x - size / 2, y);
      ctx.lineTo(x + size / 2, y);
      
      // Draw vertical line
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x, y + size / 2);
      
      ctx.stroke();
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      // Soft fade effect
      ctx.fillStyle = `rgba(255, 255, 255, ${config.fadeEffect})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position with boundary checks
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off walls
        if (particle.x <= 0 || particle.x >= canvas.width) particle.speedX *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.speedY *= -1;

        // Draw symbol
        drawMedicalSymbol(
          ctx,
          particle.x,
          particle.y,
          particle.size * config.symbolScale,
          particle.opacity
        );
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Initial setup
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animate();

    // Cleanup
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
