'use client';

import React, { useState, useCallback } from 'react';
import { ChevronDown, Wallet } from 'lucide-react';
import { Token } from '../../types';
import { formatNumber, formatCurrency, parseTokenInput, isValidNumberInput } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface TokenInputProps {
  label: string;
  token: Token;
  amount: string;
  balance: number;
  usdValue: number;
  onAmountChange: (amount: string) => void;
  onTokenSelect?: () => void;
  onHalfClick: () => void;
  onMaxClick: () => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function TokenInput({
  label,
  token,
  amount,
  balance,
  usdValue,
  onAmountChange,
  onTokenSelect,
  onHalfClick,
  onMaxClick,
  disabled = false,
  error,
  className
}: TokenInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isValidNumberInput(value)) {
      onAmountChange(value);
    }
  }, [onAmountChange]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Label */}
      <div className="flex flex-row gap-4 items-start justify-start">
        <div className="flex flex-col items-start justify-start self-stretch">
          <div className="font-dm-sans font-medium text-[16px] text-white/50 leading-none">
            {label}
          </div>
        </div>
      </div>

      {/* Amount Input and Token Selector */}
      <div className="flex flex-row gap-6 items-center justify-start">
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="0.00"
          disabled={disabled}
          className={cn(
            "flex-1 font-ibm-plex-mono font-bold text-[32px] leading-none bg-transparent border-none outline-none",
            amount === '' || parseTokenInput(amount) === 0 
              ? "text-gray-200/40" 
              : "text-gray-200",
            disabled && "opacity-50 cursor-not-allowed",
            error && "text-red-400"
          )}
        />
        
        {/* Token Selector */}
        <button
          onClick={onTokenSelect}
          disabled={disabled || !onTokenSelect}
          className={cn(
            "flex flex-row gap-1 h-9 items-center justify-start px-2 py-1.5 rounded-[30px] border border-[#505050] transition-all",
            onTokenSelect && !disabled && "hover:border-white/30 cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex flex-row gap-1 items-center justify-start">
            {/* Token Icon */}
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {token.symbol.charAt(0)}
              </span>
            </div>
            <div className="flex flex-row gap-1 items-center justify-start">
              <div className="font-dm-sans font-medium text-white text-[14px] leading-[20px]">
                {token.symbol}
              </div>
            </div>
            {onTokenSelect && (
              <ChevronDown className="w-5 h-5 text-white" />
            )}
          </div>
        </button>
      </div>

      {/* Balance and Action Buttons */}
      <div className="flex flex-row gap-3 items-center justify-start">
        <div className="flex-1 flex flex-row gap-1.5 items-center justify-start">
          <div className="font-dm-sans font-medium text-[14px] text-white/50 leading-none">
            {formatCurrency(usdValue)}
          </div>
        </div>
        
        <div className="flex flex-row gap-1.5 items-center justify-start">
          <div className="flex flex-row gap-2.5 items-center justify-start">
            <Wallet className="w-5 h-5 text-white/80" />
          </div>
          <div className="font-dm-sans font-medium text-[14px] text-white/80 leading-none">
            {formatNumber(balance, { decimals: 2 })}
          </div>
        </div>
        
        <div className="flex flex-row gap-1 items-start justify-start">
          <button
            onClick={onHalfClick}
            disabled={disabled}
            className={cn(
              "bg-black flex flex-row items-center justify-center px-2 py-0.5 rounded border border-white/25 w-12 transition-all",
              !disabled && "hover:border-white/40 hover:bg-white/5",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="font-dm-sans font-bold text-[12px] text-white/80 leading-none">
              HALF
            </div>
          </button>
          <button
            onClick={onMaxClick}
            disabled={disabled}
            className={cn(
              "bg-black flex flex-row items-center justify-center px-2 py-0.5 rounded border border-white/25 w-12 transition-all",
              !disabled && "hover:border-white/40 hover:bg-white/5",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="font-dm-sans font-bold text-[12px] text-white/80 leading-none">
              MAX
            </div>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-400 text-sm font-dm-sans">
          {error}
        </div>
      )}
    </div>
  );
} 