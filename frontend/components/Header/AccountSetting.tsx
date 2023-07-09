import { useMemo } from 'react'
import { Box, Flex, Button, Heading } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useAccount, useDisconnect } from 'wagmi'

const AccountSetting = () => {
  const { disconnect } = useDisconnect()
  const { address } = useAccount()
  const shortenAddress = useMemo(() => {
    if (!address) return ''
    return `${address?.slice(0, 4)}...${address.slice(address?.length - 4)}`
  }, [address])

  return (
    <Button rightIcon={<ExternalLinkIcon />} colorScheme='blue' onClick={() => disconnect()} borderRadius="16px" px={6}>
      <Heading as="h5" size="sm">
        {shortenAddress}
      </Heading>
    </Button>
  )
}

export default AccountSetting;