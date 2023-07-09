import { useEffect, useState } from 'react'
import { atom, useAtom } from 'jotai'
import type { Token } from '@/types/token'
import { Token as SDKToken } from '@uniswap/sdk-core'
import {
  ChainId,
} from '@uniswap/smart-order-router'
import { useAccount, erc20ABI } from 'wagmi'
import { getContract } from '@wagmi/core'
import { DEFAULT_TOKEN_SELECTION } from '@/constant'

interface TokenSelectionValues {
  tokenList: Array<Token>
}

const tokenSelectionAtom = atom<TokenSelectionValues>({
  tokenList: []
})

export function useTokenSelection() {
  const [isLoading, setIsLoading] = useState(false)
  const [tokenSelection, setTokenList] = useAtom(tokenSelectionAtom)
  const { address } = useAccount()

  const onGetToken = async (tokenAddress: string, address: string): Promise<Token> => {
    try {
      const tokenContract = getContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20ABI,
      })
      const [name, balance, symbol] = await Promise.all([
        tokenContract?.read?.name(),
        tokenContract?.read?.balanceOf([address]),
        tokenContract?.read?.symbol()
      ])
      const sdkToken = new SDKToken(
        ChainId.GÖRLI,
        tokenAddress,
        18,
        symbol,
        name
      ) as Token;
      sdkToken.balance = balance
      sdkToken.contract = tokenContract
      return sdkToken
    }
    catch (e) {
      console.log('e', e)
      return null
    }
  }
  const initTokenSelection = async (address: string) => {
    try {
      setIsLoading(true)
      const promise = DEFAULT_TOKEN_SELECTION.map((tokenAddress) => onGetToken(tokenAddress, address))
      const list = await Promise.all(promise)
      setTokenList({ tokenList: list.filter(token => !!token) })
    } catch (error) {
      console.log('error', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSelectToken = async (tokenAddress) => {
    if (tokenSelection?.tokenList?.find((_token) => _token?.address === tokenAddress)) return
    setIsLoading(true)
    const token = await onGetToken(tokenAddress, address)
    if (token) {
      setTokenList(prev => ({
        ...prev,
        tokenList: [token, ...prev?.tokenList]
      }))
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (address) {
      initTokenSelection(address)
    }
  }, [address])

  return {
    tokenList: tokenSelection?.tokenList,
    onSelectToken,
    isLoading,
  }
}