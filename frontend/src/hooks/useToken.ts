import { useCallback } from 'react'
import { ethers } from "ethers";
import { atom, useAtom } from 'jotai'
import { Token } from 'types/token'
//@ts-ignore
import TokenArtifact from "contracts/Token.json";
//@ts-ignore
import contractAddress from "contracts/contract-address.json";

export interface TokenValues extends Partial<Token> {
  balanceIntervalRef?: NodeJS.Timer
}
const tokenAtom = atom<TokenValues>({
  address: null,
  contract: null,
  balance: null,
  name: null,
  symbol: null,
  balanceIntervalRef: null
})

export function useToken() {
  const [token, setToken] = useAtom(tokenAtom)

  const initContractToken = async (signer: any) => {
    const tokenContract = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      signer
    );
    const name = await tokenContract?.name()
    const symbol = await tokenContract?.symbol()
    setToken(prev => ({
      ...prev,
      address: contractAddress.Token,
      contract: tokenContract,
      name,
      symbol
    }))
  }

  const onCheckBalance = useCallback(async (address: string) => {
    if (!token?.contract) return
    console.log('token?.contract', token?.contract?.name())

    const balance = await token?.contract?.balanceOf(address)
    console.log('token?.contract?.balanceOf', balance.toString())
    setToken(prev => ({
      ...prev,
      balance
    }))
  }, [token?.contract])

  const onStopCheckBalance = () => {
    // clearInterval(token?.balanceIntervalRef)
    // setToken(prev => ({
    //   ...prev,
    //   balanceIntervalRef: null
    // }))
  }

  const onStartCheckBalance = (address) => {
    onStopCheckBalance()
    onCheckBalance(address)
    // const timer = setInterval(() => onCheckBalance(address), 2000)
    // setToken(prev => ({
    //   ...prev,
    //   balanceIntervalRef: timer
    // }))
  }


  return {
    initContractToken,
    token,
    onStartCheckBalance,
    onStopCheckBalance
  }
}