import '~/styles/global.css'

import { ClerkProvider } from '@clerk/nextjs'
import { type ReactNode } from 'react'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'This site was created using the NextJS framework 🚀',
  generator: 'NextJS',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="pt-BR" className="antialiased">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
