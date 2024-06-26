import '~/styles/global.css'

import { ClerkProvider } from '@clerk/nextjs'
import { type ReactNode } from 'react'
import { type Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Toaster } from '~/components/ui/sonner'
import { ReactQueryProvider } from '~/components/providers/QueryClientProvider'
import { ThemeProvider } from '~/components/providers/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Budget Tracker',
  description: 'This site was created using the NextJS framework 🚀',
  generator: 'NextJS',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="pt-BR" className="antialiased" suppressHydrationWarning>
        <body className={inter.className}>
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster richColors position="bottom-right" />
              {children}
            </ThemeProvider>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
