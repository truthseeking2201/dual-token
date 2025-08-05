'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Info } from 'lucide-react';
import { ActionToggle } from './ui/action-toggle';
import { ModeSwitcher } from './ui/mode-switcher';
import { TokenInput } from './ui/token-input';
import { WithdrawView } from './withdraw-view';
import { ConfirmationModal } from './confirmation-modal';
import { SuccessModal } from './success-modal';
import { 
  DepositValidator, 
  WalletService, 
  PoolService, 
  DepositService 
} from '../lib/deposit-logic';
import { TOKENS } from '../lib/constants';
import { formatNumber, parseTokenInput, debounce, cn } from '../lib/utils';
import { DepositState, PoolRatio, WalletBalances, Token } from '../types';

interface LiquidityManagerProps {
  className?: string;
}

export function LiquidityManager({ className }: LiquidityManagerProps) {
  // Main state
  const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit');
  const [mode, setMode] = useState<'dual' | 'single'>('dual');
  const [isLoading, setIsLoading] = useState(false);
  const [poolRatio, setPoolRatio] = useState<PoolRatio | null>(null);
  const [walletBalances, setWalletBalances] = useState<WalletBalances | null>(null);
  const [estimatedNDLP, setEstimatedNDLP] = useState<number>(0);

  // Modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [txHash, setTxHash] = useState('');

  // Token states
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  const [selectedTokenA] = useState<Token>(TOKENS.SUI);
  const [selectedTokenB] = useState<Token>(TOKENS.USDC);

  // Error states
  const [errors, setErrors] = useState<{
    tokenA?: string;
    tokenB?: string;
    general?: string;
  }>({});

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Load wallet balances and pool ratio in parallel
        const [balances, ratio] = await Promise.all([
          WalletService.getWalletBalances('0x1234567890123456789012345678901234567890'),
          PoolService.getPoolRatio('SUI-USDC')
        ]);

        setWalletBalances(balances);
        setPoolRatio(ratio);
        
        // Set default mode based on balances
        const defaultMode = WalletService.determineDefaultMode(balances);
        setMode(defaultMode);
        
      } catch (error) {
        console.error('Failed to load initial data:', error);
        setErrors({ general: 'Failed to load data. Please refresh.' });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Subscribe to pool ratio updates
  useEffect(() => {
    if (!poolRatio) return;

    const unsubscribe = PoolService.subscribeToRatioUpdates('SUI-USDC', (newRatio) => {
      setPoolRatio(newRatio);
    });

    return unsubscribe;
  }, [poolRatio]);

  // Validate inputs and calculate NDLP estimation
  const validateAndCalculate = useCallback(
    debounce(async () => {
      if (!poolRatio || !walletBalances) return;

      const tokenAValue = parseTokenInput(tokenAAmount);
      const tokenBValue = parseTokenInput(tokenBAmount);

      if (tokenAValue === 0 && tokenBValue === 0) {
        setEstimatedNDLP(0);
        setErrors({});
        return;
      }

      try {
        const validation = DepositValidator.validateTokenAmounts(
          tokenAValue,
          tokenBValue,
          poolRatio,
          walletBalances
        );

        // Calculate estimated NDLP
        if (validation.isValid) {
          const ndlp = DepositValidator.calculateNDLPShares(
            validation.finalTokenA,
            validation.finalTokenB,
            poolRatio
          );
          setEstimatedNDLP(ndlp);
          setErrors({});
        } else {
          setEstimatedNDLP(0);
          
          // Set validation errors
          const newErrors: typeof errors = {};
          if (tokenAValue > walletBalances.tokenA) {
            newErrors.tokenA = 'Insufficient SUI balance';
          }
          if (tokenBValue > walletBalances.tokenB) {
            newErrors.tokenB = 'Insufficient USDC balance';
          }
          if (validation.ratioDeviation > 5) {
            newErrors.general = 'Ratio deviation too high. Consider using auto-correct.';
          }
          setErrors(newErrors);
        }
      } catch (error) {
        console.error('Validation error:', error);
        setErrors({ general: 'Validation failed' });
      }
    }, 300),
    [tokenAAmount, tokenBAmount, poolRatio, walletBalances]
  );

  useEffect(() => {
    validateAndCalculate();
  }, [validateAndCalculate]);

  // Token input handlers
  const handleTokenAChange = useCallback((amount: string) => {
    setTokenAAmount(amount);
    
    // Auto-adjust tokenB in dual mode for better UX
    if (mode === 'dual' && poolRatio && amount) {
      const value = parseTokenInput(amount);
      if (value > 0) {
        const corrected = DepositValidator.autoCorrectToRatio(value, 'tokenA', poolRatio);
        setTokenBAmount(corrected.tokenB.toString());
      }
    }
  }, [mode, poolRatio]);

  const handleTokenBChange = useCallback((amount: string) => {
    setTokenBAmount(amount);
    
    // Auto-adjust tokenA in dual mode for better UX
    if (mode === 'dual' && poolRatio && amount) {
      const value = parseTokenInput(amount);
      if (value > 0) {
        const corrected = DepositValidator.autoCorrectToRatio(value, 'tokenB', poolRatio);
        setTokenAAmount(corrected.tokenA.toString());
      }
    }
  }, [mode, poolRatio]);

  // Button handlers
  const handleHalfClickA = useCallback(() => {
    if (!walletBalances) return;
    const halfAmount = walletBalances.tokenA / 2;
    handleTokenAChange(halfAmount.toString());
  }, [walletBalances, handleTokenAChange]);

  const handleMaxClickA = useCallback(() => {
    if (!walletBalances) return;
    handleTokenAChange(walletBalances.tokenA.toString());
  }, [walletBalances, handleTokenAChange]);

  const handleHalfClickB = useCallback(() => {
    if (!walletBalances) return;
    const halfAmount = walletBalances.tokenB / 2;
    handleTokenBChange(halfAmount.toString());
  }, [walletBalances, handleTokenBChange]);

  const handleMaxClickB = useCallback(() => {
    if (!walletBalances) return;
    handleTokenBChange(walletBalances.tokenB.toString());
  }, [walletBalances, handleTokenBChange]);

  const handleDepositClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDeposit = useCallback(async () => {
    if (!poolRatio || !walletBalances) return;

    setIsLoading(true);
    setErrors({});

    try {
      const request = {
        userAddress: '0x1234567890123456789012345678901234567890',
        tokenA: parseTokenInput(tokenAAmount),
        tokenB: parseTokenInput(tokenBAmount),
        mode,
      };

      const response = await DepositService.processDualDeposit(request);
      
      setTxHash(response.txHash);
      setIsConfirmModalOpen(false);
      setIsSuccessModalOpen(true);

      // Reset form
      setTokenAAmount('');
      setTokenBAmount('');
      setEstimatedNDLP(0);
      
    } catch (error) {
      console.error('Deposit failed:', error);
      setErrors({ general: 'Deposit failed. Please try again.' });
      setIsConfirmModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, [tokenAAmount, tokenBAmount, mode, poolRatio, walletBalances]);

  if (!poolRatio || !walletBalances) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {/* Modals */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDeposit}
        isLoading={isLoading}
        depositData={{
          mode,
          tokenAAmount: parseTokenInput(tokenAAmount),
          tokenBAmount: parseTokenInput(tokenBAmount),
          estimatedNDLP,
        }}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        txHash={txHash}
      />
      
      {/* Header */}
      <div className="bg-[#282828] flex flex-row gap-2.5 h-[59.144px] items-center justify-start p-4 rounded-t-[12px]">
        <div className="flex-1 font-dm-sans font-bold text-[18px] text-white leading-none tracking-[-0.6px]">
          Manage Liquidity
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-black flex flex-col gap-4 items-start justify-start p-4 rounded-b-[12px] border border-white/20">
        
        {/* Action Toggle (Deposit/Withdraw) */}
        <ActionToggle
          action={action}
          onActionChange={setAction}
          disabled={isLoading}
        />

        {/* Mode Switcher (Zap In/Pair In) */}
        <ModeSwitcher
          mode={mode}
          onModeChange={setMode}
          disabled={isLoading}
        />

        {action === 'deposit' ? (
          <>
            {/* Token Inputs */}
            <div className="w-full space-y-6">
              <div className="bg-transparent p-4 rounded-t-[12px] shadow-inner">
                {mode === 'dual' ? (
                  <>
                    <TokenInput
                      label="Deposit"
                      token={selectedTokenA}
                      amount={tokenAAmount}
                      balance={walletBalances.tokenA}
                      usdValue={parseTokenInput(tokenAAmount) * 0.5} // Mock USD price
                      onAmountChange={handleTokenAChange}
                      onHalfClick={handleHalfClickA}
                      onMaxClick={handleMaxClickA}
                      disabled={isLoading}
                      error={errors.tokenA}
                    />
                    <div className="bg-white/20 h-px w-full my-6" />
                    <TokenInput
                      label="Deposit"
                      token={selectedTokenB}
                      amount={tokenBAmount}
                      balance={walletBalances.tokenB}
                      usdValue={parseTokenInput(tokenBAmount) * 1.0} // Mock USD price
                      onAmountChange={handleTokenBChange}
                      onHalfClick={handleHalfClickB}
                      onMaxClick={handleMaxClickB}
                      disabled={isLoading}
                      error={errors.tokenB}
                    />
                  </>
                ) : (
                  <TokenInput
                    label="Deposit"
                    token={selectedTokenB}
                    amount={tokenBAmount}
                    balance={walletBalances.tokenB}
                    usdValue={parseTokenInput(tokenBAmount) * 1.0} // Mock USD price
                    onAmountChange={handleTokenBChange}
                    onHalfClick={handleHalfClickB}
                    onMaxClick={handleMaxClickB}
                    disabled={isLoading}
                    error={errors.tokenB}
                  />
                )}
              </div>

              {/* Estimated Receive Section */}
              <div className="bg-black flex flex-col gap-4 items-start justify-start p-4 rounded-bl-[12px] rounded-br-[12px] border border-white/15">
                <div className="w-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-row gap-3 items-center justify-start">
                      <div className="flex-1 flex flex-row gap-1 items-center justify-start">
                        <div className="font-dm-sans font-bold text-[14px] text-gray-200 leading-[20px] tracking-[-0.35px]">
                          Est. Receive
                        </div>
                        <Info className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex flex-row gap-2 items-center justify-center">
                      <div className="flex-1 flex flex-row gap-2 h-6 items-center justify-start">
                        <div className="flex-1 font-ibm-plex-mono font-bold text-[32px] text-gray-200 leading-none">
                          {estimatedNDLP > 0 ? formatNumber(estimatedNDLP, { decimals: 2 }) : '--'}
                        </div>
                      </div>
                      
                      <div className="flex flex-row gap-2 h-6 items-center justify-start">
                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">N</span>
                        </div>
                        <div className="font-ibm-plex-mono font-bold text-[18px] text-gray-200 leading-none">
                          NDLP
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/20 h-px w-full" />

                {/* Rate and Network Info */}
                <div className="w-full space-y-1">
                  <div className="flex flex-row items-center justify-between px-0 py-1">
                    <div className="font-dm-sans font-normal text-[14px] text-white/80 leading-none opacity-80">
                      Rate
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-start">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <RefreshCw className="w-3 h-3 text-white" />
                      </div>
                      <div className="font-ibm-plex-mono font-normal text-[14px] text-white leading-none">
                        1 USDC = 1.05 NDLP
                      </div>
                      <div className="bg-white/12 flex flex-row gap-[8.627px] items-center justify-start p-[6px] rounded-[18.98px] border border-white/20">
                        <RefreshCw className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row items-center justify-between px-0 py-1">
                    <div className="font-dm-sans font-normal text-[14px] text-white/80 leading-none opacity-80">
                      Network
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-end">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <span className="text-black text-xs font-bold">S</span>
                      </div>
                      <div className="font-ibm-plex-mono font-normal text-[14px] text-white leading-none">
                        SUI
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="w-full p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="text-red-400 text-sm font-dm-sans">
                  {errors.general}
                </div>
              </div>
            )}

            {/* Deposit Button */}
            <button
              onClick={handleDepositClick}
              disabled={isLoading || estimatedNDLP === 0 || Object.keys(errors).length > 0}
              className={cn(
                "w-full h-[52px] rounded-xl flex flex-row gap-2 items-center justify-center overflow-clip p-4 transition-all",
                "bg-gradient-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-700",
                "border border-white/25 shadow-lg",
                (isLoading || estimatedNDLP === 0 || Object.keys(errors).length > 0) && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="font-dm-sans font-bold text-[18px] text-black leading-[20px]">
                Deposit
              </div>
            </button>
          </>
        ) : (
          <WithdrawView mode={mode} onModeChange={setMode} />
        )}
      </div>
    </div>
  );
} 