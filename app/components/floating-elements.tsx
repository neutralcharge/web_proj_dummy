"use client"

import { motion } from "framer-motion"
import { Heart, Activity, Stethoscope, Pill, AmbulanceIcon as FirstAid } from "lucide-react"
import type React from "react" // Added import for React

interface FloatingIconProps {
  icon: React.ReactNode
  delay: number
  x: number
  y: number
}

function FloatingIcon({ icon, delay, x, y }: FloatingIconProps) {
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
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    >
      {icon}
    </motion.div>
  )
}

export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <FloatingIcon icon={<Heart size={40} />} delay={0} x={100} y={100} />
      <FloatingIcon icon={<Activity size={48} />} delay={1} x={200} y={300} />
      <FloatingIcon icon={<Stethoscope size={56} />} delay={2} x={800} y={200} />
      <FloatingIcon icon={<Pill size={40} />} delay={1.5} x={700} y={400} />
      <FloatingIcon icon={<FirstAid size={48} />} delay={2.5} x={300} y={500} />
    </div>
  )
}

