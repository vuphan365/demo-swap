"use client"
import { Box, Flex } from '@chakra-ui/react'
import SwapForm from './components/SwapForm'

const Swap = () => {
  return (
    <Flex
      minHeight="calc(100vh - 56px)"
      width="100%"
      alignItems="center"
      justifyContent="center"
      bgGradient={[
        'linear(to-tr, teal.300, yellow.400)',
        'linear(to-t, blue.200, teal.500)',
        'linear(to-b, orange.100, purple.300)',
      ]}
    >
      <SwapForm />
    </Flex>
  )
}

export default Swap;