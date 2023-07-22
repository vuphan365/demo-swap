"use client"
import { Flex, useColorModeValue } from '@chakra-ui/react'

const DemoSwapClient = ({ children }) => {
  const bgGradient = useColorModeValue([
    'linear(to-tr, teal.300, yellow.400)',
    'linear(to-t, blue.200, teal.500)',
    'linear(to-b, orange.100, purple.300)',
  ], 'linear-gradient(to right, #3a6186, #89253e)')
  return (
    <Flex
      minHeight="calc(100vh - 56px)"
      width="100%"
      gap={["16px", "36px"]}
      alignItems="stretch"
      justifyContent="space-between"
      p={["16px", "36px"]}
      bgGradient={bgGradient}
      flexDir={["column-reverse", "row"]}
    >
      {children}
    </Flex >
  )
}


export default DemoSwapClient;