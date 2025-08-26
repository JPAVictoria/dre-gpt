'use client'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import { GridBackgroundDemo } from './components/GridBackgroundDemo'
import ChatMessages from './components/ChatMessages'
import ChatInput from './components/ChatInput'
import { useChat } from './hooks/useChat'

export default function Home() {
  const { messages, input, setInput, isGenerating, sendMessage, stopGeneration, clearChat } = useChat()

  return (
    <div className='min-h-screen relative overflow-hidden'>
      <GridBackgroundDemo />
      <div className='relative z-10 max-w-6xl mx-auto p-4'>
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
            DreGPT
          </motion.h1>

          <motion.p
            className='max-w-xl mx-auto text-base md:text-lg text-neutral-700 dark:text-neutral-400 text-center leading-relaxed'
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Say hello to <b>DreGPT</b> — a simple yet sharp chatbot powered by <b>Next.js</b> and Google's{' '}
            <b>Gemini AI</b>.
          </motion.p>
        </motion.div>

        <ChatMessages messages={messages} isGenerating={isGenerating} />
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          onStop={stopGeneration}
          onClear={clearChat}
          isGenerating={isGenerating}
        />
        <Navbar />
      </div>
    </div>
  )
}
