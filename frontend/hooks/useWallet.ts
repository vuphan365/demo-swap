import { atom, useAtom } from 'jotai'
import { useNetwork } from './useNetwork'
import { useCallback } from 'react'

const walletAtom = atom({
  address: null,
})

export function useWallet() {
  const [wallet, setWallet] = useAtom(walletAtom)
  const { checkNetwork } = useNetwork()

  const connectWallet = async () => {
    // get first account
    await checkNetwork()
    const values = await window?.ethereum?.request({ method: 'eth_requestAccounts' });
    if (!values) return ""
    if (Array.isArray(values) && values.length > 0) {
      setWallet({
        address: values[0]
      })
    }
    return values[0]
  }

  const disconnectWallet = async () => {
    // get first account
    const values = await window?.ethereum?.request({ method: 'eth_requestAccounts', params: [{ eth_accounts: {} }] });
    setWallet({ address: null })
  }

  const getWalletAddress = useCallback(async () => {
    if (!wallet?.address) {
      const address = await connectWallet()
      return address
    }
    return wallet?.address
  }, [wallet?.address])

  return {
    connectWallet,
    disconnectWallet,
    wallet,
    getWalletAddress
  }
}