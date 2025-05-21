import { 
  GoogleAuthProvider, 
  PhoneAuthProvider, 
  Auth,
  AuthProvider,
  AuthError
} from 'firebase/auth';
import { auth } from '../firebase';

// Custom error class for authentication provider initialization
class ProviderInitializationError extends Error {
  constructor(provider: string, cause?: Error) {
    super(`Failed to initialize ${provider} provider`);
    this.name = 'ProviderInitializationError';
    this.cause = cause;
  }
}

// Provider configuration interface
interface ProviderConfig {
  auth: Auth;
  scopes?: string[];
  customParameters?: Record<string, string>;
}

// Initialize Google provider with error handling
function createGoogleProvider({ auth, scopes = [], customParameters = {} }: ProviderConfig): GoogleAuthProvider {
  try {
    const provider = new GoogleAuthProvider();
    
    // Add scopes
    scopes.forEach(scope => provider.addScope(scope));
    
    // Set custom parameters
    provider.setCustomParameters({
      prompt: 'select_account',
      ...customParameters
    });

    return provider;
  } catch (error) {
    throw new ProviderInitializationError('Google', error as Error);
  }
}

// Initialize Phone provider with error handling
function createPhoneProvider({ auth }: ProviderConfig): PhoneAuthProvider {
  try {
    return new PhoneAuthProvider(auth);
  } catch (error) {
    throw new ProviderInitializationError('Phone', error as Error);
  }
}

// Initialize providers
export const googleProvider = createGoogleProvider({
  auth,
  scopes: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ]
});

export const phoneProvider = createPhoneProvider({ auth });

// Add debug logging for development
if (process.env.NODE_ENV === 'development') {
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.debug('Auth state changed - User signed in:', {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        providerData: user.providerData?.map(provider => ({
          providerId: provider.providerId,
          uid: provider.uid,
          email: provider.email
        }))
      });
    } else {
      console.debug('Auth state changed - User signed out');
    }
  });
}

// Helper function to handle auth errors
export function handleAuthError(error: AuthError): string {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Invalid password';
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign in popup was blocked. Please enable popups for this site.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
}

// Export auth instance and types
export { auth };
export type { AuthError, AuthProvider };