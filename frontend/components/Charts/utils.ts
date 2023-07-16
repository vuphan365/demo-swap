
import { UTCTimestamp } from 'lightweight-charts'
const MIN_VALUE_DISPLAYED = 0.001

export const calculatePriceChange = (data) => {
  if (data?.length > 0) {
    const _first = data.find(({ value }) => !!value && value > 0)?.value ?? 0
    const _last = data[data.length - 1].value
    const _change = _last - _first

    return {
      amount:
        _change > 0 ? Math.max(_change, MIN_VALUE_DISPLAYED) : Math.min(_change, MIN_VALUE_DISPLAYED * -1),
      percentage: ((_change / _first) * 100).toFixed(2),
    }
  }

  return {
    amount: 0,
    percentage: "0.00",
  }
}


export const getChartColors = (isPositiveChart) => {
  return isPositiveChart
    ? { gradient1: "#00E7B0", gradient2: "#0C8B6C", stroke: "#31D0AA" }
    : { gradient1: "#ED4B9E", gradient2: "#ED4B9E", stroke: "#ED4B9E " };
};

export enum ChartTimeInterval {
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

export const ChartIntervalOptions = [{
  label: '24h',
  value: ChartTimeInterval.DAY
}, {
  label: '1W',
  value: ChartTimeInterval.WEEK
}, {
  label: '1M',
  value: ChartTimeInterval.MONTH
}, {
  label: '1Y',
  value: ChartTimeInterval.YEAR
}]

export const DateFormByInterval: Record<ChartTimeInterval, string> = {
  [ChartTimeInterval.DAY]: "h:mm a",
  [ChartTimeInterval.WEEK]: "MMM DD",
  [ChartTimeInterval.MONTH]: "MMM DD",
  [ChartTimeInterval.YEAR]: "MMM DD",
};

export interface SimpleChartNode {
  time: UTCTimestamp,
  value: number
}
