import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({})

export async function POST(req) {
  try {
    const { message } = await req.json()

    // Enable streaming
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      stream: true
    })

    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (response[Symbol.asyncIterator]) {
            // Real streaming
            for await (const chunk of response) {
              const chunkText = chunk.text
              if (chunkText) {
                controller.enqueue(new TextEncoder().encode(chunkText))
              }
            }
          } else {
            // Fallback: per-character streaming
            const fullText = response.text || ''
            for (let i = 0; i < fullText.length; i++) {
              // Only enqueue if controller is not closed
              try {
                controller.enqueue(new TextEncoder().encode(fullText[i]))
              } catch (err) {
                // If controller is closed, break loop gracefully
                break
              }
              await new Promise((resolve) => setTimeout(resolve, 20)) // simulate typing
            }
          }

          // Close the controller if not already closed
          try {
            controller.close()
          } catch (err) {
            // already closed, do nothing
          }
        } catch (error) {
          console.error('Streaming error:', error)
          try {
            controller.error(error)
          } catch {}
        }
      }
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
