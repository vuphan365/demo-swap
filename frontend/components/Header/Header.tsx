"use client"
import { Box, Flex, Button } from '@chakra-ui/react'
import { useWallet } from '@/hooks/useWallet'
import ConnectWallet from '@/components/ConnectWallets/ConnectWallet'
import AccountSetting from './AccountSetting'

const Header = () => {
  const { wallet } = useWallet()
  console.log('wallet', wallet.address)
  return (
    <Flex justifyContent="flex-end" px="4" py="2" boxShadow='lg'>
      <Flex>
        {wallet?.address ? <AccountSetting /> : <ConnectWallet />}
      </Flex>
    </Flex>
  )
}

export default Header;