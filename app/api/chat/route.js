import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({})

export async function POST(req) {
  try {
    const { message } = await req.json()

    // Use streaming method
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      stream: true // Enable streaming
    })

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Check if response is iterable (streaming)
          if (response[Symbol.asyncIterator]) {
            for await (const chunk of response) {
              const chunkText = chunk.text
              if (chunkText) {
                // Send each chunk as it arrives
                controller.enqueue(new TextEncoder().encode(chunkText))
              }
            }
          } else {
            // Fallback for non-streaming response
            const fullText = response.text
            // Simulate streaming by sending character by character
            for (let i = 0; i < fullText.length; i++) {
              controller.enqueue(new TextEncoder().encode(fullText[i]))
              // Small delay to simulate streaming effect
              await new Promise((resolve) => setTimeout(resolve, 20))
            }
          }
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
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
