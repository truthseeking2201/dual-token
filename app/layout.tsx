import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dual Token Deposit System',
  description: 'Advanced liquidity management with dual token deposits',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  )
} 