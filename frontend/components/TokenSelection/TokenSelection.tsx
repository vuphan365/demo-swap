import { FC, useCallback, useMemo, useState } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import type { Token } from '@/types/token'
import TokenSearchModal from './TokenSearchModal'
import { convertWeiToEthers } from '@/utils'
interface TokenSelectionParams {
  value: Token,
  disabledToken?: Token,
  onChange: (val: Token) => void
}

const TokenSelection: FC<TokenSelectionParams> = ({ value, onChange, disabledToken }) => {
  const [searchVisible, setSearchVisible] = useState(false)

  const buttonContent = useMemo(() => {
    if (!value?.symbol) return "Select"
    return value?.symbol
  }, [value])

  const onSetToken = useCallback((token?: Token) => {
    if (token) {
      onChange(token)
    }
    setSearchVisible(false)
  }, [])

  const onOpenSelectToken = useCallback(() => {
    setSearchVisible(true)
  }, [])


  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Button variant='ghost' alignItems="center" p={0} rightIcon={<ChevronDownIcon marginInlineStart="4px" pt="4px" />} onClick={onOpenSelectToken}>
        {buttonContent}
      </Button>
      <Text fontSize="xs">Balance: {value?.balance ? convertWeiToEthers(value?.balance?.toString(), 4) : 0}</Text>
      <TokenSearchModal isOpen={searchVisible} defaultToken={value?.symbol} onClose={onSetToken} disabledTokenAddress={disabledToken?.address} />
    </Flex>
  )
}

export default TokenSelection