"use client"
import { Box, Flex, Button, Heading } from '@chakra-ui/react'
import { LinkIcon } from '@chakra-ui/icons'
import { useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useEffect } from 'react'

const ConnectWallet = () => {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

  return (
    <Button leftIcon={<LinkIcon />} colorScheme='blue' onClick={() => connect()} borderRadius="16px" px={6}>
      <Heading as="h5" size="sm">
        Connect Wallet
      </Heading>
    </Button>
  )
}

export default ConnectWallet;