'use client'
import React from 'react'
import { Box, useColorModeValue, Flex, useColorMode, useColorModePreference } from '@chakra-ui/react'
import { pairData } from '@/data/mock_data'
import { useSSRColor } from '@/hooks/useSSRColor'
import SimpleChart from '@/components/Charts/SimpleChart'

const TradingView = () => {
  const bg = useColorModeValue("white", "gray.800")
  const _bg = useSSRColor(bg)
  return (
    <Flex flex={1}>
      <Box w="100%" height={["400px", "80%"]} bg={_bg} padding={6} boxShadow="base" borderRadius="12px">
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