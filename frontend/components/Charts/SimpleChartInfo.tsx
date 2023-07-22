import React, { FC, PropsWithChildren } from 'react'
import { Flex, ButtonGroup, Button, Heading, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { ChartIntervalOptions, ChartTimeInterval } from './utils'
import BNBIcon from '@/assets/bnb.svg'

interface SimpleChartInfo {
  chartInterval: ChartTimeInterval,
  onChangeChartInterval: (_value: ChartTimeInterval) => void,
}

const SimpleChartInfo: FC<PropsWithChildren<SimpleChartInfo>> = ({ chartInterval, onChangeChartInterval, children }) => {
  return (
    <Flex flexDir='column'>
      <Flex gap="4px" key="simple-chart-info-icon">
        <Image src={BNBIcon} width={20} height={20} alt="Icon" />
        <Heading size="md" color='gray.500' as='div'>
          BNB/USD
        </Heading>
      </Flex>
      {children}
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