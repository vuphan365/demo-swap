'use client'
import React, { FC } from 'react'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { SimpleChartNode } from './utils'

interface SimpleChartPriceDetailProps {
  selectedNode: SimpleChartNode,
  changedAmount: number,
  changedPercentage: string
}

const SimpleChartPriceDetail: FC<SimpleChartPriceDetailProps> = ({ selectedNode, changedAmount, changedPercentage }) => {
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
      <Text ml="5px">{dayjs(selectedNode?.time * 1000).format("MMM DD YYYY, hh:MM A")}</Text>
    </Box>
  )
}

export default SimpleChartPriceDetail