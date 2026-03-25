import admin from 'firebase-admin';
import { env as config } from './env.js';

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: config.FIREBASE_PROJECT_ID,
    clientEmail: config.FIREBASE_CLIENT_EMAIL,
    // The private key must handle both literal \n in strings and actual newlines
    privateKey: config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

console.log('🔥 Firebase Admin SDK initialized successfully');

export default firebaseApp;
export const messaging = firebaseApp.messaging();
