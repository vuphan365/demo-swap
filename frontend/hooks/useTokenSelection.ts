import { useCallback, useEffect, useState } from 'react'
import { ethers } from "ethers";
import { atom, useAtom } from 'jotai'
import type { Token } from '@/types/token'
import { Token as SDKToken } from '@uniswap/sdk-core'
import {
  ChainId,
} from '@uniswap/smart-order-router'
import { useWeb3 } from './useWeb3'
import { useWallet } from './useWallet'
import { DEFAULT_TOKEN_SELECTION, ERC20_ABI } from '@/constant'

interface TokenSelectionValues {
  tokenList: Array<Token>
}
const tokenSelectionAtom = atom<TokenSelectionValues>({
  tokenList: []
})

export function useTokenSelection() {
  const [isLoading, setIsLoading] = useState(false)
  const [tokenSelection, setTokenList] = useAtom(tokenSelectionAtom)
  const { wallet, getWalletAddress } = useWallet()
  const { getWeb3Provider } = useWeb3()

  const onGetToken = async (signer: any, tokenAddress: string, address: string): Promise<Token> => {
    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        signer
      );
      const name = await tokenContract?.name()
      const balance = await tokenContract?.balanceOf(address)
      const symbol = await tokenContract?.symbol()
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
  const initTokenSelection = async (signer: any, address: string) => {
    try {
      setIsLoading(true)
      const promise = DEFAULT_TOKEN_SELECTION.map((tokenAddress) => onGetToken(signer, tokenAddress, address))
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
    const address = await getWalletAddress()
    const token = await onGetToken(getWeb3Provider().getSigner(0), tokenAddress, address)
    if (token) {
      setTokenList(prev => ({
        ...prev,
        tokenList: [token, ...prev?.tokenList]
      }))
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (getWeb3Provider()?._isProvider && wallet?.address) {
      initTokenSelection(getWeb3Provider().getSigner(0), wallet?.address)
    }
  }, [getWeb3Provider, wallet?.address])


  return {
    tokenList: tokenSelection?.tokenList,
    onSelectToken,
    isLoading,
  }
}