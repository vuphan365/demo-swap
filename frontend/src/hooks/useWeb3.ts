import { ethers, BigNumber } from "ethers";
import { atom, useAtom } from 'jotai'
import { useCallback } from "react";

const web3Atom = atom({
  provider: null
})

export function useWeb3() {
  const [web3, setWeb3] = useAtom(web3Atom)

  const initWeb3Provider = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider)
    setWeb3({
      provider
    })
    return provider
  }

  const getWeb3Provider = useCallback(() => {
    if (!web3?.provider) return initWeb3Provider()
    return web3.provider
  }, [web3?.provider])

  const sendTransaction = useCallback(async (transaction: ethers.providers.TransactionRequest) => {
    // if (transaction.value) {
    //   transaction.value = BigNumber.from(transaction.value)
    // }
    console.log('transaction', transaction)
    const txRes = await getWeb3Provider().getSigner(0).sendTransaction(transaction)
    let receipt = null
    console.log(' txRes', txRes)
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