'use client';

import React from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Token } from '../types';
import { TOKENS } from '../lib/constants';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
}

export function SuccessModal({ isOpen, onClose, txHash }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#141517] w-[480px] rounded-3xl border border-white/5 flex flex-col gap-8 p-8">
        {/* Icon and Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-8 h-8 text-black" />
          </div>
          <h2 className="font-dm-sans font-bold text-xl text-white">
            Deposit Successful!
          </h2>
        </div>

        {/* Details */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
          <DetailRow label="Vault" value="DEEP-SUI" tokenA={TOKENS.SUI} tokenB={TOKENS.USDC} />
          <DetailRow label="DEX" value="Momentum" />
          <DetailRow label="Amount" value="1,000 USDC" />
          <DetailRow label="TxHash" value={`${txHash.slice(0, 6)}...${txHash.slice(-4)}`} isLink />
          <DetailRow label="Conversion Rate" value="1 USDC = 1.05 NDLP" />
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#ffe2c4] to-[#e8f3ff] text-black font-dm-sans font-bold text-base"
        >
          Done
        </button>
      </div>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  isLink?: boolean;
  tokenA?: Token;
  tokenB?: Token;
}

const DetailRow = ({ label, value, isLink = false, tokenA, tokenB }: DetailRowProps) => (
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
      <span className={cn("font-ibm-plex-mono text-base text-white", isLink && "underline cursor-pointer")}>
        {value}
      </span>
      {isLink && <ArrowUpRight className="w-4 h-4 text-white" />}
    </div>
  </div>
); 