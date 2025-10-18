'use server'
import { SERVER_URL } from '@/constant'

const getInterval = (interval) => {
    if (interval === '1D') return '5m'
    if (interval === '7D') return '15m'
    if (interval === '1M') return '1h'
    if (interval === '1Y') return '1d'
    return '1h'
}
export async function fetchChart(interval, ...props) {
    const chartUrl = `${SERVER_URL}/data-api/v3.3/cryptocurrency/detail/chart?id=1839&interval=${getInterval(
        interval
    )}&range=${interval}&convertId=2781`;
    
    return fetch(chartUrl, {
        next: { revalidate: 120 },
    })
        .then((res) => res.json())
        .catch((error) => {
            console.log('error', error)
            return null
        })
}