import { type PublicClient, usePublicClient, useNetwork } from 'wagmi'
import * as React from 'react'
import { providers } from 'ethers'
import { type HttpTransport } from 'viem'

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    )
  return new providers.JsonRpcProvider(transport.url, network)
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider() {
  const { chain } = useNetwork()
  const publicClient = usePublicClient({ chainId: chain.id })
  return React.useMemo(() => publicClientToProvider(publicClient), [publicClient])
}

export function useWeb3Provider() {
  if (typeof window === 'undefined') return null
  // @ts-ignore
  return React.useMemo(() => new providers.Web3Provider(window?.ethereum), [])
}