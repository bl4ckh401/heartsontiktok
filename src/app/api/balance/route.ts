import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPayoutBalance } from '@/lib/swapuzi';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const balance = await getPayoutBalance();
    return NextResponse.json({ success: true, balance: balance.balance });
  } catch (error: any) {
    console.error('Balance check error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to check balance' 
    }, { status: 500 });
  }
}