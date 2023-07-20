import SwapForm from './components/swap/SwapForm'
import TradingView from './components/chart/TradingView'
import DemoSwapClient from './components/DemoSwapClient'

const Swap = () => {
  return (
    <DemoSwapClient>
      <TradingView />
      <SwapForm />
    </DemoSwapClient>
  )
}


export default Swap;