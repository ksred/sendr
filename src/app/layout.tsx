import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AccountProvider } from '@/contexts/account-context'
import { ApiProvider } from '@/contexts/api-context'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Sender App',
  description: 'Trading made simple',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans">
        <ApiProvider>
          <AccountProvider>
            {children}
          </AccountProvider>
        </ApiProvider>
      </body>
    </html>
  )
}
