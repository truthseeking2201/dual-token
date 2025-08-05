import { NextResponse } from 'next/server';
import { PoolService } from '../../../../lib/deposit-logic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pair = searchParams.get('pair') || 'SUI-USDC';
  const ratio = await PoolService.getPoolRatio(pair);
  return NextResponse.json({ success: true, data: ratio, timestamp: Date.now() });
}
