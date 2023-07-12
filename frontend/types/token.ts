import { ethers } from 'ethers'
import { Token as SwapToken } from '@uniswap/sdk-core'

export interface Token extends SwapToken {
  contract?: ethers.Contract,
  balance?: ethers.BigNumber,
}

export interface SwapFormParams {
  outputToken: Token | null,
  inputAmount: number | string | null,
  inputToken: Token | null,
  outputAmount: number | string | null,
  gasPrice?: number,
  slippage?: number
}