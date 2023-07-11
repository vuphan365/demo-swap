import type { SwapFormParams } from '@/types/token'

export const GOERLI_NETWORK_ID = "0x5";

export const TOKEN = {
  GOERLI: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
  CAKE: '0x204005C666e75d1EBFc908359d3f684cf19f72c2',
  USDC: '0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557',
  MCF: '0x9637f7e9D5B9Eabb13EcE921103117dEae66334d',
  UNI: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  LINK: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
}

export const DEFAULT_TOKEN_SELECTION = [
  TOKEN.GOERLI,
  TOKEN.CAKE,
  TOKEN.USDC,
  TOKEN.MCF,
  TOKEN.UNI,
  TOKEN.LINK
]

export const TOKEN_ADDRESS_LENGTH = 42

export const DEFAULT_SWAP_FORM: SwapFormParams = {
  outputToken: null,
  inputAmount: null,
  inputToken: null,
  outputAmount: null,
  gasPrice: 2,
  slippage: 0.005
}

export const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const QUOTER_CONTRACT_ADDRESS =
  '0x61fFE014bA17989E743c5F6cB21bF9697530B21e'
export const V3_SWAP_ROUTER_ADDRESS =
  '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'
export const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 10000
export const MAX_FEE_PER_GAS = 100000000000
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000
// ABI's

export const ERC20_ABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  'function approve(address _spender, uint256 _value) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
]