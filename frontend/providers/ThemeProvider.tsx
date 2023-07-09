// app/providers.tsx
'use client'
import React from 'react'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'

interface ThemeProvidersParams {
  children: React.ReactNode
}

function ThemeProviders({
  children
}: ThemeProvidersParams) {
  return (
    <CacheProvider>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}

export default ThemeProviders