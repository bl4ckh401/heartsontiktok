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

export default admin;
