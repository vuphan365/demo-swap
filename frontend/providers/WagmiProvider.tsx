'use client'
import React, { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { WagmiConfig, createConfig, Chain } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { wagmiAtom } from '@/utils/ethers'

interface WagmiProvidersParams {
    children: React.ReactNode
}

function ThemeProviders({ children }: WagmiProvidersParams) {
    const { chainId } = useAtomValue(wagmiAtom)

    const config = useMemo(
        () =>
            createConfig({
                autoConnect: true,
                publicClient: createPublicClient({
                    chain: chainId,
                    transport: http(),
                }),
            }),
        [chainId]
    )

    return <WagmiConfig config={config}>{children}</WagmiConfig>
}

export default ThemeProviders
