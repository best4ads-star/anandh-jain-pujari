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
 * Designated permanent superadmin email
 */
export const PERMANENT_SUPERADMIN_EMAIL = 'bestanandh@gmail.com';

export function isPermanentSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === PERMANENT_SUPERADMIN_EMAIL;
}

/**
 * Fetch or bootstrap user profile document from users/{uid}.
 * If the user is the designated superadmin (bestanandh@gmail.com),
 * guarantees that their Firestore document exists and has role: 'superadmin'.
 */
export async function fetchAdminProfile(
  uid: string,
  userEmail?: string | null,
  displayName: string = 'Anandh Jain Pujari'
): Promise<AdminAuthProfile | null> {
  const isSuper = isPermanentSuperAdminEmail(userEmail);
  const db = getFirestoreDb();

  // If no Firestore db instance is available yet
  if (!db) {
    if (isSuper) {
      return {
        id: uid,
        email: userEmail || PERMANENT_SUPERADMIN_EMAIL,
        displayName: displayName,
        role: 'superadmin',
        isSuperAdmin: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return null;
  }

  try {
    const docRef = doc(db, COLLECTIONS.USERS, uid);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data() as UserDocument;
      
      // If the authenticated user is bestanandh@gmail.com and the role is not superadmin,
      // update the Firestore document so it contains role: "superadmin"
      if (isSuper && data.role !== 'superadmin') {
        const updatedFields = {
          role: 'superadmin' as const,
          updatedAt: new Date().toISOString(),
        };
        try {
          await setDoc(docRef, updatedFields, { merge: true });
        } catch (setErr) {
          console.warn('Note: Could not merge superadmin role into user doc:', setErr);
        }
        return {
          ...data,
          ...updatedFields,
          id: uid,
          isSuperAdmin: true,
        };
      }

      return {
        ...data,
        id: uid,
        isSuperAdmin: isSuper || data.role === 'superadmin',
        role: isSuper ? 'superadmin' : data.role,
      };
    }

    // If the document does NOT exist and the user is the permanent superadmin,
    // create the document in Firestore with role: "superadmin"
    if (isSuper) {
      const newDoc: UserDocument = {
        id: uid,
        email: userEmail || PERMANENT_SUPERADMIN_EMAIL,
        displayName: displayName,
        role: 'superadmin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        await setDoc(docRef, newDoc);
      } catch (createErr) {
        console.warn('Note: Could not create initial superadmin doc in Firestore:', createErr);
      }

      return {
        ...newDoc,
        isSuperAdmin: true,
      };
    }

    return null;
  } catch (error: any) {
    console.warn('Profile fetch note for uid', uid, error?.message || error);
    if (isSuper) {
      return {
        id: uid,
        email: userEmail || PERMANENT_SUPERADMIN_EMAIL,
        displayName: displayName,
        role: 'superadmin',
        isSuperAdmin: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return null;
  }
}

/**
 * Ensures user profile document in users/{uid} is created with role: "superadmin".
 */
export async function ensureSuperAdminDocument(
  uid: string,
  email: string = PERMANENT_SUPERADMIN_EMAIL,
  displayName: string = 'Anandh Jain Pujari'
): Promise<AdminAuthProfile | null> {
  return fetchAdminProfile(uid, email, displayName);
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
