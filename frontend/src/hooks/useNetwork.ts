import { atom, useAtom } from 'jotai'
import { GOERLI_NETWORK_ID } from 'constant'
// This is the default id used by the Hardhat Network

const networkAtom = atom({
  chainId: GOERLI_NETWORK_ID,
  error: null
})

export function useNetwork() {
  const [network, setNetwork] = useAtom(networkAtom)

  const connectNetwork = async () => {
    await window.ethereum.request({

      method: "wallet_switchEthereumChain",
      params: [{ chainId: network.chainId }],
    });
  }

  const checkNetwork = async () => {
    if (window.ethereum.networkVersion !== network.chainId) {
      await connectNetwork();
    }
  }

  const onSetNetworkError = (_error) => {
    setNetwork((prev) => ({
      ...prev,
      error: _error
    }))
  }

  return {
    network,
    checkNetwork,
    connectNetwork,
    onSetNetworkError
  }
}