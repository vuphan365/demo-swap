'use client'
import React, { useMemo } from 'react'
import { CacheProvider } from '@chakra-ui/next-js'
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  cookieStorageManagerSSR,
  localStorageManager,
} from '@chakra-ui/react'
import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

interface ThemeProvidersParams {
  children: React.ReactNode,
  theme: RequestCookie
}

function ThemeProviders({
  children,
  theme: _theme
}: ThemeProvidersParams) {
  const colorModeManager =
    _theme
      ? cookieStorageManagerSSR(`${_theme?.name}=${_theme?.value}`)
      : localStorageManager

  const theme = useMemo(() => extendTheme({
    config: {
      initialColorMode: _theme?.value,
      useSystemColorMode: false,
    }
  }), [_theme])

  return (
    <CacheProvider>
      <ColorModeScript type='cookie' initialColorMode={_theme?.value as "light" || "system"} />
      <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}

export default ThemeProviders