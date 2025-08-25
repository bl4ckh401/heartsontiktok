import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import  db  from '@/lib/firebase-admin'; // Assuming your Firebase Admin SDK is initialized here

export async function GET() {
  try {
    const campaignsRef = db.firestore().collection('campaigns');
    const snapshot = await campaignsRef.get();

    const campaigns = snapshot.docs.map((doc:any) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, campaigns });
  } catch (error) {
    console.error('Error fetching dummy campaigns:', error);
    return NextResponse.json({ success: false, message: 'Error fetching campaigns' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const campaignName = formData.get('campaignName') as string;
  const description = formData.get('description') as string;
  const budgetAmount = formData.get('totalBudgetKES') as string; // Budget will come as a string
  const brandAssets = formData.getAll('brandAssets') as File[]; // brandAssets will be an array of File objects

  try {
    // Basic validation (add more as needed)
    if (!campaignName || !description) {
      return NextResponse.json({ success: false, message: 'Missing required campaign fields' }, { status: 400 });
    }

    // Convert budgetAmount to a number
    const budget = parseFloat(budgetAmount);
    if (isNaN(budget)) {
       return NextResponse.json({ success: false, message: 'Invalid budget amount' }, { status: 400 });
    }

    // Prepare campaign data for Firestore
    const campaignData = {
      name: campaignName,
      description: description,
      budget: budget,
      // We will handle brand assets separately (e.g., upload to Cloud Storage)
      // and store their references (e.g., URLs) in Firestore.
      // For now, we'll just save the text fields.
    };

    const docRef = await db.firestore().collection('campaigns').add(campaignData);

    // TODO: Handle brand asset file uploads to Cloud Storage here
    // Iterate through brandAssets array and upload each file

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error creating campaign:', error); // Log the actual error
    return NextResponse.json({ success: false, message: 'Error creating campaign' }, { status: 500 });
  }
}