'use server';

import { cookies } from 'next/headers';
import { createWorkshop, updateWorkshop } from '@/lib/academy-service';
import { redirect } from 'next/navigation';
import db from '@/lib/firebase-admin';
import { Workshop } from '@/types/academy';

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session?.value) {
    throw new Error('Unauthorized');
  }
  return session.value;
}

export async function createNewWorkshop(formData: FormData) {
  const userId = await getAuthenticatedUser();
  
  // Verify 100K followers again for safety
  const userDoc = await db.firestore().collection('users').doc(userId).get();
  const userData = userDoc.data();
  if (!userData || (userData.followerCount || 0) < 100000) {
    throw new Error('Insufficient followers to create workshops.');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as any;
  const difficulty = formData.get('difficulty') as any;

  if (!title || !description) throw new Error("Missing required fields");

  const workshopData = {
    creatorId: userId,
    creatorName: userData.displayName || 'Creator',
    creatorPhotoURL: userData.photoURL || '',
    title,
    description,
    category,
    difficulty,
    thumbnailUrl: 'https://placehold.co/600x400', // Placeholder or upload separate
    status: 'draft' as const,
    modules: [],
    totalDuration: 0,
    totalLessons: 0,
  };

  try {
     const newWorkshop = await createWorkshop(workshopData as any);
     return { success: true, workshopId: newWorkshop.id };
  } catch (error) {
     console.error("Failed to create workshop", error);
     return { success: false, error: 'Failed to create workshop' };
  }
}

// Minimal action for now, full implementation would involve complex form handling for modules/lessons
