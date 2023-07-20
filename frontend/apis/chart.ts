// @ts-nocheck
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json()).catch((error) => {
  console.log('error', error)
  return null
})

export const formatChartData = (data) => Object.entries(data).map(([key, entry]) => ({
  time: new Date(key * 1000),
  value: entry?.v?.[0]
})).filter(({ value }) => typeof value !== undefined)

const getChartUrl = (interval?: string) => `http://localhost:3001/api/chart/data-api/v3/cryptocurrency/detail/chart?id=1839&range=${interval}`

export function useFetchChart(interval?: string) {
  return useSWR(
    interval ? getChartUrl(interval) : null,
    fetcher
  )
}

export async function fetchChart24h() {
  return fetch(getChartUrl('1D'), {
    next: { revalidate: 10 }
  }).then(res => res.json()).catch((error) => {
    console.log('error', error)
    return null
  })
}