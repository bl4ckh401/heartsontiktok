import { NextRequest, NextResponse } from 'next/server';
import { checkAndUpdateTimeoutPayouts } from '@/lib/payout-timeout';
import { checkAdminRole } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  // Check if user is admin
  const adminCheck = await checkAdminRole(request);
  if (adminCheck) return adminCheck;

  try {
    await checkAndUpdateTimeoutPayouts();
    
    return NextResponse.json({
      success: true,
      message: 'Timeout check completed'
    });

  } catch (error) {
    console.error('Error in timeout check:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check timeouts' },
      { status: 500 }
    );
  }
}