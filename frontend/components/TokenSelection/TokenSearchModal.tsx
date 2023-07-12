import { FC, useState, useMemo } from 'react'
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalOverlay,
  Flex,
  Input,
  Text,
  Button,
  Box,
  Spinner,
  useColorModeValue
} from '@chakra-ui/react'
import { MoonIcon } from '@chakra-ui/icons'
import { TOKEN_ADDRESS_LENGTH } from '@/constant'
import { convertWeiToEthers } from '@/utils'
import { Token } from '@/types/token'
import { useTokenSelection } from '@/hooks/useTokenSelection'

interface TokenSearchModalParams {
  isOpen: boolean,
  onClose: (token?: Token) => void,
  disabledTokenAddress?: string,
  defaultToken: string
}

const TokenSearchModal: FC<TokenSearchModalParams> = ({ isOpen, onClose, defaultToken, disabledTokenAddress }) => {
  const { tokenList, onSelectToken, isLoading } = useTokenSelection()
  const [currentToken, setCurrentToken] = useState(defaultToken || "")
  const modalBg = useColorModeValue("white", "gray.800")

  const onChangeCurrentToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value
    setCurrentToken(value)
    if (value.length === TOKEN_ADDRESS_LENGTH) {
      onSelectToken(value)
    }
  }
  const _tokenList = useMemo(() => {
    const _filterList = []
    const _remainList = []
    tokenList.forEach((_token) => {
      if (
        _token?.name?.toLowerCase().indexOf(currentToken?.toLowerCase()) > -1 ||
        _token?.address?.toLowerCase().indexOf(currentToken?.toLowerCase()) > -1
      ) {
        _filterList.push(_token)
      } else {
        _remainList.push(_token)
      }
    })
    return [..._filterList, ..._remainList]
  }, [tokenList, currentToken])

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered >
      <ModalOverlay />
      <ModalContent bg={modalBg}>
        <ModalHeader>Select a Token </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="24px">
          <Flex flexDir="column" width="100%" gap="12px">
            <Input placeholder='Search name or paste address' value={currentToken} onChange={onChangeCurrentToken} />
            <Text fontSize="xs">Common Tokens</Text>
            <Flex justifyContent="center" display={isLoading ? "flex" : "none"}><Spinner /></Flex>
            {_tokenList.map((token) => (
              <Button
                px="0"
                key={token?.address}
                w="100%"
                leftIcon={<MoonIcon />}
                variant="ghost"
                onClick={() => onClose(token)}
                isDisabled={token?.address === disabledTokenAddress}
              >
                <Flex w="100%" justifyContent="space-between" alignItems="center">
                  <Box textAlign="left">
                    <Text fontSize="md" textTransform="uppercase" fontWeight="bold">{token?.symbol}</Text>
                    <Text fontSize="xs" mt="4px">{token?.name}</Text>
                  </Box>
                  <Text fontSize="md">{convertWeiToEthers(token?.balance?.toString(), 4)}</Text>
                </Flex>
              </Button>
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal >
  )
}

export default TokenSearchModal