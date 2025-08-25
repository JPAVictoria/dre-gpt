'use client'
import { useState } from 'react'
import Navbar from './components/Navbar'
import { motion } from 'framer-motion'
import { GridBackgroundDemo } from './components/GridBackgroundDemo'

export default function Home() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const sendMessage = async () => {
    if (!input.trim()) return

    setMessages((prev) => [...prev, { role: 'user', text: input }])
    const userInput = input
    setInput('')

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput })
    })
    const data = await res.json()

    if (data.reply) {
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply }])
    }
  }

  return (
    <div className='min-h-screen relative overflow-hidden'>
      <GridBackgroundDemo />
      <div className='relative z-10 max-w-lg mx-auto p-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mt-20 mb-12'
        >
          <motion.h1
            className='bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white 
             text-3xl md:text-5xl font-sans font-bold tracking-tight mb-6 leading-normal'
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            dreGPT
          </motion.h1>

          <motion.p
            className='max-w-2xl mx-auto text-base md:text-lg text-neutral-700 dark:text-neutral-400 text-center leading-relaxed'
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Say hello to <b>dreGPT</b> — a simple yet sharp chatbot powered by <b>Next.js</b> and Google’s{' '}
            <b>Gemini AI</b>.
          </motion.p>
        </motion.div>
        <div className='h-96 overflow-y-auto border border-gray-300/20 bg-black/20 backdrop-blur-sm p-2 rounded mb-3'>
          {messages.map((m, i) => (
            <p key={i} className={m.role === 'user' ? 'text-blue-400' : 'text-green-400'}>
              <strong>{m.role}:</strong> {m.text}
            </p>
          ))}
        </div>
        <div className='flex gap-2'>
          <input
            className='border border-gray-300/20 bg-black/20 backdrop-blur-sm rounded p-2 flex-1 text-white placeholder-gray-400'
            placeholder='Say something...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className='bg-blue-500/80 hover:bg-blue-500 text-white px-4 py-2 rounded backdrop-blur-sm transition-colors'
          >
            Send
          </button>
        </div>
        <Navbar />
      </div>
    </div>
  )
}
