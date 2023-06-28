import { ethers } from 'ethers'
import { Token as SwapToken } from '@uniswap/sdk-core'

export interface Token extends SwapToken {
  contract?: ethers.Contract,
  balance?: ethers.BigNumber,
}