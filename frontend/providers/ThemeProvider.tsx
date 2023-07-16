'use client'
import React from 'react'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript, extendTheme, cookieStorageManagerSSR, localStorageManager } from '@chakra-ui/react'

interface ThemeProvidersParams {
  children: React.ReactNode,
  themeCookie: string
}

function ThemeProviders({
  children,
  themeCookie
}: ThemeProvidersParams) {
  // console.log('themeCookie', themeCookie)
  const colorModeManager =
    typeof themeCookie === 'string'
      ? cookieStorageManagerSSR(themeCookie)
      : localStorageManager

  const config = {
    initialColorMode: themeCookie,
    useSystemColorMode: false,
  }
  console.log('themeCookie', themeCookie)
  const theme = extendTheme({ config })
  return (
    <CacheProvider>
      {/* @ts-ignore */}
      <ColorModeScript type='cookie' initialColorMode={themeCookie} />
      <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}

export default ThemeProviders