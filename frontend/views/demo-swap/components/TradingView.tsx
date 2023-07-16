import React from 'react'
import { Box, useColorModeValue, Flex } from '@chakra-ui/react'
import { pairData } from '@/data/mock_data'
import SimpleChart from '@/components/Charts/SimpleChart'

const TradingView = () => {
  const bg = useColorModeValue("white", "gray.800")

  return (
    <Flex flex={1}>
      <Box w="100%" height={["400px", "80%"]} bg={bg} padding={6} boxShadow="base" borderRadius="12px">
        <SimpleChart
          //@ts-ignore
          data={pairData}
          isChangePositive
        />
      </Box>
    </Flex>
  )
}

export default TradingView