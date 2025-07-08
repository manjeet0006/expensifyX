"use client"

import Link from "next/link"
import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const Footer = () => {
  return (
    <footer className="text-center py-4 text-sm text-muted-foreground relative">
      <p>
        Made with 💗 by{" "}
        <Popover>
          <PopoverTrigger asChild>
            <span className="cursor-pointer font-medium text-blue-600 hover:underline transition-colors">
              Manjeet Kumar
            </span>
          </PopoverTrigger>
          <PopoverContent align="center" className="w-[250px] text-left">
            <p className="text-sm font-semibold mb-2">Connect with me:</p>
            <ul className="space-y-2 text-blue-600">
              <li>
                <Link href="https://linkedin.com/in/manjeet-kumar-50a463301" target="_blank" className="hover:underline">
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="https://www.instagram.com/manjeet_rajput_0006/" target="_blank" className="hover:underline">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="https://x.com/manjeet_0008" target="_blank" className="hover:underline">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="https://github.com/manjeet0006" target="_blank" className="hover:underline">
                  GitHub
                </Link>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      </p>
    </footer>
  )
}

export default Footer
