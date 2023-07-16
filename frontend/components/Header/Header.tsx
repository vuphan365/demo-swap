"use client"
import { Box, Flex, Button, useColorMode } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { useAccount } from 'wagmi'
import ConnectWallet from './ConnectWallet'
import AccountSetting from './AccountSetting'

const Header = () => {
  const { isConnected } = useAccount()
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Flex justifyContent="flex-end" px="4" py="2" boxShadow='lg'>
      <Flex gap="12px">
        {isConnected ? <AccountSetting /> : <ConnectWallet />}
        <Button onClick={toggleColorMode}>
          {colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
        </Button>
      </Flex>
    </Flex>
  )
}

export default Header;