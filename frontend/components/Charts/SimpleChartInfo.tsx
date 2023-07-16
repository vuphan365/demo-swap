import React, { useEffect, useMemo, useRef, useState, FC } from 'react'
import { createChart, IChartApi, UTCTimestamp } from 'lightweight-charts'
import { Box, useColorMode, Flex, ButtonGroup, Button, Heading, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { getChartColors, calculatePriceChange, ChartIntervalOptions, ChartTimeInterval, SimpleChartNode } from './utils'


interface SimpleChartInfo {
  chartInterval: ChartTimeInterval,
  onChangeChartInterval: (_value: ChartTimeInterval) => void,
  selectedNode: SimpleChartNode,
  changedAmount: number,
  changedPercentage: string
}

const SimpleChartInfo: FC<SimpleChartInfo> = ({ chartInterval, onChangeChartInterval, selectedNode, changedAmount, changedPercentage }) => {
  return (
    <Flex flexDir='column'>
      <Box key={selectedNode?.value} display={!!selectedNode?.value ? 'initial' : 'none'}>
        <Flex gap="12px" align="baseline" >
          <Heading>
            {selectedNode?.value?.toFixed(3)}
          </Heading>
          <Heading size="md" color={changedAmount > 0 ? "green.500" : "red.500"}>
            {changedAmount > 0 && '+'}{changedAmount.toFixed(2)}({changedPercentage}%)
          </Heading>
        </Flex>
        <Text ml="5px">{dayjs(selectedNode?.time * 1000).format("MMM DD YYYY, hh:MM A")}</Text>
      </Box>


      <ButtonGroup key="simple-chart-info-interval" w="fit-content" mt={2} borderRadius="16px" borderWidth="2px" p="1px">
        {ChartIntervalOptions.map(({ label, value: _value }) => (
          <Button
            height="32px"
            lineHeight="32px"
            key={`simple-chart-time-${_value}`}
            variant={chartInterval === _value ? 'solid' : 'outline'}
            onClick={() => onChangeChartInterval(_value)}
            colorScheme="linkedin"
            borderRadius="16px"
            minW="60px"
            marginInlineStart="0px !important"
            borderWidth={0}
          >{label}</Button>
        ))}
      </ButtonGroup>
    </Flex >
  )
}

export default SimpleChartInfo