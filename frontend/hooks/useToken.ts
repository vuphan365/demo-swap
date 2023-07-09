import { useCallback } from 'react'
import { Token } from '@/types/token'
import { Token as SDKToken } from '@uniswap/sdk-core'
import { useAccount } from 'wagmi'
import {
  ChainId,
} from '@uniswap/smart-order-router'

export function useToken() {
  const { address } = useAccount()

  const getLatestTokenBalance = useCallback(async (token: Token) => {
    if (!token) return
    const balance = await token?.contract?.read?.balanceOf([address])
    const newToken = new SDKToken(
      ChainId.GÖRLI,
      token.address,
      18,
      token.symbol,
      token.name
    ) as Token
    newToken.balance = balance;
    newToken.contract = token?.contract
    return newToken
  }, [address])

  return {
    getLatestTokenBalance
  }
}