import { useEffect } from 'react'
import { useWallet } from './useWallet'
// import { useToken } from './useToken'
import { useWeb3 } from './useWeb3'

export function useInitDapp() {
  const { connectWallet } = useWallet()
  // const { token, initContractToken, onStartCheckBalance, onStopCheckBalance } = useToken()
  const { initWeb3Provider } = useWeb3()

  const onAccountChange = async () => {
    await connectWallet()
  }

  const onInitApp = async () => {
    await onAccountChange()
    initWeb3Provider()
    window?.ethereum?.on?.('accountsChanged', async () => {
      connectWallet()
    });
  }

  useEffect(() => {
    onInitApp()
    window?.ethereum?.on?.('accountsChanged', onAccountChange);
    window?.ethereum?.on?.('chainChanged', () => window.location.reload());
    return () => {
      window?.ethereum?.removeListener?.('accountsChanged', onAccountChange);
    }
  }, [])

  // useEffect(() => {
  //   if (web3?.provider) {
  //     initContractToken(web3?.provider?.getSigner(0))
  //   }
  // }, [web3?.provider])

  // useEffect(() => {
  //   if (wallet?.address && token?.contract) {
  //     onStartCheckBalance(wallet?.address)
  //   }
  //   return () => {
  //     onStopCheckBalance()
  //   }
  // }, [wallet?.address, token?.contract])


  return {}
}