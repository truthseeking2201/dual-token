import { DepositRequest, DepositResponse, TokenValidation, PoolRatio, WalletBalances } from '../types';

/**
 * Core validation logic from PRD section 3.3
 * Implements the token binding formula and excess token calculation
 */
export class DepositValidator {
  /**
   * Validates and calculates optimal token amounts based on pool ratio
   * Formula: 
   * maxTokenA = userInputTokenB × (poolRatio.tokenA / poolRatio.tokenB)
   * maxTokenB = userInputTokenA × (poolRatio.tokenB / poolRatio.tokenA)
   */
  static validateTokenAmounts(
    userInputTokenA: number,
    userInputTokenB: number,
    poolRatio: PoolRatio,
    walletBalances: WalletBalances
  ): TokenValidation {
    // Calculate maximum amounts based on pool ratio
    const maxTokenA = userInputTokenB * (poolRatio.tokenA / poolRatio.tokenB);
    const maxTokenB = userInputTokenA * (poolRatio.tokenB / poolRatio.tokenA);

    // Token binding logic - use the smaller value from each pair
    const finalTokenA = Math.min(userInputTokenA, maxTokenA);
    const finalTokenB = Math.min(userInputTokenB, maxTokenB);

    // Calculate excess tokens (will be stored as idle)
    const excessTokenA = userInputTokenA - finalTokenA;
    const excessTokenB = userInputTokenB - finalTokenB;

    // Calculate ratio deviation for UI warnings
    const expectedRatio = poolRatio.tokenA / poolRatio.tokenB;
    const actualRatio = finalTokenA / finalTokenB;
    const ratioDeviation = Math.abs((actualRatio - expectedRatio) / expectedRatio) * 100;

    // Validation checks
    const isValid = 
      finalTokenA > 0 && 
      finalTokenB > 0 &&
      finalTokenA <= walletBalances.tokenA &&
      finalTokenB <= walletBalances.tokenB &&
      ratioDeviation < 1; // Allow 1% deviation

    return {
      isValid,
      maxTokenA,
      maxTokenB,
      finalTokenA,
      finalTokenB,
      excessTokenA,
      excessTokenB,
      ratioDeviation
    };
  }

  /**
   * Auto-corrects input amounts to match exact pool ratio
   */
  static autoCorrectToRatio(
    inputAmount: number,
    inputType: 'tokenA' | 'tokenB',
    poolRatio: PoolRatio
  ): { tokenA: number; tokenB: number } {
    if (inputType === 'tokenA') {
      return {
        tokenA: inputAmount,
        tokenB: inputAmount * (poolRatio.tokenB / poolRatio.tokenA)
      };
    } else {
      return {
        tokenA: inputAmount * (poolRatio.tokenA / poolRatio.tokenB),
        tokenB: inputAmount
      };
    }
  }

  /**
   * Calculates NDLP (vault shares) to be issued
   * This is a simplified calculation - in production would use more complex LP math
   */
  static calculateNDLPShares(
    tokenAAmount: number,
    tokenBAmount: number,
    poolRatio: PoolRatio,
    currentNDLPPrice: number = 1.05 // Default from design
  ): number {
    // Calculate total value in terms of tokenB
    const totalValueInTokenB = tokenBAmount + (tokenAAmount * (poolRatio.tokenB / poolRatio.tokenA));
    
    // Convert to NDLP shares based on current price
    return totalValueInTokenB / currentNDLPPrice;
  }
}

/**
 * Wallet balance detection functions from PRD section 3.1
 */
export class WalletService {
  /**
   * Simulated wallet balance check - in production would call actual wallet APIs
   */
  static async getWalletBalances(walletAddress: string): Promise<WalletBalances> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock balances for demo - in production would fetch from blockchain
    return {
      tokenA: 240.0, // SUI
      tokenB: 129.84  // USDC
    };
  }

  /**
   * Determines default mode based on wallet balances
   */
  static determineDefaultMode(balances: WalletBalances): "dual" | "single" {
    if (balances.tokenA > 0 && balances.tokenB > 0) {
      return "dual";
    }
    return "single";
  }
}

/**
 * Pool ratio fetching service from PRD section 3.2
 */
export class PoolService {
  private static cachedRatio: PoolRatio | null = null;
  private static lastFetch: number = 0;
  private static readonly CACHE_DURATION = 30000; // 30 seconds

  /**
   * Fetches current pool ratio with caching
   */
  static async getPoolRatio(pair: string): Promise<PoolRatio> {
    const now = Date.now();
    
    // Return cached data if still fresh
    if (this.cachedRatio && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.cachedRatio;
    }

    // Simulate API call to Oracle/AMM
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock ratio data - in production would fetch from Pyth/Uniswap
    const ratio: PoolRatio = {
      tokenA: 2, // 2 SUI
      tokenB: 1, // 1 USDC
      lastUpdated: now
    };

    this.cachedRatio = ratio;
    this.lastFetch = now;
    
    return ratio;
  }

  /**
   * Subscribes to ratio updates (in production would use WebSocket)
   */
  static subscribeToRatioUpdates(
    pair: string, 
    callback: (ratio: PoolRatio) => void
  ): () => void {
    const interval = setInterval(async () => {
      const ratio = await this.getPoolRatio(pair);
      callback(ratio);
    }, this.CACHE_DURATION);

    // Return cleanup function
    return () => clearInterval(interval);
  }
}

/**
 * Main deposit processing service
 */
export class DepositService {
  /**
   * Processes dual token deposit request
   */
  static async processDualDeposit(request: DepositRequest): Promise<DepositResponse> {
    // Get current pool ratio
    const poolRatio = await PoolService.getPoolRatio('SUI-USDC');
    
    // Get wallet balances
    const walletBalances = await WalletService.getWalletBalances(request.userAddress);
    
    // Validate token amounts
    const validation = DepositValidator.validateTokenAmounts(
      request.tokenA,
      request.tokenB,
      poolRatio,
      walletBalances
    );

    if (!validation.isValid) {
      throw new Error('Invalid token amounts or insufficient balance');
    }

    // Calculate NDLP shares
    const ndlpShares = DepositValidator.calculateNDLPShares(
      validation.finalTokenA,
      validation.finalTokenB,
      poolRatio
    );

    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response: DepositResponse = {
      deployedTokenA: validation.finalTokenA,
      deployedTokenB: validation.finalTokenB,
      excessTokenA: validation.excessTokenA,
      excessTokenB: validation.excessTokenB,
      NDLPissued: ndlpShares,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`
    };

    return response;
  }
} 