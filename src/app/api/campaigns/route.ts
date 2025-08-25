import { NextResponse } from 'next/server';
import  db  from '@/lib/firebase-admin'; 

export async function GET() {
  try {
    const campaignsRef = db.firestore().collection('campaigns');
    const snapshot = await campaignsRef.get();

    if (snapshot.empty) {
        return NextResponse.json({ success: true, campaigns: [] });
    }

    const campaigns = snapshot.docs.map((doc:any) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, campaigns });
  } catch (error) {
    console.error('Error fetching campaigns from Firestore:', error);
    return NextResponse.json({ success: false, message: 'Error fetching campaigns' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const campaignName = formData.get('campaignName') as string;
  const description = formData.get('description') as string;
  const budgetAmount = formData.get('totalBudgetKES') as string;
  const brandAssetsUrl = formData.get('brandAssetsUrl') as string; 

  try {
    if (!campaignName || !description || !budgetAmount) {
      return NextResponse.json({ success: false, message: 'Missing required campaign fields' }, { status: 400 });
    }

    const budget = parseFloat(budgetAmount);
    if (isNaN(budget)) {
       return NextResponse.json({ success: false, message: 'Invalid budget amount' }, { status: 400 });
    }

    const campaignData = {
      name: campaignName,
      description: description,
      budget: budget,
      brandAssetsUrl: brandAssetsUrl || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.firestore().collection('campaigns').add(campaignData);

    return NextResponse.json({ success: true, id: docRef.id, message: "Campaign created successfully" });
  } catch (error) {
    console.error('Error creating campaign:', error); 
    return NextResponse.json({ success: false, message: 'Error creating campaign' }, { status: 500 });
  }
}
