"use client"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'


function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center bg-gradient-to-br from-white via-slate-50 to-slate-100">
      <motion.h1
        className="text-7xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-pink-500 mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        404
      </motion.h1>

      <motion.h2
        className="text-3xl md:text-4xl font-semibold mb-3 text-slate-800"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Page Not Found
      </motion.h2>

      <motion.p
        className="text-gray-600 max-w-md mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Oops! The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link href="/">
          <Button className="px-6 py-3 text-lg rounded-xl shadow-md hover:shadow-lg transition">
            Return Home
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound
