import { useCallback } from 'react'
import { Token } from '@/types/token'
import { Token as SDKToken } from '@uniswap/sdk-core'
import { useWallet } from './useWallet'
import {
  ChainId,
} from '@uniswap/smart-order-router'

export function useToken() {
  const { getWalletAddress } = useWallet()

  const getLatestTokenBalance = useCallback(async (token: Token) => {
    if (!token) return
    const address = await getWalletAddress()
    const balance = await token?.contract?.balanceOf(address)
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
  }, [getWalletAddress])

  return {
    getLatestTokenBalance
  }
}