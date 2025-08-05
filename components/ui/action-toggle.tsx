'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ActionToggleProps {
  action: 'deposit' | 'withdraw';
  onActionChange: (action: 'deposit' | 'withdraw') => void;
  disabled?: boolean;
  className?: string;
}

export function ActionToggle({
  action,
  onActionChange,
  disabled = false,
  className
}: ActionToggleProps) {
  return (
    <div className={cn(
      "backdrop-blur-[5px] backdrop-filter bg-white/8 flex flex-row gap-1 items-start justify-start p-1 rounded-xl border border-white/15 transition-all",
      className
    )}>
      {/* Deposit Button */}
      <button
        onClick={() => onActionChange('deposit')}
        disabled={disabled}
        className={cn(
          "flex-1 flex flex-row gap-1 h-full items-center justify-center min-h-[32px] overflow-clip px-4 py-2 rounded-lg transition-all",
          action === 'deposit' 
            ? "bg-gradient-to-r from-blue-400 to-purple-600 shadow-lg" 
            : "hover:bg-white/5",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Plus className={cn(
          "w-4 h-4 transition-colors",
          action === 'deposit' ? "text-black" : "text-white"
        )} />
        <div className={cn(
          "font-dm-sans font-bold text-[14px] text-center transition-colors",
          action === 'deposit' ? "text-black" : "text-white/50"
        )}>
          Deposit
        </div>
      </button>

      {/* Withdraw Button */}
      <button
        onClick={() => onActionChange('withdraw')}
        disabled={disabled}
        className={cn(
          "flex-1 flex flex-row gap-1 h-full items-center justify-center min-h-[32px] overflow-clip px-6 py-[11px] rounded-[10px] transition-all",
          action === 'withdraw' 
            ? "bg-gradient-to-r from-gray-600 to-gray-800 shadow-lg" 
            : "hover:bg-white/5",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Minus className={cn(
          "w-4 h-4 transition-colors",
          action === 'withdraw' ? "text-white" : "text-white/50"
        )} />
        <div className={cn(
          "font-dm-sans font-medium text-[14px] text-center whitespace-pre transition-colors",
          action === 'withdraw' ? "text-white" : "text-white/50"
        )}>
          Withdraw
        </div>
      </button>
    </div>
  );
} 