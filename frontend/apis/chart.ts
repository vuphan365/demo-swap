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

const getChartUrl = (pathname?: string, interval?: string) => {
  return `${pathname}/api/chart/data-api/v3/cryptocurrency/detail/chart?id=1839&range=${interval}`
}

export function useFetchChart(interval?: string) {
  const pathname = typeof window && window.location.origin
  console.log('useFetchChart', getChartUrl(pathname, interval))
  return useSWR(
    interval ? getChartUrl(pathname, interval) : null,
    fetcher
  )
}

export async function fetchChart24h(pathname) {
  console.log('fetchChart24h', {
    pathname,
    url: getChartUrl(pathname, '1D')
  })
  return fetch(getChartUrl(pathname, '1D'), {
    next: { revalidate: 10 }
  }).then(res => res.json()).catch((error) => {
    console.log('error', error)
    return null
  })
}