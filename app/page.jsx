'use client'
import { useState } from 'react'
import Navbar from './components/Navbar'
import { cn } from '@/lib/utils'
import React from 'react'

export function GridBackgroundDemo() {
  return (
    <div className='relative flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black'>
      <div
        className={cn(
          'absolute inset-0',
          '[background-size:40px_40px]',
          '[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]',
          'dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]'
        )}
      />
      <div className='pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black'></div>
    </div>
  )
}

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
      {/* Spotlight Background */}
      <GridBackgroundDemo />

      {/* Main Content */}
      <div className='relative z-10 max-w-lg mx-auto p-4'>
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
