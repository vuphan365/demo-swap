import React, { FC } from 'react'
import {
  Flex,
  Button,
  useBoolean,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Heading,
  ButtonGroup,
  useColorModeValue,
  Input,
  InputRightElement,
  InputGroup,
  FormControl,
  FormErrorMessage
} from '@chakra-ui/react'
import { type Control, Controller } from 'react-hook-form'
import { SettingsIcon } from '@chakra-ui/icons'
import { SwapFormField } from '@/types/swap'

interface SwapSettingParams {
  control: Control<any, any>
}

const buttonProps = {
  colorScheme: 'linkedin',
  variant: 'outline',
  borderRadius: "16px",
  // pb: '2px'
}

enum GasPrice {
  default = 2,
  standard = 3,
  fast = 4,
  instant = 5
}

const GasPriceOptions = [{
  name: 'Default',
  value: GasPrice.default
}, {
  name: 'Standard',
  value: GasPrice.standard
}, {
  name: 'Fast',
  value: GasPrice.fast
}, {
  name: 'Instant',
  value: GasPrice.instant
}]

const SlippageRate = [0.001, 0.005, 0.01]

const SwapSetting: FC<SwapSettingParams> = ({ control }) => {
  const bg = useColorModeValue("white", "gray.800")
  const [settingVisible, setSettingVisible] = useBoolean(false)
  return (
    <Flex w="100%" justifyContent="flex-end">
      <Button
        minW="initial"
        w="24px"
        height="24px"
        variant="ghost"
        padding={0}
        leftIcon={<SettingsIcon boxSize="18px" marginRight={0} />}
        onClick={setSettingVisible.on}
      />
      <Modal isCentered isOpen={settingVisible} onClose={setSettingVisible.off}>
        <ModalOverlay />
        <ModalContent borderRadius="16px" bg={bg} >
          <ModalHeader>Swap Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody px={6} pb={6} pt={2}>
            <Flex flexDir="column">
              <Heading size="sm">Default Transaction Speed (GWEI)</Heading >
              <Controller
                control={control}
                name={SwapFormField.gasPrice}
                render={({ field: { onChange, value } }) => (
                  <ButtonGroup mt={4} borderRadius={6}>
                    {GasPriceOptions.map(({ name, value: _value }) => (
                      <Button {...buttonProps} key={`gas-price-${_value}`} variant={value === _value ? 'solid' : buttonProps.variant} onClick={() => onChange(_value)}>{name} ({_value})</Button>
                    ))}
                  </ButtonGroup>
                )}
              />

            </Flex>
            <Flex flexDir="column" mt={6}>
              <Heading size="sm">Slippage Tolerance</Heading >
              <Controller
                control={control}
                name={SwapFormField.slippage}
                render={({ field: { onChange, value }, formState }) => (
                  <FormControl isInvalid={Boolean(formState?.errors?.slippage)}>
                    <ButtonGroup mt={4} borderRadius={6}>
                      {SlippageRate.map((rate) => (
                        <Button {...buttonProps} key={`slippage-rate-${rate}`} variant={value === rate ? 'solid' : buttonProps.variant} onClick={() => onChange(rate)} >{(rate * 100).toFixed(1)}%</Button>
                      ))}
                      {/* <Button {...buttonProps}>Custom</Button> */}
                      <InputGroup width="120px" {...buttonProps} fontWeight={800}>
                        <Input {...buttonProps} placeholder='Custom' type="number" onChange={e => onChange(Number(e.target.value) / 100)} />
                        <InputRightElement>
                          %
                        </InputRightElement>
                      </InputGroup>
                    </ButtonGroup>
                    <FormErrorMessage>{formState?.errors?.slippage?.message as string}</FormErrorMessage>
                  </FormControl>
                )}
              />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default SwapSetting
