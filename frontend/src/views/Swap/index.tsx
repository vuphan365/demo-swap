import { Box, Flex } from '@chakra-ui/react'
import SwapForm from './components/SwapForm'

const Swap = () => {
  return (
    <Flex minHeight="calc(100vh - 56px)" width="100%" alignItems="center" justifyContent="center">
      <SwapForm />
    </Flex>
  )
}

export default Swap;