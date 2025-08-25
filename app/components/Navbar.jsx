'use client'
import { motion } from 'framer-motion'
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler'
import { FloatingDock } from '@/components/ui/floating-dock'
import { IconHome, IconUser, IconCode, IconMail, IconBuildingSkyscraper } from '@tabler/icons-react'

const dockItems = [
  {
    title: 'Home',
    icon: <IconHome className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
    href: '/'
  },
  {
    title: 'About',
    icon: <IconUser className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
    href: '/about'
  },
  {
    title: 'Projects',
    icon: <IconCode className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
    href: '/projects'
  },
  {
    title: 'Contacts',
    icon: <IconMail className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
    href: '/contacts'
  },
  {
    title: 'Experiences',
    icon: <IconBuildingSkyscraper className='h-full w-full text-neutral-500 dark:text-neutral-300' />,
    href: '/experiences'
  },
  {
    title: 'Theme',
    icon: <AnimatedThemeToggler />
  }
]

export default function Navbar() {
  return (
    <motion.div
      className='fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30'
      initial={{
        y: 100,
        opacity: 0,
        scale: 0.8
      }}
      animate={{
        y: 0,
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
      <FloatingDock items={dockItems} />
    </motion.div>
  )
}
