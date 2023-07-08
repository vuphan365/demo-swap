import { useCallback } from 'react'
import { atom, useAtom } from 'jotai'
import {
  ChainId,
  AlphaRouter,
  SwapOptionsSwapRouter02,
  SwapType,
  SwapRoute
} from '@uniswap/smart-order-router'
import { useToast } from '@chakra-ui/react'
import { ethers } from 'ethers'
import debounce from 'lodash/debounce'
import {
  CurrencyAmount,
  Percent,
  TradeType,
} from '@uniswap/sdk-core'
import type { Token } from '@/types/token'
import {
  ERC20_ABI,
  V3_SWAP_ROUTER_ADDRESS,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS
} from '@/constant'
import { convertGWeiToWei } from '@/utils'
import { useWeb3 } from './useWeb3'
import { useWallet } from './useWallet'
import { BigNumber } from 'ethers'

type GeneralSwapParams = {
  tokenIn: Token,
  inAmount: BigNumber
  tokenOut: Token
}

type ExecuteSwapParams = GeneralSwapParams & {
  onSwapSuccess?: (tokenIn: Token, tokenOut: Token) => void
}
export enum SwapStatus {
  QUOTING = "QUOTING",
  QUOTED = "QUOTED",
  TX_FAILED = "TX_FAILED",
  TX_NEW = "TX_NEW",
  TX_REJECTED = "TX_REJECTED",
  TX_SENT = "TX_SENT",
  TX_SIGNED = "TX_SIGNED",
}

type SwapAtom = {
  quote: BigNumber,
  status: SwapStatus,
  route: SwapRoute,
}
const swapAtom = atom<SwapAtom>({
  status: null,
  quote: null,
  route: null,
})

export const useSwap = () => {
  const [swapState, setSwapState] = useAtom(swapAtom)
  const { web3, sendTransaction, getWeb3Provider } = useWeb3()
  const { getWalletAddress } = useWallet()
  const toast = useToast()

  // const { getPoolInfo } = usePool()

  // async function getOutputQuote(route: Route<Currency, Currency>, params: GeneralSwapParams) {
  //   const { calldata } = await SwapQuoter.quoteCallParameters(
  //     route,
  //     CurrencyAmount.fromRawAmount(
  //       params?.tokenIn,
  //       params?.inAmount?.toString()
  //     ),
  //     TradeType.EXACT_INPUT,
  //     {
  //       useQuoterV2: true,
  //     }
  //   )

  //   const quoteCallReturnData = await getWeb3Provider().call({
  //     to: QUOTER_CONTRACT_ADDRESS,
  //     data: calldata,
  //   })


  //   return ethers.utils.defaultAbiCoder.decode(['uint256'], quoteCallReturnData)
  // }

  const getTokenTransferApproval = useCallback(async (token: Token) => {
    try {
      const tokenContract = new ethers.Contract(
        token?.address,
        ERC20_ABI,
        getWeb3Provider()
      )
      const unsignedTransaction = await tokenContract.populateTransaction.approve(
        V3_SWAP_ROUTER_ADDRESS,
        BigNumber.from(TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER)
      )
      await web3.provider.getSigner(0).sendUncheckedTransaction(unsignedTransaction)
      return SwapStatus.TX_SIGNED
    } catch (e) {
      console.log('e', e)
      toast({
        position: 'top-right',
        status: "error",
        title: "Failed to sign contract"
      })
      return SwapStatus.TX_FAILED
    }
  }, [getWeb3Provider, sendTransaction])

  const createSwap = useCallback(debounce(async (params: GeneralSwapParams) => {
    try {
      const address = await getWalletAddress()
      const provider = getWeb3Provider();
      if (!address || !provider) return
      const { inAmount, tokenIn, tokenOut } = params
      if (tokenIn.balance.lt(inAmount)) {
        setSwapState((prev) => ({
          ...prev,
          route: null,
          status: SwapStatus.QUOTED
        }))
        return
      }
      setSwapState((prev) => ({
        ...prev,
        route: null,
        status: SwapStatus.QUOTING
      }))

      const router = new AlphaRouter({
        chainId: ChainId.GÖRLI,
        provider: getWeb3Provider()
      })
      const options: SwapOptionsSwapRouter02 = {
        recipient: address,
        slippageTolerance: new Percent(50, 10_000),
        deadline: Math.floor(Date.now() / 1000 + 1800),
        type: SwapType.SWAP_ROUTER_02,
      }
      const route = await router.route(
        CurrencyAmount.fromRawAmount(
          //@ts-ignore
          tokenIn,
          //@ts-ignore
          inAmount.toString()
        ),
        //@ts-ignore
        tokenOut,
        TradeType.EXACT_INPUT,
        options
      )
      setSwapState(prev => ({
        ...prev,
        route,
        quote: ethers.BigNumber.from(convertGWeiToWei(route?.quote?.toFixed())),
        status: SwapStatus.QUOTED
      }))
    } catch (error) {
      console.log('error', error)
    }
  }, 500), [getWeb3Provider, getWalletAddress])

  const executeSwap = useCallback(async ({ tokenIn, tokenOut, onSwapSuccess }: ExecuteSwapParams) => {
    const toastId = toast({
      position: 'top-right',
      status: "info",
      title: "Swapping",
      duration: 100000
    })
    try {
      setSwapState(prev => ({
        ...prev,
        txStatus: SwapStatus?.TX_NEW
      }))
      const address = await getWalletAddress()
      const approval = await getTokenTransferApproval(tokenIn)
      if (approval !== SwapStatus.TX_SIGNED) return
      const res = await sendTransaction({
        data: swapState?.route?.methodParameters?.calldata,
        to: V3_SWAP_ROUTER_ADDRESS,
        value: swapState?.route?.methodParameters?.value,
        from: address,
        maxFeePerGas: MAX_FEE_PER_GAS,
        maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
      })
      toast.close(toastId)
      toast({
        position: 'top-right',
        status: "success",
        title: "Swap successfully",
      })
      onSwapSuccess(tokenIn, tokenOut)
      // update state
      return res
    } catch (error) {
      toast.close(toastId)
      toast({
        position: 'top-right',
        status: "error",
        title: "Failed to send transaction",
      })
      return null
    }
  }, [swapState?.route, getWalletAddress, getWeb3Provider, sendTransaction])

  return {
    createSwap,
    executeSwap,
    quote: swapState?.quote,
    status: swapState?.status
  }
}