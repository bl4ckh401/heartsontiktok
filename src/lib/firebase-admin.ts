
import * as admin from 'firebase-admin';

const serviceAccount = require("../admin.json")

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export default admin;
