import React from 'react'
import { fetchChart24h, formatChartData } from '@/apis/chart'
import TradingViewClient from './TradingViewClient'

async function TradingView() {
  const res = await fetchChart24h()

  return (
    <TradingViewClient data={formatChartData(res?.data?.points || {})}>
    </TradingViewClient>
  )
}

export default TradingView
//https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart?id=1839&range=7D