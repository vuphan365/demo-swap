import { ethers } from 'ethers'

export const convertWeiToEthers = (num, limit?: number) => {
  const output = ethers.utils.formatEther(num)
  if (limit) {
    return (+output).toFixed(limit)
  }
  return output
}

export const convertEthersToWei = (num) => {
  return ethers.utils.parseUnits(num.toString(), 18)
}

export const convertGweiToWei = (num) => {
  return ethers.utils.parseUnits(num.toString(), 9)
}