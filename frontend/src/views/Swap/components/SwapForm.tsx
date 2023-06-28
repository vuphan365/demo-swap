import { useCallback, useEffect, useMemo } from 'react';
import {
  Flex,
  Input,
  Button,
  Heading,
  Text,
  Box,
  InputGroup,
  InputRightElement,
  Spinner,
  FormControl,
  FormErrorMessage
} from '@chakra-ui/react'
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup'
import { Token } from 'types/token'
import TokenSelection from 'components/TokenSelection/TokenSelection'
import { useSwap, SwapStatus } from 'hooks/useSwap'
import { useToken } from 'hooks/useToken'
import { DEFAULT_SWAP_FORM } from 'constant'
import { convertGWeiToWei, convertWeiToGwei } from 'utils'

enum SwapFormField {
  inputToken = 'inputToken',
  inputAmount = 'inputAmount',
  outputToken = 'outputToken',
  outputAmount = 'outputAmount'
}

const validationSchema = yup.object({
  [SwapFormField.inputAmount]: yup.number().when(SwapFormField.inputToken, ([inputToken], schema) => {
    console.log('token', inputToken)
    //@ts-ignore
    return schema.max(Number(convertWeiToGwei(inputToken?.balance?.toString(), 4)), "You can only swap less than you balance").min(0, "Swap value must greater than 0")
  }),
  [SwapFormField.outputAmount]: null,
  [SwapFormField.outputToken]: null,
  [SwapFormField.inputToken]: null,
});

const SwapForm = () => {
  const { register, handleSubmit, formState: { errors, isValid }, trigger, control, watch, setValue } = useForm({
    defaultValues: DEFAULT_SWAP_FORM,
    resolver: yupResolver(validationSchema),
    mode: "onChange"
  });
  const { createSwap, quote: swapQuote, status: swapStatus, executeSwap } = useSwap()
  const { getLatestTokenBalance } = useToken()
  const tokenIn = watch(SwapFormField.inputToken)
  const tokenOut = watch(SwapFormField.outputToken)
  const inputAmount = watch(SwapFormField.inputAmount)
  const isOutputLoading = useMemo(() => swapStatus === SwapStatus.QUOTING, [swapStatus])

  const onSwapSuccess = useCallback(async (tokenIn: Token, tokenOut: Token) => {
    const [newTokenIn, newTokenOut] = await Promise.all([
      getLatestTokenBalance(tokenIn),
      getLatestTokenBalance(tokenOut)
    ])
    setValue(SwapFormField.inputToken, newTokenIn)
    setValue(SwapFormField.outputToken, newTokenOut)
  }, [getLatestTokenBalance])

  const onSubmit = useCallback((values) => {
    executeSwap({
      tokenIn: values?.inputToken,
      tokenOut: values?.outputToken,
      inAmount: convertGWeiToWei(values?.inputAmount),
      onSwapSuccess
    })
  }, [executeSwap])

  useEffect(() => {
    if (tokenIn && tokenOut && inputAmount) {
      createSwap({
        tokenIn,
        tokenOut,
        inAmount: convertGWeiToWei(inputAmount)
      })
    }
  }, [createSwap, inputAmount, tokenIn, tokenOut])

  useEffect(() => {
    if (swapStatus === SwapStatus.QUOTED && swapQuote) {
      setValue(SwapFormField.outputAmount, convertWeiToGwei(swapQuote))
    }
  }, [swapQuote, swapStatus])


  return (
    <Flex bg="white" as="form" padding={6} boxShadow="base" flexDir="column" minW="350px" alignItems="center" justifyContent="center" gap="16px" onSubmit={handleSubmit(onSubmit)} borderRadius="24px">
      <Box width="100%">
        <Heading as="h4" size="md">Swap</Heading>
        <Text fontSize="sm" mt="2">Trade tokens in an instant</Text>
      </Box>
      <Flex flexDir="column" gap="8px" w="100%">
        <Controller
          name={SwapFormField.inputToken}
          control={control}
          render={({ field: { onChange, value } }) =>
            <TokenSelection
              value={value}
              onChange={onChange}
              disabledToken={watch(SwapFormField.outputToken)}
            />}
        />
        <FormControl isInvalid={Boolean(errors?.inputAmount)}>
          <Input
            // isDisabled={!tokenIn}
            max={tokenIn && Number(convertWeiToGwei(tokenIn?.balance?.toString(), 4))}
            type='number'
            {...register(SwapFormField.inputAmount)}
            _disabled={{
              bg: 'gray.100'
            }}
          />
          <FormErrorMessage>{errors?.inputAmount?.message as String}</FormErrorMessage>
        </FormControl>
      </Flex>
      <Flex flexDir="column" gap="8px" w="100%">
        <Controller
          name={SwapFormField.outputToken}
          control={control}
          render={({ field: { onChange, value } }) => <TokenSelection value={value} onChange={onChange} disabledToken={watch(SwapFormField.inputToken)} />}
        />
        <InputGroup>
          <Input
            isDisabled={true}
            {...register(SwapFormField.outputAmount)}
            _disabled={{
              bg: 'gray.100'
            }}
          />
          {isOutputLoading && (
            <InputRightElement>
              <Spinner />
            </InputRightElement>
          )}
        </InputGroup>
      </Flex>
      <Button
        w="100%"
        isDisabled={!swapQuote || !isValid}
        colorScheme='blue'
        type="submit"
      >Swap</Button>
    </Flex>
  )
}

export default SwapForm