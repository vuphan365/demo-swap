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

interface ThemeProvidersParams {
  children: React.ReactNode,
  theme: string
}

function ThemeProviders({
  children,
  theme: _theme
}: ThemeProvidersParams) {
  const colorModeManager =
    typeof _theme === 'string'
      ? cookieStorageManagerSSR(_theme)
      : localStorageManager
  const theme = useMemo(() => extendTheme({
    config: {
      initialColorMode: _theme,
      useSystemColorMode: false,
    }
  }), [_theme])

  return (
    <CacheProvider>
      <ColorModeScript type='cookie' initialColorMode={_theme as "light"} />
      <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}

export default ThemeProviders