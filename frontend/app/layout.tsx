import React from 'react'
import ThemeProviders from '@/providers/ThemeProvider'
import WagmiProvider from '@/providers/WagmiProvider'
import Header from '@/components/Header/Header'
import { cookies } from 'next/headers'

export default function DashboardLayout({
  children, // will be a page or nested layout,
}: {
  children: React.ReactNode,
}) {
  const cookieStore = cookies()
  const themeCookie = cookieStore.get('chakra-ui-color-mode')
  return (
    <html lang="en">
      <body>
        <ThemeProviders theme={themeCookie}>
          <WagmiProvider>
            <Header />
            {children}
          </WagmiProvider>
        </ThemeProviders>
      </body>
    </html>
  )
}
