import { useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';
import * as databaseService from '../services/databaseService';

/**
 * Custom hook for authentication state management
 * Uses React 19 optimizations and proper error handling
 */
export function useAuth() {
    const [user, setUser] = useState(null);
    const [userRecord, setUserRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Memoized auth state handler
    const handleAuthStateChange = useCallback(async (firebaseUser) => {
        try {
            setError(null);

            if (firebaseUser) {
                // Sync user data to database
                await databaseService.syncUserData(firebaseUser);

                // Get user record
                const userData = await databaseService.getUserData(firebaseUser.uid);

                setUser(firebaseUser);
                setUserRecord(userData);
            } else {
                setUser(null);
                setUserRecord(null);
            }
        } catch (err) {
            console.error('Auth state change error:', err);
            setError(err.message);
            setUser(null);
            setUserRecord(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged(handleAuthStateChange);

        return () => {
            unsubscribe();
        };
    }, [handleAuthStateChange]);

    // Real-time user record updates
    useEffect(() => {
        let unsubscribeUser = null;

        if (user?.uid) {
            unsubscribeUser = databaseService.listenToUser(user.uid, (userData) => {
                setUserRecord(userData);
            });
        }

        return () => {
            if (unsubscribeUser) {
                unsubscribeUser();
            }
        };
    }, [user?.uid]);

    const signOut = useCallback(async () => {
        try {
            setError(null);
            await authService.signOut();
        } catch (err) {
            console.error('Sign out error:', err);
            setError(err.message);
            throw err;
        }
    }, []);

    const signInWithGoogle = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            const result = await authService.signInWithGoogle();
            return result;
        } catch (err) {
            console.error('Sign in error:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        user,
        userRecord,
        loading,
        error,
        signOut,
        signInWithGoogle,
        isAuthenticated: !!user,
        isAdmin: !!userRecord?.isAdmin,
    };
}