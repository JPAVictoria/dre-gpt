'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ActionButton({ onClick, disabled, icon, tooltip, className = '', variant = 'default' }) {
  const [hovered, setHovered] = useState(false)

  const getButtonStyles = () => {
    const baseStyles = 'p-3 rounded-lg border transition-all duration-200'

    if (variant === 'danger' && !disabled) {
      return `${baseStyles} border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 cursor-pointer`
    }

    if (disabled) {
      return `${baseStyles} border-black/20 dark:border-white/20 bg-transparent text-black/40 dark:text-white/40 cursor-not-allowed opacity-50`
    }

    return `${baseStyles} border-black/20 dark:border-white/20 bg-transparent text-black/60 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-neutral-800`
  }

  return (
    <div className='relative group'>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${getButtonStyles()} ${className}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {icon}
      </button>

      <AnimatePresence>
        {hovered && tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 2, x: '-50%' }}
            transition={{ duration: 0.2 }}
            className='absolute -top-8 left-1/2 w-fit rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs whitespace-pre text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white'
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
