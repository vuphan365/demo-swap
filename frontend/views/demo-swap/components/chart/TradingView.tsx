import React from 'react'
import { fetchChart } from '@/apis/chart'
import { formatChartData } from '@/apis/chart/utils'
import TradingViewClient from './TradingViewClient'

async function TradingView() {
  const res = await fetchChart('1D')

  return (
    <TradingViewClient serverData={formatChartData(res?.data?.points || {})} />
  )
}

export default TradingView
//https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart?id=1839&range=7D