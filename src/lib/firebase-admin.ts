import * as admin from 'firebase-admin';

// Check if the service account JSON is available
let serviceAccount;
try {
  serviceAccount = require("../../admin.json");
} catch (error) {
  console.error("Firebase service account key not found at `admin.json`. Please ensure the file exists.");
  // Exit gracefully or handle as needed
  // For many environments, you might want to `process.exit(1)` here,
  // but in a serverless/Next.js context, we'll let it fail on initialization attempt.
}

if (!admin.apps.length) {
  try {
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // If you use Realtime Database, you might need this:
        // databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
      });
    } else {
        throw new Error("Service account key is missing.");
    }
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