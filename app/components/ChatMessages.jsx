'use client'
import ChatMessage from './ChatMessage'

export default function ChatMessages({ messages, isGenerating }) {
  return (
    <div className='h-116 overflow-y-auto border border-black/20 dark:border-white/20 bg-transparent backdrop-blur-sm p-6 rounded-lg mb-4 space-y-6'>
      {messages.map((message, index) => (
        <ChatMessage 
          key={index} 
          message={message} 
          index={index}
          isGenerating={isGenerating}
          isLast={index === messages.length - 1}
        />
      ))}
    </div>
  )
}