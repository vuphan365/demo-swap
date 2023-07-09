"use client"
import { Box, Flex, Button } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import ConnectWallet from './ConnectWallet'
import AccountSetting from './AccountSetting'

const Header = () => {
  const { isConnected } = useAccount()
  return (
    <Flex justifyContent="flex-end" px="4" py="2" boxShadow='lg'>
      <Flex>
        {isConnected ? <AccountSetting /> : <ConnectWallet />}
      </Flex>
    </Flex>
  )
}

export default Header;