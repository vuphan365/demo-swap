"use client"
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
  FormErrorMessage,
  useColorModeValue,
} from '@chakra-ui/react'
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup'
import { Token } from '@/types/token'
import { SwapFormField } from '@/types/swap'
import TokenSelection from '@/components/TokenSelection/TokenSelection'
import { useSwap, SwapStatus } from '@/hooks/useSwap'
import { useSSRColor } from '@/hooks/useSSRColor'
import { useApprove, ApproveStatus } from '@/hooks/useApprove'
import { useToken } from '@/hooks/useToken'
import { DEFAULT_SWAP_FORM } from '@/constant'
import { convertEthersToWei, convertWeiToEthers } from '@/utils'
import SwapSetting from './SwapSettings';

const validationSchema = yup.object({
  [SwapFormField.inputAmount]: yup.number().when(SwapFormField.inputToken, ([inputToken], schema) => {
    if (!inputToken) return schema.required("You must input amount")
    //@ts-ignore
    return schema.max(Number(convertWeiToEthers(inputToken?.balance?.toString(), 4)), "You can only swap less than you balance").min(0, "Swap value must greater than 0")
  }).typeError("You must input amount"),
  [SwapFormField.outputAmount]: null,
  [SwapFormField.outputToken]: null,
  [SwapFormField.inputToken]: null,
  [SwapFormField.gasPrice]: null,
  [SwapFormField.slippage]: yup.number().max(1, "You only can set slippage to 100%").typeError("You must slippate rate"),
});

const SwapForm = () => {
  const { register, handleSubmit, formState: { errors, isValid }, trigger, control, watch, setValue } = useForm({
    defaultValues: DEFAULT_SWAP_FORM,
    // @ts-ignore
    resolver: yupResolver(validationSchema),
    mode: "onChange"
  });
  const { createSwap, quote: swapQuote, status: swapStatus, executeSwap } = useSwap()
  const { approveStatus, onApproveToken, onCheckTokenApprove } = useApprove()
  const { getLatestTokenBalance } = useToken()
  const tokenIn = watch(SwapFormField.inputToken)
  const tokenOut = watch(SwapFormField.outputToken)
  const inputAmount = watch(SwapFormField.inputAmount)
  const slippage = watch(SwapFormField.slippage)
  const isOutputLoading = useMemo(() => swapStatus === SwapStatus.QUOTING, [swapStatus])
  const bg = useColorModeValue("white", "gray.800")
  const disabledBg = useColorModeValue('gray.100', "gray.700")
  const _bg = useSSRColor(bg)
  const onSetMaxInput = useCallback(() => {
    if (tokenIn) {
      setValue(SwapFormField.inputAmount, convertWeiToEthers(tokenIn.balance.toString()))
      trigger()
    }
  }, [tokenIn])

  const onSwapSuccess = useCallback(async (tokenIn: Token, tokenOut: Token) => {
    const [newTokenIn, newTokenOut] = await Promise.all([
      getLatestTokenBalance(tokenIn),
      getLatestTokenBalance(tokenOut)
    ])
    setValue(SwapFormField.inputAmount, 0)
    setValue(SwapFormField.inputToken, newTokenIn)
    setValue(SwapFormField.outputToken, newTokenOut)
  }, [getLatestTokenBalance])

  const onSubmit = useCallback((values) => {
    if (approveStatus !== ApproveStatus.APPROVED) {
      onApproveToken(values?.inputToken)
    } else {
      executeSwap({
        tokenIn: values?.inputToken,
        tokenOut: values?.outputToken,
        inAmount: convertEthersToWei(values?.inputAmount),
        gasPrice: values?.gasPrice,
        onSwapSuccess
      })
    }
  }, [executeSwap, approveStatus, onApproveToken])

  useEffect(() => {
    if (tokenIn && tokenOut && inputAmount) {
      createSwap({
        tokenIn,
        tokenOut,
        inAmount: convertEthersToWei(inputAmount),
        slippage
      })
    }
  }, [createSwap, inputAmount, tokenIn, tokenOut, slippage])


  useEffect(() => {
    if (tokenIn && inputAmount) {
      onCheckTokenApprove({ token: tokenIn, amount: convertEthersToWei(inputAmount) })
    }
  }, [onCheckTokenApprove, inputAmount, tokenIn])

  useEffect(() => {
    if (swapStatus === SwapStatus.QUOTED && swapQuote) {
      setValue(SwapFormField.outputAmount, convertWeiToEthers(swapQuote, 8))
    }
  }, [swapQuote, swapStatus])

  return (
    <Flex alignItems="flex-start">
      <Flex bg={_bg} as="form" padding={6} boxShadow="base" flexDir="column" minW={["320px", "350px"]} alignItems="center" justifyContent="center" gap="16px" onSubmit={handleSubmit(onSubmit)} borderRadius="24px">
        <Box width="100%">
          <Heading as="h4" size="md">Swap</Heading>
          <Text fontSize="sm" mt="2">Trade tokens in an instant</Text>
        </Box>
        <SwapSetting control={control} />
        <Flex flexDir="column" gap="4px" w="100%">
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
            <InputGroup>
              <Input
                // isDisabled={!tokenIn}
                max={tokenIn && Number(convertWeiToEthers(tokenIn?.balance?.toString(), 4))}
                {...register(SwapFormField.inputAmount)}
                _disabled={{
                  bg: disabledBg
                }}
                px="16px"
                py="20px"
                fontSize={20}
              />
              <InputRightElement mx="8px">
                <Button isDisabled={!tokenIn} mx="8px" variant="ghost" onClick={onSetMaxInput}>Max</Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors?.inputAmount?.message as string}</FormErrorMessage>
          </FormControl>
        </Flex>
        <Flex flexDir="column" gap="4px" w="100%">
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
                bg: disabledBg
              }}
              px="16px"
              py="20px"
              fontSize={20}
            />
            {isOutputLoading && (
              <InputRightElement>
                <Spinner />
              </InputRightElement>
            )}
          </InputGroup>
          <Text mt={2} fontSize="xs" textAlign="right">Slippage Tolerance: {(slippage * 100).toLocaleString()} %</Text>
        </Flex>
        <Button
          w="100%"
          isLoading={isOutputLoading || approveStatus === ApproveStatus.LOADING}
          isDisabled={!swapQuote || !isValid}
          colorScheme='blue'
          type="submit"
        >
          {approveStatus !== ApproveStatus.APPROVED ? 'Approve' : 'Swap'}
        </Button>
      </Flex>
    </Flex>
  )
}

export default SwapForm