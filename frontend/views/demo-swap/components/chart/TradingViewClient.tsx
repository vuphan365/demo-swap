'use client'
import React, { useState } from 'react'
import { useFetchChart, formatChartData } from '@/apis/chart'
import { Box, useColorModeValue, Flex } from '@chakra-ui/react'
import SimpleChart from '@/components/Charts/SimpleChart'
import { ChartTimeInterval } from '@/components/Charts/utils'
import { pairData } from '@/data/mock_data'

const TradingViewClient = ({ children, data }) => {
  const [interval, setInterval] = useState(null)
  const { data: _data, isLoading, error } = useFetchChart(interval)
  const bg = useColorModeValue("white", "gray.800")
  console.log('data', { _data, error, interval })
  return (
    <Flex flex={1}>
      <Box w="100%" height={["400px", "80%"]} bg={bg} padding={6} boxShadow="base" borderRadius="12px">
        <SimpleChart
          //@ts-ignore
          data={data}
          //@ts-ignore
          isChangePositive
          chartInterval={interval || ChartTimeInterval.DAY}
          onChangeInterval={setInterval}
        />
        {/* {children} */}
      </Box>
    </Flex>
  )
}

export default TradingViewClient
