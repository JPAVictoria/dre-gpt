import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { GENERAL_FORMAT } from '@/app/lib/chatFormat'

const ai = new GoogleGenAI({})

// In-memory conversation store (keyed by sessionId)
const conversations = new Map()

// Helper to collect full response text from a streamed response
async function collectFullText(response) {
  let text = ''
  if (response[Symbol.asyncIterator]) {
    for await (const chunk of response) {
      if (chunk.text) text += chunk.text
    }
  } else {
    text = response.text || ''
  }
  return text
}

export async function POST(req) {
  try {
    const { sessionId, message } = await req.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
    }

    // Initialize conversation if missing
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, [
        {
          role: 'model', // system messages now use 'model'
          parts: [{ text: 'You are a helpful assistant.' }]
        }
      ])
    }

    const history = conversations.get(sessionId)

    // Append user message
    history.push({
      role: 'user', // must be 'user'
      parts: [{ text: `${GENERAL_FORMAT}\n\nUser question: ${message}` }]
    })

    // Generate AI response with conversation history
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: history,
      stream: true
    })

    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (response[Symbol.asyncIterator]) {
            for await (const chunk of response) {
              if (chunk.text) controller.enqueue(new TextEncoder().encode(chunk.text))
            }
          } else {
            const fullText = response.text || ''
            for (let i = 0; i < fullText.length; i++) {
              try {
                controller.enqueue(new TextEncoder().encode(fullText[i]))
              } catch {
                break
              }
              await new Promise((resolve) => setTimeout(resolve, 20))
            }
          }
        } catch (error) {
          console.error('Streaming error:', error)
          try {
            controller.error(error)
          } catch {}
        } finally {
          // Only attempt to close once
          try {
            if (!controller.desiredSize) return // optional safety check
            controller.close()
          } catch {}
        }
      }
    })

    // Collect full text after streaming and store assistant response in history
    collectFullText(response).then((assistantText) => {
      history.push({
        role: 'model', // assistant messages now use 'model'
        parts: [{ text: assistantText }]
      })
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      }
    })
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
