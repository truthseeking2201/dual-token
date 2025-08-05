import { LiquidityManager } from '../components/liquidity-manager';

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 font-dm-sans">
            Dual Token Deposit System
          </h1>
          <p className="text-white/70 text-lg font-dm-sans">
            Advanced liquidity management with dual token deposits
          </p>
        </div>
        
        <LiquidityManager />
      </div>
    </main>
  );
} 