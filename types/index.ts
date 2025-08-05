// Token and wallet types
export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  logoUri: string;
  balance?: number;
  price?: number;
}

export interface WalletBalances {
  tokenA: number;
  tokenB: number;
}

// Pool and liquidity types
export interface PoolRatio {
  tokenA: number;
  tokenB: number;
  lastUpdated: number;
}

export interface LiquidityPool {
  pair: string;
  tokenA: Token;
  tokenB: Token;
  ratio: PoolRatio;
  totalLiquidity: number;
  volume24h: number;
  apr: number;
}

// Deposit request and response types (from PRD section 7)
export interface DepositRequest {
  userAddress: string;
  tokenA: number;
  tokenB: number;
  mode: "dual" | "single";
  slippage?: number; // Only for single mode
}

export interface DepositResponse {
  deployedTokenA: number;
  deployedTokenB: number;
  excessTokenA: number;
  excessTokenB: number;
  NDLPissued: number;
  txHash: string;
}

// Validation and calculation types
export interface TokenValidation {
  isValid: boolean;
  maxTokenA: number;
  maxTokenB: number;
  finalTokenA: number;
  finalTokenB: number;
  excessTokenA: number;
  excessTokenB: number;
  ratioDeviation: number;
}

// UI state types
export interface DepositState {
  mode: "dual" | "single";
  tokenAAmount: string;
  tokenBAmount: string;
  selectedTokenA: Token;
  selectedTokenB: Token;
  isLoading: boolean;
  errors: {
    tokenA?: string;
    tokenB?: string;
    general?: string;
  };
}

// LP and vault types
export interface VaultPosition {
  id: string;
  userAddress: string;
  lpTokens: number;
  vaultShares: number; // NDLP tokens
  tokenADeposited: number;
  tokenBDeposited: number;
  createdAt: number;
  lastUpdated: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

// Price and market data types
export interface PriceData {
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap?: number;
}

// Network and chain types
export interface NetworkInfo {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Transaction types
export interface Transaction {
  hash: string;
  type: 'deposit' | 'withdraw' | 'swap';
  status: 'pending' | 'success' | 'failed';
  tokenA: {
    symbol: string;
    amount: number;
  };
  tokenB: {
    symbol: string;
    amount: number;
  };
  timestamp: number;
  gasUsed?: number;
  gasPrice?: number;
}

// Configuration types
export interface AppConfig {
  defaultSlippage: number;
  maxSlippage: number;
  updateInterval: number; // for pool ratio updates
  supportedNetworks: NetworkInfo[];
  defaultTokens: Token[];
} 