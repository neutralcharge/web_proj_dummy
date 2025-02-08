"use client"

import { motion } from "framer-motion"
import type { AnimatedTextProps } from "@/types"

export function AnimatedText({ text, delay = 0, className = "" }: AnimatedTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {text}
    </motion.div>
  )
}
