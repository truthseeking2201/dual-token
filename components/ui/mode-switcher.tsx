'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface ModeSwitcherProps {
  mode: 'dual' | 'single';
  onModeChange: (mode: 'dual' | 'single') => void;
  disabled?: boolean;
  className?: string;
}

export function ModeSwitcher({
  mode,
  onModeChange,
  disabled = false,
  className
}: ModeSwitcherProps) {
  return (
    <div className={cn("flex flex-row items-center justify-start pl-0 pr-4 py-0", className)}>
      <div className="flex-1 flex flex-row items-center justify-start p-0">
        <button
          onClick={() => onModeChange('single')}
          disabled={disabled}
          className={cn(
            "flex flex-row gap-2.5 h-8 items-center justify-center px-4 py-2 transition-all",
            mode === 'single' 
              ? "text-white font-dm-sans font-medium text-[14px]" 
              : "text-white/50 font-dm-sans font-medium text-[14px] hover:text-white/70",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="whitespace-pre">Zap In</span>
        </button>
        
        <button
          onClick={() => onModeChange('dual')}
          disabled={disabled}
          className={cn(
            "flex flex-row gap-2.5 h-8 items-center justify-center px-4 py-2 rounded-lg transition-all",
            mode === 'dual' 
              ? "text-white font-dm-sans font-medium text-[14px] bg-white/5" 
              : "text-white/50 font-dm-sans font-medium text-[14px] hover:text-white/70 hover:bg-white/2",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="whitespace-pre">Pair In</span>
        </button>
      </div>
      
      {/* Pool Ratio Display */}
      <div className="font-dm-sans font-medium text-[14px] text-white/50 text-right w-[218px] leading-[1.4]">
        <p className="mb-0">
          <span className="font-dm-sans font-normal">Current Pool Ratio</span>
          <span> </span>
        </p>
        <p className="font-ibm-plex-mono font-normal text-white">
          2 SUI : 1 USDC
        </p>
      </div>
    </div>
  );
} 