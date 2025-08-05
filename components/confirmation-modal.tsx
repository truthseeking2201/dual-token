'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Token } from '../types';
import { formatNumber, cn } from '../lib/utils';
import { TOKENS } from '../lib/constants';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  depositData: {
    mode: 'dual' | 'single';
    tokenAAmount: number;
    tokenBAmount: number;
    estimatedNDLP: number;
  };
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  depositData
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const { mode, tokenAAmount, tokenBAmount, estimatedNDLP } = depositData;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#141517] w-[480px] rounded-3xl border border-white/5 flex flex-col gap-6 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-dm-sans font-bold text-xl text-white">
            Confirm Your Deposit
          </h2>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Details */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-4">
          <div className="space-y-2">
            <DetailRow label="Vault" value="DEEP-SUI" tokenA={TOKENS.SUI} tokenB={TOKENS.USDC} />
            <DetailRow label="DEX" value="Momentum" />
            {mode === 'dual' ? (
              <>
                <DetailRow label="Amount" value={`${formatNumber(tokenAAmount, { decimals: 2 })} SUI`} />
                <DetailRow label="" value={`${formatNumber(tokenBAmount, { decimals: 2 })} USDC`} />
              </>
            ) : (
              <DetailRow label="Amount" value={`${formatNumber(tokenBAmount, { decimals: 2 })} USDC`} />
            )}
            <DetailRow label="Conversion Rate" value="1 USDC = 1.05 NDLP" />
          </div>
          <div className="h-px bg-white/15" />
          <div className="space-y-2">
            <DetailRow label="Est. Max Receive" value={`${formatNumber(estimatedNDLP, { decimals: 2 })} NDLP`} tokenA={TOKENS.NDLP} />
            <DetailRow label="Transaction Fee" value="Free" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 w-full">
          <button
            onClick={onClose}
            className="w-[120px] h-[52px] rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-dm-sans font-semibold text-base text-gray-200"
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "flex-1 h-[52px] rounded-xl bg-gradient-to-r from-[#ffe2c4] to-[#e8f3ff] text-black font-dm-sans font-bold text-base",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? 'Confirming...' : 'Confirm Deposit'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  tokenA?: Token;
  tokenB?: Token;
}

const DetailRow = ({ label, value, tokenA, tokenB }: DetailRowProps) => (
  <div className="flex items-center justify-between h-8">
    <span className="font-dm-sans text-base text-gray-400">{label}</span>
    <div className="flex items-center gap-2">
      {tokenA && (
        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">{tokenA.symbol.charAt(0)}</span>
        </div>
      )}
      {tokenB && (
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center -ml-3">
          <span className="text-white text-xs font-bold">{tokenB.symbol.charAt(0)}</span>
        </div>
      )}
      <span className="font-ibm-plex-mono text-lg text-white">{value}</span>
    </div>
  </div>
); 