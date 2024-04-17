import { atom, useAtomValue } from 'jotai'
import { Chain } from 'wagmi'
import { bsc } from 'wagmi/chains'

interface WagmiAtom {
    chainId?: Chain
}

export const wagmiAtom = atom<WagmiAtom>({
    chainId: bsc,
})

export const useWagmiAtom = () => useAtomValue(wagmiAtom)
