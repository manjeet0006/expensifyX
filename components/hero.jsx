
"use client"

import Link from "next/link"
import Image from "next/image"
import React, { useRef } from "react"
import { useScroll, useTransform, motion, useMotionTemplate, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"

const HeroSection = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const smoothScroll = useSpring(scrollYProgress, { damping: 40, stiffness: 400 })

  const imageRotateX = useTransform(
    smoothScroll,
    [0, 0.02, 0.04, 0.07, 0.1],
    [18, 10, 5, 2, 0]
  )

  const imageTranslateY = useTransform(
  smoothScroll,
  [0, 0.015, 0.035, 0.06, 0.1],
  [100, 90, 60, 30, 0]
)

const imageScale = useTransform(
  smoothScroll,
  [0, 0.05, 0.1],
  [0.8, 1.02, 1.1]
)

  const textOpacity = useTransform(smoothScroll, [0, 0.1], [1, 0.7])
  const blur = useTransform(smoothScroll, [0, 0.1], [0, 8])
  const textImageScale = useTransform(smoothScroll, [0, 0.05], [0.95, 1.2])

  const finalBlur = useMotionTemplate`blur(${blur}px)`

  return (
    <section
      ref={containerRef}
      className="h-[400vh] w-full flex flex-col items-center justify-start text-center py-32 px-4"
      style={{ perspective: "1200px" }}
    >
      {/* Heading */}
      <motion.h1
        style={{ opacity: textOpacity, filter: finalBlur, scale: textImageScale }}
        className="text-4xl md:text-6xl lg:text-7xl mt-10 font-bold tracking-tight gradient-text animate-gradient  mb-2 "
      >
        Manage Your Finances <br /> with ExpensifyX
      </motion.h1>

      {/* Description */}
      <motion.p
        style={{ opacity: textOpacity, filter: finalBlur }}
        className="text-gray-600 text-base md:text-xl max-w-2xl mb-10 leading-relaxed"
      >
        An AI-powered platform to help you track, analyze, and manage your spending habits — all in one powerful dashboard.
      </motion.p>

      {/* Buttons */}
      <motion.div
        style={{ scale: textImageScale}}
        className="flex flex-col sm:flex-row gap-4 "
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/">
            <Button size="lg" variant="outline" className="px-8">
              Go to Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Image */}
      <motion.div
        style={{
          rotateX: imageRotateX,
          y: imageTranslateY,
          scale: imageScale,
        }}
        className="w-full max-w-6xl rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-white mt-12"
      >
        <div className="bg-gray-900 p-2 rounded-[24px]">
          <div className="bg-neutral-100 rounded-[16px] overflow-hidden">
            <Image
              src="/bannerf.png"
              alt="Dashboard Preview"
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
