
import { useCallback } from 'react'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json'
import { computePoolAddress, FeeAmount, Pool } from '@uniswap/v3-sdk'
import { POOL_FACTORY_CONTRACT_ADDRESS } from 'constant'
import { Token } from 'types/token'
import { useWeb3 } from './useWeb3'
import { ethers } from 'ethers'

export type GetPoolInfoParams = {
  tokenIn: Token,
  tokenOut: Token,
}
export const usePool = () => {
  const { getWeb3Provider } = useWeb3()

  const getPoolInfo = useCallback(async ({ tokenIn, tokenOut }: GetPoolInfoParams) => {
    if (!getWeb3Provider()) return
    console.log({
      tokenIn,
      tokenOut
    })
    const poolAddress = computePoolAddress({
      factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
      tokenA: tokenIn,
      tokenB: tokenOut,
      fee: FeeAmount.MEDIUM
    })
    console.log('poolAddress', poolAddress)
    console.log('IUniswapV3PoolABI', IUniswapV3PoolABI)
    const poolContract = new ethers.Contract(
      poolAddress,
      IUniswapV3PoolABI.abi as any,
      getWeb3Provider()
    )

    const [token0, token1, fee, tickSpacing, liquidity, slot0] =
      await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.tickSpacing(),
        poolContract.liquidity(),
        poolContract.slot0(),
      ])

    const pool = new Pool(
      tokenIn,
      tokenOut,
      FeeAmount.MEDIUM,
      slot0[0].toString(),
      liquidity,
      slot0[1]
    )
    return pool
  }, [getWeb3Provider])

  return {
    getPoolInfo
  }
}
