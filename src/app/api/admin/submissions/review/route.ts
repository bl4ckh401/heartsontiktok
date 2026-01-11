
'use server';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/firebase-admin';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify Admin Role
  const userDoc = await db.firestore().collection('users').doc(session).get();
  if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
     return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const { submissionId, action } = await req.json();

    if (!submissionId || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const submissionRef = db.firestore().collection('submissions').doc(submissionId);
    
    // Determine new status based on action
    const updates = action === 'APPROVE' 
        ? { status: 'APPROVED', payoutStatus: 'ELIGIBLE' }
        : { status: 'REJECTED', payoutStatus: 'REJECTED' };

    await submissionRef.update(updates);

    return NextResponse.json({ success: true, message: `Submission ${action}D successfully` });

  } catch (error: any) {
    console.error('Error processing admin action:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
