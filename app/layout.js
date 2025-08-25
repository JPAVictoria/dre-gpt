import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata = {
  title: 'DreGPT',
  description: "A simple chatbot powered by Next.js and Google's Gemini AI",
  keywords: ['Next.js', 'AI', 'Chatbot', 'Gemini', 'DreGPT'],
  authors: [{ name: 'Dre' }],
  openGraph: {
    title: 'DreGPT - Chatbot',
    description: "A simple chatbot powered by Next.js and Google's Gemini AI",
    url: 'https://dre-gpt.vercel.app',
    siteName: 'DreGPT',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DreGPT Chatbot'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  icons: {
    icon: '/favicon.ico'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
