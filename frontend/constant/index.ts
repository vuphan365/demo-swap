import type { SwapFormParams } from '@/types/token'

export const GOERLI_NETWORK_ID = '0x5'

export const TOKEN = {
    BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    USDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
}

export const DEFAULT_TOKEN_SELECTION = [TOKEN.BUSD, TOKEN.USDC]

export const TOKEN_ADDRESS_LENGTH = 42

export const DEFAULT_SWAP_FORM: SwapFormParams = {
    outputToken: null,
    inputAmount: null,
    inputToken: null,
    outputAmount: null,
    gasPrice: 2,
    slippage: 0.005,
}

export const POOL_FACTORY_CONTRACT_ADDRESS =
    '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const QUOTER_CONTRACT_ADDRESS =
    '0x61fFE014bA17989E743c5F6cB21bF9697530B21e'
export const V3_SWAP_ROUTER_ADDRESS =
    '0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2'
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

export const isDev = process.env.NEXT_PUBLIC_ENV === 'dev'

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || ''
