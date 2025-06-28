import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PromptBot Studio',
  description: 'Transform your ideas into stunning visuals with AI',
  generator: 'v0.dev',
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
