import { NextResponse } from 'next/server';
import { WalletService } from '../../../../lib/deposit-logic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address') || '';
  const balances = await WalletService.getWalletBalances(address);
  return NextResponse.json({ success: true, data: balances, timestamp: Date.now() });
}
