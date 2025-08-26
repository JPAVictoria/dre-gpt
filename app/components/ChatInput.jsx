'use client'
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button'
import ActionButton from '@/app/components/ActionButtons'

export default function ChatInput({ input, setInput, onSend, onStop, onClear, isGenerating }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isGenerating) {
      onSend()
    }
  }

  const stopIcon = (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <rect x='6' y='6' width='12' height='12' rx='2' />
    </svg>
  )

  const clearIcon = (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <path d='M3 6h18M9 6v12m6-12v12' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )

  return (
    <div className='flex gap-3'>
      <input
        className='border border-black/20 dark:border-white/20 bg-transparent backdrop-blur-sm rounded-lg p-3 flex-1 text-black dark:text-white placeholder-black/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30'
        placeholder='Say something...'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isGenerating}
      />

      <ActionButton onClick={onStop} disabled={!isGenerating} icon={stopIcon} tooltip='Stop' variant='danger' />

      <ActionButton onClick={onClear} disabled={isGenerating} icon={clearIcon} tooltip='Clear' />

      <InteractiveHoverButton onClick={onSend} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Send'}
      </InteractiveHoverButton>
    </div>
  )
}
