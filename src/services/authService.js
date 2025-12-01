import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged as firebaseOnAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../firebase.js';

/**
 * Sign in with Google using popup authentication
 * @returns {Promise<UserCredential>} The user credential from Firebase
 * @throws {Error} If authentication fails
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    
    // Provide user-friendly error messages
    let errorMessage = 'Failed to sign in with Google';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed. Please try again.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup was blocked by your browser. Please allow popups and try again.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Sign-in was cancelled. Please try again.';
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Sign out the current user
 * @returns {Promise<void>}
 * @throws {Error} If sign-out fails
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign-Out Error:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
}

/**
 * Subscribe to authentication state changes
 * @param {Function} callback - Function to call when auth state changes, receives user or null
 * @returns {Function} Unsubscribe function to stop listening
 */
export function onAuthStateChanged(callback) {
  try {
    return firebaseOnAuthStateChanged(auth, (user) => {
      try {
        callback(user);
      } catch (error) {
        console.error('Error in auth state change callback:', error);
      }
    }, (error) => {
      console.error('Auth state change error:', error);
      // Gracefully degrade to unauthenticated state
      callback(null);
    });
  } catch (error) {
    console.error('Error setting up auth state listener:', error);
    // Return a no-op unsubscribe function
    return () => {};
  }
}

/**
 * Get the current authenticated user
 * @returns {User | null} The current user or null if not authenticated
 */
export function getCurrentUser() {
  return auth.currentUser;
}
