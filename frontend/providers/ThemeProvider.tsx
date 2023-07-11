'use client'
import React from 'react'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'

interface ThemeProvidersParams {
  children: React.ReactNode
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
}

const theme = extendTheme({ config })

function ThemeProviders({
  children
}: ThemeProvidersParams) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode='dark' />
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}

export default ThemeProviders