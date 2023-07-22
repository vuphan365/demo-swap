
// @ts-nocheck
export const formatChartData = (data) => Object.entries(data).map(([key, entry]) => ({
  time: new Date(key * 1000),
  value: entry?.v?.[0]
})).filter(({ value }) => typeof value !== undefined)