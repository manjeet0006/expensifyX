"use client"
import Link from 'next/link';
import React, { useRef, useState } from 'react'

const Footer = () => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef();

  return (
    <footer className="text-center py-4 text-sm text-gray-500 relative">
      <p>
        Made with 💗 by{" "}
        <span
          onClick={() => setShowMenu(!showMenu)}
          className="cursor-pointer font-medium text-blue-600 hover:underline transition-colors"
        >
          Manjeet Kumar
        </span>
      </p>

      {showMenu && (
        
        <div
          ref={menuRef}
          className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg p-4 border w-75 z-50"
        >
          <p className="text-sm font-semibold mb-2">Connect with me:</p>
          <ul className="space-y-2 flex gap-5 text-left text-blue-600">
            <li>
              <Link href="https://linkedin.com/in/manjeet-kumar-50a463301" target="_blank">LinkedIn</Link>
            </li>
            <li>
              <Link href="https://www.instagram.com/manjeet_rajput_0006/" target="_blank">Instagram</Link>
            </li>
            <li>
              <Link href="https://x.com/manjeet_0008" target="_blank">Twitter</Link>
            </li>
            <li>
              <Link href="https://github.com/manjeet0006" target="_blank">GitHub</Link>
            </li>
          </ul>
        </div>
      )}
    </footer>
  )
}

export default Footer