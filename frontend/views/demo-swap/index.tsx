"use client"
import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import SwapForm from './components/SwapForm'
import TradingView from './components/TradingView'

const Swap = () => {
  const bgGradient = useColorModeValue([
    'linear(to-tr, teal.300, yellow.400)',
    'linear(to-t, blue.200, teal.500)',
    'linear(to-b, orange.100, purple.300)',
  ], 'linear-gradient(to right, #3a6186, #89253e)')
  return (
    <Flex
      minHeight="calc(100vh - 56px)"
      width="100%"
      gap="36px"
      alignItems="stretch"
      justifyContent="space-between"
      p="36px"
      bgGradient={bgGradient}
      flexDir={["column-reverse", "row"]}
    >
      <TradingView />
      <SwapForm />
    </Flex>
  )
}

export default Swap;