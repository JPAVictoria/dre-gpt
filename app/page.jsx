'use client'
import React, { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import { motion } from 'framer-motion'
import { GridBackgroundDemo } from './components/GridBackgroundDemo'
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button'
import { AnimatePresence } from 'motion/react'

export default function Home() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const abortControllerRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [hoveredClear, setHoveredClear] = useState(false)

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsGenerating(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || isGenerating) return

    setMessages((prev) => [...prev, { role: 'user', text: input }])
    const userInput = input
    setInput('')
    setIsGenerating(true)

    abortControllerRef.current = new AbortController()

    setMessages((prev) => [...prev, { role: 'dreGPT', text: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
        signal: abortControllerRef.current.signal
      })

      if (abortControllerRef.current.signal.aborted) {
        return
      }

      if (!res.ok) {
        throw new Error('Failed to fetch response')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        if (abortControllerRef.current.signal.aborted) {
          reader.cancel()
          return
        }

        const chunk = decoder.decode(value, { stream: true })
        accumulatedText += chunk

        setMessages((prev) => {
          const newMessages = [...prev]
          if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'dreGPT') {
            newMessages[newMessages.length - 1] = {
              ...newMessages[newMessages.length - 1],
              text: accumulatedText
            }
          }
          return newMessages
        })
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return
      }

      console.error('Error:', error)
      setMessages((prev) => {
        const newMessages = [...prev]
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'dreGPT') {
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            text: 'Sorry, there was an error processing your request.'
          }
        }
        return newMessages
      })
    }

    setIsGenerating(false)
    abortControllerRef.current = null
  }

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return (
    <div className='min-h-screen relative overflow-hidden'>
      <GridBackgroundDemo />
      <div className='relative z-10 max-w-4xl mx-auto p-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mt-5 mb-12'
        >
          <motion.h1
            className='bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white 
             text-3xl md:text-4xl font-sans font-bold tracking-tight mb-6 leading-normal'
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            dreGPT
          </motion.h1>

          <motion.p
            className='max-w-xl mx-auto text-base md:text-lg text-neutral-700 dark:text-neutral-400 text-center leading-relaxed'
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Say hello to <b>dreGPT</b> — a simple yet sharp chatbot powered by <b>Next.js</b> and Google's{' '}
            <b>Gemini AI</b>.
          </motion.p>
        </motion.div>

        <div className='h-128 overflow-y-auto border border-black/20 dark:border-white/20 bg-transparent backdrop-blur-sm p-6 rounded-lg mb-4 space-y-4'>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] p-4 rounded-lg border ${
                  m.role === 'user'
                    ? 'bg-transparent border-black/30 dark:border-white/30'
                    : 'bg-transparent border-black/30 dark:border-white/30'
                }`}
              >
                <div className='leading-relaxed'>
                  <span className='font-semibold text-black dark:text-white'>{m.role}:</span>{' '}
                  <span className='text-black dark:text-white'>
                    {m.text}
                    {isGenerating && i === messages.length - 1 && m.role === 'dreGPT' && (
                      <span className='inline-block w-2 h-4 bg-black dark:bg-white ml-1 animate-pulse' />
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='flex gap-3'>
          <input
            className='border border-black/20 dark:border-white/20 bg-transparent backdrop-blur-sm rounded-lg p-3 flex-1 text-black dark:text-white placeholder-black/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30'
            placeholder='Say something...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isGenerating}
          />

          <div className='relative group'>
            <button
              onClick={stopGeneration}
              disabled={!isGenerating}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                isGenerating
                  ? 'border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 cursor-pointer'
                  : 'border-black/20 dark:border-white/20 bg-transparent text-black/40 dark:text-white/40 cursor-not-allowed'
              }`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <rect x='6' y='6' width='12' height='12' rx='2' />
              </svg>
            </button>

            {/* Tooltip */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: 2, x: '-50%' }}
                  transition={{ duration: 0.2 }}
                  className='absolute -top-8 left-1/2 w-fit rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs whitespace-pre text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white'
                >
                  Stop
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className='relative group'>
            <button
              onClick={() => setMessages([])}
              onMouseEnter={() => setHoveredClear(true)}
              onMouseLeave={() => setHoveredClear(false)}
              className='p-3 rounded-lg border border-black/20 dark:border-white/20 bg-transparent text-black/60 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-200'
            >
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <path d='M3 6h18M9 6v12m6-12v12' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </button>

            <AnimatePresence>
              {hoveredClear && (
                <motion.div
                  initial={{ opacity: 0, y: 10, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: 2, x: '-50%' }}
                  transition={{ duration: 0.2 }}
                  className='absolute -top-8 left-1/2 w-fit rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs whitespace-pre text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white'
                >
                  Clear
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <InteractiveHoverButton onClick={sendMessage} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Send'}
          </InteractiveHoverButton>
        </div>
        <Navbar />
      </div>
    </div>
  )
}
