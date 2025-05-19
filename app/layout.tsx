import type { Metadata } from 'next'

import { headers } from 'next/headers'
import ContextProvider from '@/context'

export const metadata: Metadata = {
  title: 'Reown appkit Next.js + wagmi',
  description: 'Demo'
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const headerData = await headers()
  const cookies = headerData.get('cookie')

  return (
    <html lang="en">
      <body>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  )
}