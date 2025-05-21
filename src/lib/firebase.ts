import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, RecaptchaVerifier } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Use optional chaining and nullish coalescing to handle missing env vars gracefully
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? ''
};

// Check if required config values are present
const isMissingConfig = Object.values(firebaseConfig).some(value => !value);

// Initialize Firebase conditionally
let app;
let auth;
let db;
let googleProvider;

try {
  if (isMissingConfig) {
    console.warn('Firebase configuration is incomplete. Some features may not work properly.');
  }
  
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Auth with persistence
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
      console.error('Error setting auth persistence:', error);
    });
  
  // Initialize Firestore
  db = getFirestore(app);
  
  // Initialize Google Auth Provider
  if (typeof window !== 'undefined') {
    import('firebase/auth').then(module => {
      const { GoogleAuthProvider } = module;
      googleProvider = new GoogleAuthProvider();
      googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
      googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    }).catch(err => {
      console.error('Error importing firebase/auth:', err);
    });
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Initialize reCAPTCHA verifier
const initializeRecaptcha = async (containerElement) => {
  if (!auth) return null;
  
  try {
    const verifier = new RecaptchaVerifier(auth, containerElement, {
      size: 'normal',
      callback: () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        window.dispatchEvent(new Event('recaptcha-expired'));
      }
    });

    await verifier.render();
    return verifier;
  } catch (error) {
    console.error('Error initializing reCAPTCHA:', error);
    return null;
  }
};

export { auth, db, googleProvider, initializeRecaptcha };
export default app;