import { ethers, BigNumber } from "ethers";
import { useToast } from '@chakra-ui/react'
import { atom, useAtom } from 'jotai'
import { useCallback } from "react";

const web3Atom = atom({
  provider: null
})

export function useWeb3() {
  const toast = useToast()
  const [web3, setWeb3] = useAtom(web3Atom)

  const initWeb3Provider = async () => {
    if (!window?.ethereum) {
      toast({
        position: 'top-right',
        status: "error",
        title: "Please install wallet first",
        duration: 5000,
      })
      return null
    }
    const provider = new ethers.providers.Web3Provider(window?.ethereum as ethers.providers.ExternalProvider)
    setWeb3({
      provider
    })
    return provider
  }

  const getWeb3Provider = useCallback(() => {
    if (!window?.ethereum) {
      return null
    }
    if (!web3?.provider) return initWeb3Provider()
    return web3.provider
  }, [web3?.provider])

  const sendTransaction = useCallback(async (transaction: ethers.providers.TransactionRequest) => {
    // if (transaction.value) {
    //   transaction.value = BigNumber.from(transaction.value)
    // }
    const txRes = await getWeb3Provider().getSigner(0).sendTransaction(transaction)
    let receipt = null
    while (receipt === null) {
      try {
        receipt = await getWeb3Provider().getTransactionReceipt(txRes.hash)

        if (receipt === null) {
          continue
        }
      } catch (e) {
        console.log(`Receipt error:`, e)
        throw e
      }
    }
  }, [getWeb3Provider])

  return {
    web3,
    initWeb3Provider,
    getWeb3Provider,
    sendTransaction
  }
}