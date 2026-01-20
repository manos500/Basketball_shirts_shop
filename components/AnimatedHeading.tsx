"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export default function AnimatedHeading({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  )
}
