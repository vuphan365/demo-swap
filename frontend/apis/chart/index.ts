'use server'
import { SERVER_URL } from '@/constant'

export async function fetchChart(interval, ...props) {
  return fetch(`${SERVER_URL}/api/chart/data-api/v3/cryptocurrency/detail/chart?id=1839&range=${interval}`, {
    next: { revalidate: 120 }
  }).then(res => res.json()).catch((error) => {
    console.log('error', error)
    return null
  })
}