

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate critical Firebase configuration, especially projectId
const currentProjectId = firebaseConfig.projectId;

// More specific check for common placeholders for project ID
const isPlaceholderProjectId = 
  !currentProjectId ||
  typeof currentProjectId !== 'string' ||
  currentProjectId.trim() === '' ||
  currentProjectId.toLowerCase() === 'your_project_id' ||
  currentProjectId.toLowerCase() === 'your-project-id' ||
  currentProjectId.includes('<') || 
  currentProjectId.includes('>');

if (isPlaceholderProjectId) {
  // This error will be thrown when firebase.ts is first imported,
  // likely during server startup or when a component using it is rendered.
  // This makes the configuration error explicit and halts execution,
  // preventing misleading runtime errors from Firestore due to bad config.
  throw new Error(
    `CRITICAL FIREBASE CONFIGURATION ERROR: Firebase project ID appears to be a placeholder: "${currentProjectId}". ` +
    "Please set NEXT_PUBLIC_FIREBASE_PROJECT_ID in your .env file with your ACTUAL Firebase project ID. " +
    "Firebase cannot be initialized without a valid project ID."
  );
}

// Check for other essential config keys for a typical setup
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.appId) {
    console.warn(
        "Firebase configuration warning: API Key, Auth Domain, or App ID might be missing or are placeholders. " +
        `Current Project ID: "${currentProjectId}". ` +
        "While some services might work if projectId is correct, others (like Auth) will likely fail. " +
        "Please verify all NEXT_PUBLIC_FIREBASE_ variables in your .env file are correctly set with your actual Firebase project details."
    );
}


// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

export { app, db, auth };

