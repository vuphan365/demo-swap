import { ethers } from 'ethers'

export const convertWeiToGwei = (num, limit?: number) => {
  const output = ethers.utils.formatEther(num)
  if (limit) {
    return (+output).toFixed(limit)
  }
  return output
}

export const convertGWeiToWei = (num) => {
  return ethers.utils.parseUnits(num.toString(), 18)
}