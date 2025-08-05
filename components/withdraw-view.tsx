'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Info, ChevronDown } from 'lucide-react';
import { TokenInput } from './ui/token-input';
import { TOKENS } from '../lib/constants';
import { Token, WalletBalances } from '../types';
import { formatNumber, parseTokenInput, cn } from '../lib/utils';
import { WalletService } from '../lib/deposit-logic';

interface WithdrawViewProps {
  mode: 'dual' | 'single';
  onModeChange: (mode: 'dual' | 'single') => void;
  className?: string;
}

export function WithdrawView({ mode, onModeChange, className }: WithdrawViewProps) {
  const [ndlpAmount, setNdlpAmount] = useState('');
  const [walletBalances, setWalletBalances] = useState<WalletBalances | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS.USDC);
  const [isLoading, setIsLoading] = useState(false);

  // Load wallet balances
  useEffect(() => {
    const loadBalances = async () => {
      const balances = await WalletService.getWalletBalances('0x1234567890123456789012345678901234567890');
      setWalletBalances(balances);
    };
    loadBalances();
  }, []);

  const handleNdlpAmountChange = useCallback((amount: string) => {
    setNdlpAmount(amount);
  }, []);

  const handleHalfClick = useCallback(() => {
    // Implement logic to withdraw half of NDLP balance
  }, []);

  const handleMaxClick = useCallback(() => {
    // Implement logic to withdraw max NDLP balance
  }, []);

  const handleWithdraw = useCallback(async () => {
    // Implement withdraw logic
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  }, []);

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Payout Token Selector for Zap Out */}
      {mode === 'single' && (
        <div className="bg-transparent p-4 rounded-xl shadow-inner border border-white/15">
          <div className="flex items-center justify-between">
            <h3 className="font-dm-sans font-medium text-[16px] text-gray-200 tracking-[-0.35px]">
              Select Payout Token
            </h3>
            <button className="flex items-center gap-1 h-9 px-2 py-1.5 rounded-[30px] border border-[#505050]">
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{selectedToken.symbol.charAt(0)}</span>
              </div>
              <span className="font-dm-sans font-medium text-white text-[14px]">{selectedToken.symbol}</span>
              <ChevronDown className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Withdraw Amount Input */}
      <div className="bg-transparent p-4 rounded-t-[12px] shadow-inner">
        <TokenInput
          label="Withdraw Amount"
          token={TOKENS.NDLP}
          amount={ndlpAmount}
          balance={129.84} // Mock NDLP balance
          usdValue={parseTokenInput(ndlpAmount) * 1.05} // Mock NDLP price
          onAmountChange={handleNdlpAmountChange}
          onHalfClick={handleHalfClick}
          onMaxClick={handleMaxClick}
          disabled={isLoading}
        />
      </div>

      {/* Estimated Receive Section */}
      <div className="bg-black flex flex-col gap-4 items-start justify-start p-4 rounded-bl-[12px] rounded-br-[12px] border border-white/15">
        <div className="w-full space-y-4">
          <div className="space-y-3">
            <div className="flex flex-row gap-3 items-center justify-start">
              <div className="flex-1 flex flex-row gap-1 items-center justify-start">
                <div className="font-dm-sans font-bold text-[14px] text-gray-200 leading-[20px] tracking-[-0.35px]">
                  Est. Max Receive
                </div>
                <Info className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            {mode === 'single' ? (
              <div className="flex flex-row gap-2 items-center justify-center">
                <div className="flex-1 font-ibm-plex-mono font-bold text-[32px] text-gray-200 leading-none">
                  {formatNumber(parseTokenInput(ndlpAmount) * 1.05, { decimals: 2 })}
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{selectedToken.symbol.charAt(0)}</span>
                </div>
                <div className="font-ibm-plex-mono font-bold text-[18px] text-gray-200 leading-none">
                  {selectedToken.symbol}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex flex-row gap-2 items-center justify-between">
                  <div className="font-ibm-plex-mono font-bold text-[24px] text-gray-200 leading-none">
                    {formatNumber((parseTokenInput(ndlpAmount) * 1.05) / 2, { decimals: 2 })}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{TOKENS.SUI.symbol.charAt(0)}</span>
                    </div>
                    <div className="font-ibm-plex-mono font-bold text-[18px] text-gray-200 leading-none">
                      {TOKENS.SUI.symbol}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center justify-between">
                  <div className="font-ibm-plex-mono font-bold text-[24px] text-gray-200 leading-none">
                    {formatNumber((parseTokenInput(ndlpAmount) * 1.05) / 2, { decimals: 2 })}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{TOKENS.USDC.symbol.charAt(0)}</span>
                    </div>
                    <div className="font-ibm-plex-mono font-bold text-[18px] text-gray-200 leading-none">
                      {TOKENS.USDC.symbol}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Withdraw Button */}
      <button
        onClick={handleWithdraw}
        disabled={isLoading || parseTokenInput(ndlpAmount) === 0}
        className={cn(
          "w-full h-[52px] rounded-xl flex flex-row gap-2 items-center justify-center overflow-clip p-4 transition-all",
          "bg-gradient-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-700",
          "border border-white/25 shadow-lg",
          (isLoading || parseTokenInput(ndlpAmount) === 0) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <RefreshCw className="w-5 h-5 animate-spin text-black" />
        ) : (
          <div className="font-dm-sans font-bold text-[18px] text-black leading-[20px]">
            Withdraw
          </div>
        )}
      </button>
    </div>
  );
} 