import { atom, useAtomValue } from 'jotai'
import { Chain } from 'wagmi'
import { goerli } from 'wagmi/chains'

interface WagmiAtom {
  chainId?: Chain
}

export const wagmiAtom = atom<WagmiAtom>({
  chainId: goerli
})

export const useWagmiAtom = () => useAtomValue(wagmiAtom)