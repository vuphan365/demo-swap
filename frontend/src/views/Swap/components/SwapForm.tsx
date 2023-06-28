import { Flex, Input, Button, Heading, Text, Box, InputGroup, InputRightElement, Spinner } from '@chakra-ui/react'
import { useForm, Controller } from "react-hook-form";
import TokenSelection from 'components/TokenSelection/TokenSelection'
import { useSwap, SwapStatus } from 'hooks/useSwap'
import debounce from 'lodash/debounce'
import { DEFAULT_SWAP_FORM } from 'constant'
import { useCallback, useEffect, useMemo } from 'react';
import { convertGWeiToWei, convertWeiToGwei } from 'utils'

enum SwapFormField {
  inputToken = 'inputToken',
  inputAmount = 'inputAmount',
  outputToken = 'outputToken',
  outputAmount = 'outputAmount'
}

const SwapForm = () => {
  const { register, handleSubmit, formState: { errors }, control, watch, setValue } = useForm({
    defaultValues: DEFAULT_SWAP_FORM
  });
  const { createTrade, quote: swapQuote, status: swapStatus, executeSwap } = useSwap()


  const tokenIn = watch(SwapFormField.inputToken)
  const tokenOut = watch(SwapFormField.outputToken)
  const inputAmount = watch(SwapFormField.inputAmount)
  const isDisabledOutputAmount = useMemo(() => swapStatus === SwapStatus.QUOTING, [swapStatus])

  const onSubmit = useCallback((values) => {
    console.log('submit')
    executeSwap({
      tokenIn: values?.inputToken,
      tokenOut: values?.outputToken,
      inAmount: convertGWeiToWei(values?.inputAmount)
    })
  }, [executeSwap])

  useEffect(() => {
    if (tokenIn && tokenOut && inputAmount) {
      createTrade({ tokenIn, tokenOut, inAmount: convertGWeiToWei(inputAmount) })
    }
  }, [createTrade, inputAmount])

  useEffect(() => {
    if (swapStatus === SwapStatus.QUOTED && swapQuote) {
      setValue(SwapFormField.outputAmount, convertWeiToGwei(swapQuote))
    }
  }, [swapQuote, swapStatus])

  return (
    <Flex as="form" padding={4} boxShadow="base" flexDir="column" minW="350px" alignItems="center" justifyContent="center" gap="16px" onSubmit={handleSubmit(onSubmit)} borderRadius="24px">
      <Box width="100%">
        <Heading as="h6" size="sm">Swap</Heading>
        <Text fontSize="xs">Trade tokens in an instant</Text>
      </Box>
      <Flex flexDir="column" gap="8px" w="100%">
        <Controller
          name={SwapFormField.inputToken}
          control={control}
          render={({ field: { onChange, value } }) => <TokenSelection value={value} onChange={onChange} disabledToken={watch(SwapFormField.outputToken)} />}
        />

        <Input {...register(SwapFormField.inputAmount)} />
      </Flex>
      <Flex flexDir="column" gap="8px" w="100%">
        <Controller
          name={SwapFormField.outputToken}
          control={control}
          render={({ field: { onChange, value } }) => <TokenSelection value={value} onChange={onChange} disabledToken={watch(SwapFormField.inputToken)} />}
        />
        <InputGroup>
          <Input
            isDisabled={isDisabledOutputAmount}
            {...register(SwapFormField.outputAmount)}
          />
          {isDisabledOutputAmount && (
            <InputRightElement>
              <Spinner />
            </InputRightElement>
          )}
        </InputGroup>
      </Flex>
      <Button type="submit">Swap</Button>
    </Flex>
  )
}

export default SwapForm