import { useCallback, useRef, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { ethers } from 'ethers'
import debounce from 'lodash/debounce'
import { waitForTransaction } from '@wagmi/core'
import { useAccount } from 'wagmi'
import type { Token } from '@/types/token'
import {
  ERC20_ABI,
  V3_SWAP_ROUTER_ADDRESS,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
} from '@/constant'
import { useWeb3Provider } from './useEthers'
import { BigNumber } from 'ethers'

type ApproveParams = {
  token: Token,
  amount: BigNumber
}

export enum ApproveStatus {
  LOADING = 'LOADING',
  UNAPPROVED = 'UNAPPROVED',
  APPROVED = 'APPROVED'
}


export const useApprove = () => {
  const [approveStatus, setApproveStatus] = useState<ApproveStatus>(ApproveStatus.UNAPPROVED)
  const { address } = useAccount()
  const toast = useToast()
  const web3Provider = useWeb3Provider()

  const onCheckTokenApprove = useCallback(debounce(async ({ token, amount }: ApproveParams) => {
    try {
      if (!token.contract) return
      // @ts-ignore
      const allowance = await token.contract.read.allowance([
        address,
        V3_SWAP_ROUTER_ADDRESS,
      ])
      setApproveStatus(amount.lte(allowance) ? ApproveStatus.APPROVED : ApproveStatus.UNAPPROVED)
    } catch (error) {
      console.log('error', error)
      setApproveStatus(ApproveStatus.UNAPPROVED)
    }
  }, 500), [web3Provider, address])

  const onApproveToken = useCallback(async (token: Token) => {
    await setApproveStatus(ApproveStatus.LOADING)
    let toastId = toast({
      position: 'top-right',
      status: "info",
      title: "Approving",
      duration: 100000
    })
    try {
      const tokenContract = new ethers.Contract(
        token?.address,
        ERC20_ABI,
        web3Provider
      )
      const unsignedTransaction = await tokenContract.populateTransaction.approve(
        V3_SWAP_ROUTER_ADDRESS,
        BigNumber.from(TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER)
      )
      const hash = await web3Provider.getSigner(0).sendUncheckedTransaction(unsignedTransaction)
      // @ts-ignore
      const res = await waitForTransaction({ hash })
      console.log('approve', res)
      if (res?.status !== "success") {
        throw new Error("Failed to approve")
      }
      toast.close(toastId)
      toast({
        position: 'top-right',
        status: "success",
        title: "Approve successfully",
      })
      setApproveStatus(ApproveStatus.APPROVED)
      return true
    } catch (error) {
      console.log('error', error)
      toast.close(toastId)
      toast({
        position: 'top-right',
        status: "error",
        title: "Failed to approve",
        description: error?.message?.length < 30 && error?.message
      })
      setApproveStatus(ApproveStatus.UNAPPROVED)
      return false
    }
  }, [web3Provider, address])


  return {
    onCheckTokenApprove,
    approveStatus,
    onApproveToken
  }
}