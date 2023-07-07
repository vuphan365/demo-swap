import { useMemo } from 'react'
import { Box, Flex, Button, Heading } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useWallet } from 'hooks/useWallet'

const AccountSetting = () => {
  const { wallet, disconnectWallet } = useWallet()

  const shortenAddress = useMemo(() => {
    if (!wallet?.address) return ''
    return `${wallet.address.slice(0, 4)}...${wallet.address.slice(wallet.address.length - 4)}`
  }, [wallet?.address])

  return (
    <Button rightIcon={<ExternalLinkIcon />} colorScheme='blue' onClick={disconnectWallet} borderRadius="16px" px={6}>
      <Heading as="h5" size="sm">
        {shortenAddress}
      </Heading>
    </Button>
  )
}

export default AccountSetting;