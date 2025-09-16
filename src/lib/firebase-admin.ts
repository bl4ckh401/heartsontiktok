import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is missing.");
    }
    
    const serviceAccount = JSON.parse(serviceAccountKey);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const auth = admin.auth();

export default admin;

interface CreateUserParams {
  tiktokId: string;
  displayName?: string;
  photoURL?: string;
}

export async function createFirebaseUser(params: CreateUserParams) {
  const { tiktokId, displayName, photoURL } = params;
  try {
    const userRecord = await auth.createUser({
      uid: tiktokId, // Use TikTok ID as Firebase UID for easy linking
      displayName: displayName || `TikTok User ${tiktokId}`,
      photoURL: photoURL,
    });
    console.log('Successfully created new Firebase user:', userRecord.uid);
    return userRecord;
  } catch (error) {
    console.error('Error creating new Firebase user:', error);
    throw error;
  }
}

export async function getFirebaseUser(uid: string) {
  try {
    const userRecord = await auth.getUser(uid);
    return userRecord;
  } catch (error) {
    if ((error as any).code === 'auth/user-not-found') {
      return null;
    }
    console.error('Error fetching Firebase user:', error);
    throw error;
  }
}