'use client'
import { motion } from 'framer-motion'
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler'
import { FloatingDock } from '@/components/ui/floating-dock'
import { IconCode, IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react'

const dockItems = [
  {
    title: 'Portfolio',
    icon: <IconCode className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
    href: 'https://dre-dev.vercel.app/'
  },
  {
    title: 'GitHub',
    icon: <IconBrandGithub className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
    href: 'https://github.com/JPAVictoria'
  },
  {
    title: 'LinkedIn',
    icon: <IconBrandLinkedin className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
    href: 'https://www.linkedin.com/in/jpavictoria/'
  },
  {
    title: 'Theme',
    icon: <AnimatedThemeToggler />
  }
]

export default function Navbar() {
  return (
    <motion.div
      className='fixed right-6 top-1/2 -translate-y-1/2 z-30'
      initial={{
        x: 100,
        opacity: 0,
        scale: 0.8
      }}
      animate={{
        x: 0,
        opacity: 1,
        scale: 1
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 25,
        delay: 0.8,
        duration: 0.6
      }}
    >
      {/* Force vertical layout */}
      <FloatingDock
        items={dockItems}
        desktopClassName='flex flex-col items-center justify-center gap-4 h-auto w-16 py-4 px-2'
        mobileClassName='flex-col'
      />
    </motion.div>
  )
}
