import { Box, Flex, Button, Heading } from '@chakra-ui/react'
import { LinkIcon } from '@chakra-ui/icons'
import { useWallet } from 'hooks/useWallet'

const ConnectWallet = () => {
  const { wallet, connectWallet } = useWallet()
  return (
    <Button leftIcon={<LinkIcon />} colorScheme='blue' onClick={connectWallet} borderRadius="16px" px={6}>
      <Heading as="h5" size="sm">
        Connect Wallet
      </Heading>
    </Button>
  )
}

export default ConnectWallet;