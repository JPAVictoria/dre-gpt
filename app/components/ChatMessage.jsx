'use client'
import ReactMarkdown from 'react-markdown'

export default function ChatMessage({ message, index, isGenerating, isLast }) {
  const { role, text } = message

  return (
    <div className='w-full'>
      <div className={`flex items-start gap-4 ${role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className='flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-400 dark:from-neutral-600 dark:to-neutral-800 flex items-center justify-center'>
          <span className='text-xs font-semibold text-neutral-700 dark:text-neutral-200'>
            {role === 'user' ? 'U' : 'D'}
          </span>
        </div>

        <div className={`flex-1 max-w-[calc(100%-4rem)] ${role === 'user' ? 'text-right' : 'text-left'}`}>
          <div className='mb-1'>
            <span className='text-sm font-semibold text-neutral-600 dark:text-neutral-400'>
              {role === 'user' ? 'You' : 'DreGPT'}
            </span>
          </div>

          <div
            className={`inline-block p-4 rounded-lg border max-w-full ${
              role === 'user'
                ? 'bg-blue-500/10 border-blue-500/30 dark:bg-blue-500/20 dark:border-blue-500/40'
                : 'bg-transparent border-black/30 dark:border-white/30'
            }`}
          >
            <div
              className={`leading-relaxed text-black dark:text-white ${role === 'user' ? 'text-right' : 'text-left'}`}
            >
              <ReactMarkdown>{text}</ReactMarkdown>
              {isGenerating && isLast && role === 'DreGPT' && (
                <span className='inline-block w-2 h-4 bg-black dark:bg-white ml-1 animate-pulse' />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
