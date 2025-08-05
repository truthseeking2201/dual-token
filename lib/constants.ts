import { Token, NetworkInfo, AppConfig } from '../types';

// Token logos (using placeholder URLs - in production would use actual token logos)
export const TOKEN_LOGOS = {
  SUI: '/icons/sui.png',
  USDC: '/icons/usdc.png',
  NDLP: '/icons/ndlp.png',
} as const;

// Supported tokens
export const TOKENS: Record<string, Token> = {
  SUI: {
    symbol: 'SUI',
    name: 'Sui',
    decimals: 9,
    logoUri: TOKEN_LOGOS.SUI,
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoUri: TOKEN_LOGOS.USDC,
  },
  NDLP: {
    symbol: 'NDLP',
    name: 'NODO Liquidity Provider Token',
    decimals: 18,
    logoUri: TOKEN_LOGOS.NDLP,
  },
} as const;

// Network configurations
export const NETWORKS: Record<string, NetworkInfo> = {
  SUI_MAINNET: {
    chainId: 1,
    name: 'Sui Mainnet',
    rpcUrl: 'https://fullnode.mainnet.sui.io',
    explorerUrl: 'https://explorer.sui.io',
    nativeCurrency: {
      name: 'Sui',
      symbol: 'SUI',
      decimals: 9,
    },
  },
  SUI_TESTNET: {
    chainId: 2,
    name: 'Sui Testnet',
    rpcUrl: 'https://fullnode.testnet.sui.io',
    explorerUrl: 'https://explorer.sui.io/?network=testnet',
    nativeCurrency: {
      name: 'Sui',
      symbol: 'SUI',
      decimals: 9,
    },
  },
} as const;

// Application configuration
export const APP_CONFIG: AppConfig = {
  defaultSlippage: 0.5, // 0.5%
  maxSlippage: 10, // 10%
  updateInterval: 30000, // 30 seconds
  supportedNetworks: Object.values(NETWORKS),
  defaultTokens: Object.values(TOKENS),
};

// Default pool ratios (for demo purposes)
export const DEFAULT_POOL_RATIOS = {
  'SUI-USDC': {
    tokenA: 2, // 2 SUI
    tokenB: 1, // 1 USDC
  },
  'USDC-SUI': {
    tokenA: 1, // 1 USDC
    tokenB: 2, // 2 SUI
  },
} as const;

// UI Constants
export const UI_CONSTANTS = {
  // Animation durations
  ANIMATION_DURATION: 200, // ms
  TOAST_DURATION: 5000, // ms
  
  // Debounce delays
  INPUT_DEBOUNCE: 300, // ms
  SEARCH_DEBOUNCE: 500, // ms
  
  // Validation limits
  MIN_DEPOSIT_AMOUNT: 0.001,
  MAX_DECIMAL_PLACES: 18,
  
  // Display preferences
  DEFAULT_DISPLAY_DECIMALS: 6,
  CURRENCY_DECIMALS: 2,
  
  // Button states
  BUTTON_LOADING_MIN_DURATION: 1000, // ms
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  INVALID_AMOUNT: 'Invalid amount',
  RATIO_DEVIATION_HIGH: 'Ratio deviation too high',
  NETWORK_ERROR: 'Network error occurred',
  WALLET_NOT_CONNECTED: 'Wallet not connected',
  TRANSACTION_FAILED: 'Transaction failed',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  DEPOSIT_SUCCESS: 'Deposit successful',
  TRANSACTION_SUBMITTED: 'Transaction submitted',
  WALLET_CONNECTED: 'Wallet connected',
} as const;

// Mock wallet address for demo
export const MOCK_WALLET_ADDRESS = '0x1234567890123456789012345678901234567890';

// Rate refresh interval
export const RATE_REFRESH_INTERVAL = 30000; // 30 seconds

// Local storage keys
export const STORAGE_KEYS = {
  WALLET_ADDRESS: 'wallet_address',
  PREFERRED_SLIPPAGE: 'preferred_slippage',
  TRANSACTION_HISTORY: 'transaction_history',
  USER_PREFERENCES: 'user_preferences',
} as const;

// API endpoints (for production)
export const API_ENDPOINTS = {
  WALLET_BALANCES: '/api/wallet/balances',
  POOL_RATIO: '/api/pools/ratio',
  SUBMIT_DEPOSIT: '/api/deposits/submit',
  TRANSACTION_HISTORY: '/api/transactions/history',
  TOKEN_PRICES: '/api/tokens/prices',
} as const;

// Theme colors (matching Figma design)
export const THEME_COLORS = {
  BACKGROUND: '#000000',
  CARD_BACKGROUND: '#282828',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: 'rgba(255, 255, 255, 0.5)',
  TEXT_MUTED: 'rgba(255, 255, 255, 0.8)',
  BORDER: 'rgba(255, 255, 255, 0.15)',
  BUTTON_BORDER: 'rgba(255, 255, 255, 0.25)',
  INPUT_BACKGROUND: 'rgba(255, 255, 255, 0.08)',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
} as const; 