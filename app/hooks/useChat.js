'use client'
import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const abortControllerRef = useRef(null)

  useEffect(() => {
    let id = localStorage.getItem('sessionId')
    if (!id) {
      id = uuidv4()
      localStorage.setItem('sessionId', id)
    }
    setSessionId(id)
  }, [])

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsGenerating(false)
  }

  const clearChat = () => {
    if (!isGenerating) {
      setMessages([])
      const newSessionId = uuidv4()
      localStorage.setItem('sessionId', newSessionId)
      setSessionId(newSessionId)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isGenerating) return

    setMessages((prev) => [...prev, { role: 'user', text: input }])
    const userInput = input
    setInput('')
    setIsGenerating(true)

    abortControllerRef.current = new AbortController()
    setMessages((prev) => [...prev, { role: 'DreGPT', text: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: userInput }),
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
          if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'DreGPT') {
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
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'DreGPT') {
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

  return {
    messages,
    input,
    setInput,
    isGenerating,
    sendMessage,
    stopGeneration,
    clearChat
  }
}
