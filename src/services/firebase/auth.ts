/**
 * Firebase Authentication & User Profile Service
 * 
 * Supports Email/Password authentication for Admin CMS.
 * Synchronizes with users/{uid} document in Firestore.
 */

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirestoreDb } from './app';
import { getFirebaseConfigStatus } from './config';
import { COLLECTIONS, UserDocument } from '../firestore/collections';

export interface AdminAuthProfile extends UserDocument {
  isSuperAdmin: boolean;
}

/**
 * Sign in admin user with email and password
 */
export async function loginAdminUser(email: string, password: string): Promise<FirebaseUser> {
  const status = getFirebaseConfigStatus();
  if (!status.isConfigured) {
    throw new Error('Firebase connection required. Please configure your Firebase environment variables.');
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase Auth service is unavailable.');
  }

  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return userCredential.user;
}

/**
 * Sign out current admin user
 */
export async function logoutAdminUser(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    await signOut(auth);
  }
}

/**
 * Send password reset email
 */
export async function sendAdminPasswordReset(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase Auth service is unavailable.');
  }
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Fetch or bootstrap user profile document from users/{uid}
 */
export async function fetchAdminProfile(uid: string): Promise<AdminAuthProfile | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const docRef = doc(db, COLLECTIONS.USERS, uid);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data() as UserDocument;
      return {
        ...data,
        id: uid,
        isSuperAdmin: data.role === 'superadmin',
      };
    }

    return null;
  } catch (error: any) {
    console.warn('Profile fetch note for uid', uid, error?.message || error);
    return null;
  }
}

/**
 * Fetches user profile document from users/{uid}.
 * Does not create or elevate roles from client code.
 */
export async function ensureSuperAdminDocument(
  uid: string,
  email: string,
  displayName: string = 'Anandh Jain Pujari'
): Promise<AdminAuthProfile | null> {
  return fetchAdminProfile(uid);
}

/**
 * Listen to auth state changes
 */
export function subscribeToAuthChanges(
  callback: (user: FirebaseUser | null) => void
): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}
