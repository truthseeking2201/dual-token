import { NextResponse } from 'next/server';
import { DepositService } from '../../../../lib/deposit-logic';
import { DepositRequest } from '../../../../types';

export async function POST(req: Request) {
  const body = (await req.json()) as DepositRequest;
  try {
    const res = await DepositService.processSingleDca(body);
    return NextResponse.json({ success: true, data: res, timestamp: Date.now() });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message, timestamp: Date.now() }, { status: 400 });
  }
}
