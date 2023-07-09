import React from 'react'
import ThemeProviders from '@/providers/ThemeProvider'
import WagmiProvider from '@/providers/WagmiProvider'
import Header from '@/components/Header/Header'

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProviders>
          <WagmiProvider>
            <Header />
            {children}
          </WagmiProvider>
        </ThemeProviders>
      </body>
    </html>
  )
}