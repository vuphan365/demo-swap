import { useColorMode } from '@chakra-ui/react'

export const useSSRColor = (color: string) => {
  const { colorMode } = useColorMode()
  const _bg = !!colorMode ? color : "chakra-body-bg"
  return _bg;
}