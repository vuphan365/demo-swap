'use client'
import React, { FC, useDeferredValue, useEffect } from 'react'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { SimpleChartNode } from './utils'

dayjs.extend(utc)

interface SimpleChartPriceDetailProps {
  selectedNode: SimpleChartNode,
  changedAmount: number,
  changedPercentage: string
}

const SimpleChartPriceDetail: FC<SimpleChartPriceDetailProps> = ({ selectedNode, changedAmount, changedPercentage }) => {
  const date = useDeferredValue(selectedNode && dayjs(selectedNode?.time * 1000).utc().format("MMM DD YYYY, hh:MM A"))

  return (
    <Box key={selectedNode?.value} display={!!selectedNode?.value ? 'initial' : 'none'}>
      <Flex gap="12px" align="baseline" >
        <Heading as='div'>
          {selectedNode?.value?.toFixed(3)}
        </Heading>
        <Heading as='div' size="md" color={changedAmount > 0 ? "green.500" : "red.500"}>
          {changedAmount > 0 && '+'}{changedAmount.toFixed(2)}({changedPercentage}%)
        </Heading>
      </Flex>
      <Text ml="5px">{selectedNode?.time}</Text>
      <Text ml="5px">{date}</Text>
    </Box>
  )
}

export default SimpleChartPriceDetail