'use client'
import React, { useMemo, useState } from 'react'
import { fetchChart } from '@/apis/chart'
import { formatChartData } from '@/apis/chart/utils'
import useSwr from 'swr'
import { Box, useColorModeValue, Flex } from '@chakra-ui/react'
import SimpleChart from '@/components/Charts/SimpleChart'
import { ChartTimeInterval } from '@/components/Charts/utils'

const TradingViewClient = ({ serverData }) => {
  const [interval, setInterval] = useState(null)
  const { data: clientData, isLoading, error } = useSwr(interval, fetchChart, { keepPreviousData: true })
  const bg = useColorModeValue("white", "gray.800")

  const data = useMemo(() => {
    if (clientData?.data?.points) return formatChartData(clientData?.data?.points || {})
    return serverData
  }, [serverData, clientData])

  return (
    <Flex flex={1}>
      <Box w="100%" height={["400px", "80%"]} bg={bg} padding={6} boxShadow="base" borderRadius="12px">
        <SimpleChart
          //@ts-ignore
          data={data}
          isLoading={isLoading}
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
