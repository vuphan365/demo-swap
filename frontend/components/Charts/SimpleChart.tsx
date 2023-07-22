'use client'
import React, { useEffect, useMemo, useRef, memo, useState, FC, useCallback, useTransition } from 'react'
import { createChart, UTCTimestamp } from 'lightweight-charts'
import { Box, useColorMode, Flex, Spinner } from '@chakra-ui/react'
import dayjs from 'dayjs'
import {
  getChartColors,
  calculatePriceChange,
  ChartTimeInterval,
  DateFormByInterval,
  SimpleChartNode
} from './utils'
import SimpleChartInfo from './SimpleChartInfo'
import SimpleChartPriceDetail from './SimpleChartPriceDetail'

interface SimpleChart {
  data: Array<SimpleChartNode>,
  isLoading: boolean,
  chartInterval: ChartTimeInterval,
  onChangeInterval: (_value: ChartTimeInterval) => void
}

const SimpleChart: FC<SimpleChart> = ({ data, isLoading, chartInterval, onChangeInterval }) => {
  const [isPending, startTransition] = useTransition();
  const [selectedNode, setSelectedNode] = useState<SimpleChartNode>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const { colorMode } = useColorMode()
  const { amount: changedAmount, percentage: changedPercentage } = useMemo(() => calculatePriceChange(data), [data])
  const isPositiveChart = useMemo(() => changedAmount >= 0, [changedAmount])
  const isDark = useMemo(() => colorMode === 'dark', [colorMode])

  const transformedData: Array<SimpleChartNode> = useMemo(() => data?.map(({ time, value }) =>
    //@ts-ignore
    ({ time: Math.floor(time / 1000) as UTCTimestamp, value })) || []
    , [data]);

  console.log('transformedData', transformedData)
  const colors = useMemo(() => getChartColors(isPositiveChart), [isPositiveChart]);

  const lastNode = useMemo(() => transformedData[transformedData.length - 1], [transformedData])

  const onMouseLeave = useCallback(() => {
    startTransition(() => {
      setSelectedNode(null)
    });
  }, [])

  const onChangeSelectedNode = useCallback((node: SimpleChartNode) => {
    startTransition(() => {
      setSelectedNode(node)
    });
  }, [])

  useEffect(() => {
    if (!chartRef?.current) return
    const chart = createChart(chartRef?.current, {
      layout: {
        background: { color: "transparent" },
        textColor: isDark ? "#F4EEFF" : "#280D5F",
      },
      autoSize: true,
      handleScale: false,
      handleScroll: false,
      rightPriceScale: {
        scaleMargins: {
          top: 0.3,
          bottom: 0.1,
        },
        borderVisible: false,
      },
      timeScale: {
        visible: true,
        borderVisible: false,
        secondsVisible: false,
        tickMarkFormatter: (unixTime: number) => {
          return dayjs(unixTime * 1000).format(DateFormByInterval[chartInterval]).toUpperCase();
        },
      },
      grid: {
        horzLines: {
          visible: false,
        },
        vertLines: {
          visible: false,
        },
      },
      crosshair: {
        horzLine: {
          visible: true,
          labelVisible: true,
        },
        mode: 1,
        vertLine: {
          visible: true,
          labelVisible: false,
          style: 3,
          width: 1,
          color: isDark ? "#B8ADD2" : "#7A6EAA",
        },
      },
    });
    const precision = 2
    const newSeries = chart.addAreaSeries({
      lineWidth: 2,
      lineColor: colors.gradient1,
      topColor: colors.gradient1,
      bottomColor: isDark ? "#3c3742" : "white",
      priceFormat: { type: "price", precision, minMove: 1 / 10 ** precision },
    });
    newSeries.applyOptions({
      priceFormat: {
        type: "price",
        precision: 3,
        minMove: 1,
      },
    });
    newSeries.setData(transformedData);
    chart.timeScale().fitContent();
    chart.subscribeCrosshairMove((param) => {
      if (newSeries && param) {
        const timestamp = param.time as number;
        if (!timestamp) return;
        // @ts-ignore
        const parsedValue = (param.seriesData.get(newSeries)?.value ?? 0) as number | undefined;
        onChangeSelectedNode({
          time: timestamp as UTCTimestamp,
          value: parsedValue
        })
      } else {
        onMouseLeave()
      }
    });

    const handleResize = () => {
      console.log('handleResize')
      chart.applyOptions({ width: chartRef.current.clientWidth, height: chartRef.current.clientHeight });
    };

    window.addEventListener('resize', handleResize);

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };

  }, [isDark, transformedData, colors, chartInterval])

  return (
    <Flex height="100%" flexDir='column'>
      <SimpleChartInfo
        chartInterval={chartInterval}
        onChangeChartInterval={onChangeInterval}
      >
        <SimpleChartPriceDetail
          selectedNode={selectedNode || lastNode}
          changedAmount={changedAmount}
          changedPercentage={changedPercentage}
        />
      </SimpleChartInfo>
      <Box opacity={isLoading ? 0.8 : 1} flex={1} ref={chartRef} id="simple-chart" onMouseLeave={onMouseLeave} >
      </Box>
    </Flex >
  )
}

export default memo(SimpleChart)