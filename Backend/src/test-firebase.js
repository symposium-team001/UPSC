import firebaseApp from './config/firebase.js';

if (firebaseApp) {
  console.log('✅ Firebase Admin SDK verification successful!');
  process.exit(0);
} else {
  console.error('❌ Firebase Admin SDK verification failed!');
  process.exit(1);
}
