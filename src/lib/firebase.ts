
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
const isProjectIdInvalid = 
  !currentProjectId || 
  typeof currentProjectId !== 'string' ||
  currentProjectId.trim() === '' ||
  currentProjectId === 'your_project_id' || // Exact placeholder
  currentProjectId.toLowerCase().includes('your_project_id') || // Common variations
  currentProjectId.toLowerCase().includes('your-project-id') || // Another common variation
  currentProjectId.toLowerCase().startsWith('demo-') || // Firebase demo project prefix
  currentProjectId.includes('<') || currentProjectId.includes('>'); // Often in placeholder text

if (isProjectIdInvalid) {
  // This error will be thrown when firebase.ts is first imported,
  // likely during server startup or when a component using it is rendered.
  // This makes the configuration error explicit and halts execution,
  // preventing misleading runtime errors from Firestore due to bad config.
  throw new Error(
    `CRITICAL FIREBASE CONFIGURATION ERROR: Firebase project ID is invalid or a placeholder: "${currentProjectId}". ` +
    "Please set NEXT_PUBLIC_FIREBASE_PROJECT_ID in your .env file with your ACTUAL Firebase project ID. " +
    "Firebase cannot be initialized without a valid project ID."
  );
}

// Check for other essential config keys for a typical setup
if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
    console.warn(
        "Firebase configuration warning: API Key or App ID might be missing. " +
        "While projectId is set, other services might be affected. " +
        "Please verify all NEXT_PUBLIC_FIREBASE_ variables in your .env file."
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

