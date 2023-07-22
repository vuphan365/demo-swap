'use client'
import React, { FC, useCallback } from 'react'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import utc from 'dayjs/plugin/utc'
import { SimpleChartNode } from './utils'

const DynamicHydration = dynamic(() => import('@/components/DynamicHydration'), { ssr: false })

dayjs.extend(utc)

interface SimpleChartPriceDetailProps {
  selectedNode: SimpleChartNode,
  changedAmount: number,
  changedPercentage: string
}

const SimpleChartPriceDetail: FC<SimpleChartPriceDetailProps> = ({ selectedNode, changedAmount, changedPercentage }) => {
  const dateRenderer = useCallback((_date) => {
    return <Text>{dayjs(selectedNode?.time * 1000).utc().format("MMM DD YYYY, hh:MM A")}</Text>
  }, [])
  return (
    <Box key={selectedNode?.value} display={!!selectedNode?.value ? 'initial' : 'none'}>
      <Flex gap={["6px", "12px"]} align="baseline" >
        <Heading as='div' size="lg" my="4px">
          {selectedNode?.value?.toFixed(3)}
        </Heading>
        <Heading as='div' size={["sm", "md"]} color={changedAmount > 0 ? "green.500" : "red.500"}>
          {changedAmount > 0 && '+'}{changedAmount.toFixed(2)}({changedPercentage}%)
        </Heading>
      </Flex>
      <DynamicHydration data={selectedNode} renderer={dateRenderer} />
    </Box>
  )
}

export default SimpleChartPriceDetail