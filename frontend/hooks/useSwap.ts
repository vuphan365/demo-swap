import { useCallback, useRef } from 'react'
import { atom, useAtom } from 'jotai'
import {
    AlphaRouter,
    SwapRoute,
    SwapOptionsSwapRouter02,
    SwapType,
} from '@uniswap/smart-order-router'
import { useToast } from '@chakra-ui/react'
import { ethers } from 'ethers'
import debounce from 'lodash/debounce'
import { CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core'
import { useAccount, useNetwork } from 'wagmi'
import {
    sendTransaction,
    prepareSendTransaction,
    fetchFeeData,
    waitForTransaction,
} from '@wagmi/core'
import type { Token } from '@/types/token'
import { V3_SWAP_ROUTER_ADDRESS } from '@/constant'
import { convertEthersToWei, convertGweiToWei } from '@/utils'
import { useWeb3Provider } from './useEthers'
import { BigNumber } from 'ethers'

type GeneralSwapParams = {
    tokenIn: Token
    inAmount: BigNumber
    tokenOut: Token
    gasPrice?: number
    slippage?: number
}

type ExecuteSwapParams = GeneralSwapParams & {
    onSwapSuccess?: (tokenIn: Token, tokenOut: Token) => void
}
export enum SwapStatus {
    QUOTING = 'QUOTING',
    QUOTED = 'QUOTED',
    TX_FAILED = 'TX_FAILED',
    TX_NEW = 'TX_NEW',
    TX_REJECTED = 'TX_REJECTED',
    TX_SENT = 'TX_SENT',
    TX_SIGNED = 'TX_SIGNED',
}

type SwapAtom = {
    quote: BigNumber
    status: SwapStatus
    route: SwapRoute
}
const swapAtom = atom<SwapAtom>({
    status: null,
    quote: null,
    route: null,
})

export const useSwap = () => {
    const [swapState, setSwapState] = useAtom(swapAtom)
    const { address } = useAccount()
    const toast = useToast()
    const web3Provider = useWeb3Provider()
    const { chain } = useNetwork()
    const signCode = useRef<number>()

    const createSwap = useCallback(
        debounce(async (params: GeneralSwapParams) => {
            const sign = Math.random()
            try {
                if (!address || !web3Provider) return
                signCode.current = sign
                const { inAmount, tokenIn, tokenOut } = params
                if (inAmount.gt(tokenIn.balance)) {
                    setSwapState((prev) => ({
                        ...prev,
                        route: null,
                        status: SwapStatus.QUOTED,
                    }))
                    return
                }
                setSwapState((prev) => ({
                    ...prev,
                    route: null,
                    status: SwapStatus.QUOTING,
                }))

                const router = new AlphaRouter({
                    chainId: chain.id,
                    // @ts-ignore
                    provider: web3Provider,
                })
                const options: SwapOptionsSwapRouter02 = {
                    recipient: address,
                    slippageTolerance: new Percent(
                        params.slippage ? params.slippage * 10000 : 50,
                        10_000
                    ),
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
                if (signCode.current !== sign) return

                setSwapState((prev) => ({
                    ...prev,
                    route,
                    quote: ethers.BigNumber.from(
                        convertEthersToWei(route?.quote?.toFixed())
                    ),
                    status: SwapStatus.QUOTED,
                }))
            } catch (error) {
                if (signCode.current !== sign) return
                setSwapState((prev) => ({
                    ...prev,
                    status: SwapStatus.TX_FAILED,
                }))
            }
        }, 500),
        [address, web3Provider, chain]
    )

    const executeSwap = useCallback(
        async ({
            tokenIn,
            tokenOut,
            onSwapSuccess,
            gasPrice,
        }: ExecuteSwapParams) => {
            let toastId = toast({
                position: 'top-right',
                status: 'info',
                title: 'Swapping',
                duration: 100000,
            })
            try {
                setSwapState((prev) => ({
                    ...prev,
                    txStatus: SwapStatus?.TX_NEW,
                }))

                const fee = await fetchFeeData({ chainId: chain.id })
                const config = await prepareSendTransaction({
                    chainId: chain.id,
                    data: swapState?.route?.methodParameters?.calldata,
                    to: V3_SWAP_ROUTER_ADDRESS,
                    value: swapState?.route?.methodParameters?.value,
                    from: address,
                    maxFeePerGas: convertGweiToWei(gasPrice)
                        .add(fee.lastBaseFeePerGas || 0)
                        .add(fee.lastBaseFeePerGas || 0),
                    maxPriorityFeePerGas: convertGweiToWei(gasPrice),
                })
                const hash = await sendTransaction(config)
                const res = await waitForTransaction(hash)
                toast.close(toastId)
                toast({
                    position: 'top-right',
                    status: 'success',
                    title: 'Swap successfully',
                })
                onSwapSuccess(tokenIn, tokenOut)
                return res
            } catch (error) {
                console.log('error', error)
                toast.close(toastId)
                toast({
                    position: 'top-right',
                    status: 'error',
                    title: 'Failed to send transaction',
                    description: error?.message?.split('.')?.[0],
                })
                return null
            }
        },
        [swapState, address, sendTransaction, chain]
    )

    return {
        createSwap,
        executeSwap,
        quote: swapState?.quote,
        status: swapState?.status,
    }
}
